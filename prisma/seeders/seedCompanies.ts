import prisma from '../../src/config/prismaClient';

export async function seedCompanies() {
  await prisma.companies.createMany({
    data: [
      {
        id: 'comp-1',
        name: 'PT Teknologi Hebat',
        email: 'admin@teknologihebat.com',
        address: 'Jl. Inovasi No. 88, Jakarta',
        phone: '081234567890',
        logo: '/logos/teknologihebat.png',
        brand_color: '#1D4ED8',
      },
    ],
  });
}