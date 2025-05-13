import prisma from '../../src/config/prismaClient';

export async function seedInvoices() {
  const company = await prisma.companies.findFirst({ where: { name: 'PT Teknologi Hebat' } });
  const client = await prisma.clients.findFirst({ where: { name: 'Client A' } });
  const user = await prisma.user.findFirst({ where: { role: 'owner' } });
  const template = await prisma.templates.findFirst({ where: { name: 'Invoice Template' } });

  if (company && client && user && template) {
    await prisma.invoices.create({
      data: {
        company_id: company.id,
        client_id: client.id,
        user_id: user.id,
        invoice_number: 'INV-12345',
        title: 'Invoice for Services',
        status: 'unpaid',
        issue_date: new Date(),
        due_date: new Date(),
        notes: 'This is a test invoice.',
        template_id: template.id,
        total: 1500000,
      },
    });
  }
}