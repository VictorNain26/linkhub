import prisma from "../src/lib/prisma";

async function main() {
  const alice = await prisma.user.upsert({
    where: { email: "alice@example.com" },
    update: {},
    create: {
      email: "alice@example.com",
      name: "Alice",
      links: {
        create: [
          { slug: "github", url: "https://github.com/alice" },
          { slug: "site", url: "https://alice.dev" },
        ],
      },
    },
  });
  console.log(`Seeded user ${alice.email}`);
}

main().finally(() => prisma.$disconnect());
