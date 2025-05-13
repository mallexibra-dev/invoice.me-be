import prisma from '../../src/config/prismaClient';

export async function seedSubscriptionPlans() {
  await prisma.subscriptionPLan.createMany({
    data: [
      {
        name: 'Basic Plan',
        price: 49000,
        max_users: 3,
        max_invoices: 30,
        whatsapp_reminder: true,
        export_excel: false,
        auto_reminder: true,
      },
      {
        name: 'Pro Plan',
        price: 149000,
        max_users: 10,
        max_invoices: 200,
        whatsapp_reminder: true,
        export_excel: true,
        auto_reminder: true,
      },
    ],
  });
}