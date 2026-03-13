import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Users ---');
  const users = await prisma.user.findMany();
  console.log(users);

  console.log('\n--- Food Items ---');
  const items = await prisma.foodItem.findMany();
  console.log(items);

  console.log('\n--- Orders ---');
  const orders = await prisma.order.findMany();
  console.log(JSON.stringify(orders, null, 2));

  console.log('\nVerification complete!');
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
