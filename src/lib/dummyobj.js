import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const messages = [];

  for (let i = 0; i < 500; i++) {
    messages.push({
      senderId: "68c558ce15677a3de77088ee",     // empty
      receiverId: "68c5511615677a3de77088ea",   // empty
      status: 'read',   
      content : `this is created my a copied query message staart from .......... ${i}` , // set status,
      // you can add other fields if needed, Prisma will use defaults if defined
      createdAt : new Date(Date.now() + i * 60 * 1000)
    });
  }

  // Bulk insert
  const createdMessages = await prisma.message.createMany({
    data: messages,
  });

  console.log(`Created ${createdMessages.count} messages`);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
