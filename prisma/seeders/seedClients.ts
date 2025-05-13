import prisma from '../../src/config/prismaClient';

export async function seedClients() {
  const company = await prisma.companies.findFirst({ where: { name: 'PT Teknologi Hebat' } });

  if (company) {
    await prisma.clients.createMany({
      data: [
        {
          name: 'Client A',
          email: 'clienta@teknologihebat.com',
          phone: '081234567890',
          address: 'Jl. Raya No. 123, Jakarta',
          company_id: company.id,
        },
        {
          name: 'Client B',
          email: 'clientb@teknologihebat.com',
          phone: '081234567891',
          address: 'Jl. Merdeka No. 456, Jakarta',
          company_id: company.id,
        },
      ],
    });
  }
}