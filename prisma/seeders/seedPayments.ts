import prisma from "../../src/config/prismaClient";

export async function seedPayments() {
  const company = await prisma.companies.findFirst({
    where: { name: "PT Teknologi Hebat" },
  });
  const wallet = await prisma.wallet.create({
    data: {
      name: "Bank BRI",
      logo: "bri.png",
      type: "bank",
    },
  });

  if (company && wallet) {
    await prisma.payment.createMany({
      data: [
        {
          account_name: "PT Teknologi Hebat",
          account_number: "1234567890",
          wallet_id: wallet.id,
          is_default: true,
          company_id: company.id,
        },
      ],
    });
  }
}
