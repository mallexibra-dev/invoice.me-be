import prisma from '../../src/config/prismaClient';

export async function seedTemplates() {
  const company = await prisma.companies.findFirst({ where: { name: 'PT Teknologi Hebat' } });
  const user = await prisma.user.findFirst({ where: { email: 'admin@teknologihebat.com' } });

  if (company && user) {
    await prisma.templates.createMany({
      data: [
        {
          name: 'Invoice Template',
          content: '<html><body>Invoice Template</body></html>',
          is_default: true,
          company_id: company.id,
          user_id: user.id,
        },
        {
          name: 'Quote Template',
          content: '<html><body>Quote Template</body></html>',
          is_default: false,
          company_id: company.id,
          user_id: user.id,
        },
      ],
    });
  }
}