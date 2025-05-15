import prisma from '../../src/config/prismaClient';
import supabase from '../../src/config/supabaseClient';

export async function seedUsers() {
  const company = await prisma.companies.findFirst({ where: { id: 'comp-1' } });

  const {data} = await supabase.auth.signUp({
    email: "mallexibra@gmail.com",
    password: "admin-123"
  });

  if (company) {
    await prisma.user.create({
      data: {
        id: data.user?.id,
        role: 'owner',
        name: "Maulana Malik Ibrahim",
        company_id: company.id,
      },
    });
  }
}