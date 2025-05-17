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

  console.log("Seeding plans");
  await seedSubscriptionPlans();
  
  console.log("Seeding subscriptions");
  await seedSubscriptions();

  console.log("Seeding companies");
  await seedCompanies();

  console.log("Seeding payments");
  await seedPayments();

  console.log("Seeding users");
  await seedUsers();

  console.log("Seeding clients");
  await seedClients();

  console.log("Seeding tasks");
  await seedTasks();

  console.log("Seeding templates");
  await seedTemplates();

  console.log("Seeding invoices");
  await seedInvoices();

  console.log("Seeding finishing.");
}

main()
  .catch((e: any) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
