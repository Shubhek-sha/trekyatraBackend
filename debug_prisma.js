import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  try {
    const difficulty = 'Moderate';
    const similarTreks = await prisma.trek.findMany({
      where: {
        difficulty: {
          contains: difficulty,
          // mode: 'insensitive', // Commenting out to see if this is the issue
        },
      },
      take: 5,
    });
    console.log(similarTreks);
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
