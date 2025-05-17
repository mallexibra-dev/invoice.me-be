import prisma from '../../src/config/prismaClient';
import supabase from '../../src/config/supabaseClient';

export async function seedUsers() {
  const company = await prisma.companies.findFirst({ where: { id: 'comp-1' } });

  const {data} = await supabase.auth.signUp({
    email: "mallexibra@gmail.com",
    password: "admin-123"
  });

  const {data: administrator} = await supabase.auth.signUp({
    email: "administrator@gmail.com",
    password: "admin-123"
  });

  if(administrator) await prisma.user.create({
    data: {
      id: administrator.user?.id,
      role: "administrator",
      name: "Administrator",
      company_id: null
    }
  })

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