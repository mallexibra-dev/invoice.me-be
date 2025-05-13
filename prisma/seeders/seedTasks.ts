import prisma from '../../src/config/prismaClient';

export async function seedTasks() {
  const company = await prisma.companies.findFirst({ where: { name: 'PT Teknologi Hebat' } });

  if (company) {
    await prisma.tasks.createMany({
      data: [
        {
          title: 'Design Website',
          description: 'Design a new company website',
          unit_price: 500000,
          company_id: company.id,
        },
        {
          title: 'Develop App',
          description: 'Develop the mobile application',
          unit_price: 1000000,
          company_id: company.id,
        },
      ],
    });
  }
}