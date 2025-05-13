import prisma from "../../src/config/prismaClient";

export async function seedSubscriptions() {
  await prisma.subscriptions.create({
    data: {
      start_date: new Date(),
      is_active: true,
      plan_id: (await prisma.subscriptionPLan.findFirst({
        where: { name: "Basic Plan" },
      }))!.id,
    },
  });
}
