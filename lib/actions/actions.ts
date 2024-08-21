"use server";

import {
  CaseColor,
  CaseFinish,
  CaseMaterial,
  Order,
  OrderStatus,
  PhoneModel,
} from "@prisma/client";
import { db } from "../db";
import { BASE_PRICE, PRODUCT_PRICES } from "@/constants";
import { stripe } from "../stripe";
import { currentUser } from "@clerk/nextjs/server";

export type SaveConfigArgs = {
  color: CaseColor;
  finish: CaseFinish;
  material: CaseMaterial;
  model: PhoneModel;
  configId: string;
};

export async function saveConfig({
  color,
  finish,
  material,
  model,
  configId,
}: SaveConfigArgs) {
  await db.configuration.update({
    where: { id: configId },
    data: { color, finish, material, model },
  });
}

export async function createCheckoutSession({
  configId,
}: {
  configId: string;
}) {
  const configuration = await db.configuration.findUnique({
    where: { id: configId },
  });

  if (!configuration) {
    throw new Error("Configuration not found");
  }

  const user = await currentUser();

  if (!user) {
    throw new Error("You must be logged in");
  }

  const { finish, material } = configuration;
  let price = BASE_PRICE;
  if (finish === "textured") {
    price += PRODUCT_PRICES.finish.textured;
  }
  if (material === "polycarbonate") {
    price += PRODUCT_PRICES.material.polycarbonate;
  }

  let order: Order | undefined = undefined;

  const existingOrder = await db.order.findFirst({
    where: {
      userId: user.id,
      configurationId: configuration.id,
    },
  });

  if (existingOrder) {
    order = existingOrder;
  } else {
    order = await db.order.create({
      data: {
        userId: user.id,
        configurationId: configuration.id,
        amount: price / 100,
      },
    });
  }
  const product = await stripe.products.create({
    name: "Custom iPhone Case",
    images: [configuration.imageUrl],
    default_price_data: {
      currency: "USD",
      unit_amount: price,
    },
  });

  const stripeSession = await stripe.checkout.sessions.create({
    success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you?orderId=${order.id}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/configure/preview?id=${configuration.id}`,
    payment_method_types: ["card"],
    mode: "payment",
    shipping_address_collection: { allowed_countries: ["DE", "US"] },
    metadata: {
      userId: user.id,
      orderId: order.id,
    },
    line_items: [{ price: product.default_price as string, quantity: 1 }],
  });

  return { url: stripeSession.url };
}

export const getAuthStatus = async () => {
  const user = await currentUser();

  if (!user?.id || !user.emailAddresses[0].emailAddress) {
    throw new Error("Invalid user data");
  }

  const { id: userId } = user;

  const existingUser = await db.user.findFirst({
    where: { id: userId },
  });

  if (!existingUser) {
    await db.user.create({
      data: {
        id: user.id,
        email: user.emailAddresses[0].emailAddress,
      },
    });
  }

  return { success: true };
};

export const getPaymentStatus = async ({ orderId }: { orderId: string }) => {
  const user = await currentUser();

  if (!user?.id || !user.emailAddresses[0].emailAddress) {
    throw new Error("You need to be logged in to view this page.");
  }

  const order = await db.order.findFirst({
    where: { id: orderId, userId: user.id },
    include: {
      billingAddress: true,
      configuration: true,
      shippingAddress: true,
      user: true,
    },
  });

  if (!order) throw new Error("This order does not exist.");

  if (order.isPaid) {
    return order;
  } else {
    return false;
  }
};

export const changeOrderStatus = async ({
  id,
  newStatus,
}: {
  id: string;
  newStatus: OrderStatus;
}) => {
  await db.order.update({
    where: { id },
    data: { status: newStatus },
  });
};

export async function createUser({ id, email }: { id: string; email: string }) {
  const newUser = await db.user.create({
    data: {
      id,
      email,
    },
  });
  if (!newUser) {
    throw new Error("Error creating user");
  }
  return { success: true };
}
