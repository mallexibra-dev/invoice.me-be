import prisma from "../src/config/prismaClient";
import { seedClients } from "./seeders/seedClients";
import { seedCompanies } from "./seeders/seedCompanies";
import { seedInvoices } from "./seeders/seedInvoices";
import { seedPayments } from "./seeders/seedPayments";
import { seedSubscriptionPlans } from "./seeders/seedSubscriptionPlans";
import { seedSubscriptions } from "./seeders/seedSubscriptions";
import { seedTasks } from "./seeders/seedTasks";
import { seedTemplates } from "./seeders/seedTemplates";
import { seedUsers } from "./seeders/seedUsers";

async function main() {
  console.log("Seeding starting.");

  await seedSubscriptionPlans();
  await seedCompanies();
  await seedSubscriptions();
  await seedPayments();
  await seedUsers();
  await seedClients();
  await seedTasks();
  await seedTemplates();
  await seedInvoices();

  console.log("Seeding finishing.");
}

main()
  .catch((e: any) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
