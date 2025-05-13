import prisma from '../../src/config/prismaClient';

export async function seedUsers() {
  const company = await prisma.companies.findFirst({ where: { name: 'PT Teknologi Hebat' } });

  if (company) {
    await prisma.user.create({
      data: {
        email: 'admin@teknologihebat.com',
        password: 'admin-123',
        role: 'owner',
        company_id: company.id,
      },
    });
  }
}