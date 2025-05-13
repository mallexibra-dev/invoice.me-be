import prisma from '../../src/config/prismaClient';

export async function seedPayments() {
  const company = await prisma.companies.findFirst({ where: { name: 'PT Teknologi Hebat' } });

  if (company) {
    await prisma.payment.createMany({
      data: [
        {
          name: 'BCA',
          account_name: 'PT Teknologi Hebat',
          account_number: '1234567890',
          type: 'bank',
          is_default: true,
          company_id: company.id,
        },
        {
          name: 'OVO',
          account_name: 'PT Teknologi Hebat',
          account_number: '9876543210',
          type: 'ewallet',
          is_default: false,
          company_id: company.id,
        },
      ],
    });
  }
}