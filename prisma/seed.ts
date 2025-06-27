import prisma from "../src/lib/prisma";

/* ▸ (Optionnel) reset pour dev : vide les tables avant de reseeder */
async function reset() {
  await prisma.verificationToken.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.link.deleteMany();
  await prisma.membership.deleteMany();
  await prisma.tenant.deleteMany();
  await prisma.user.deleteMany();
}

async function main() {
  await reset(); // ⬅️ supprime si tu veux cumuler les seeds

  /* ─────────────── Users ─────────────── */
  const alice = await prisma.user.create({
    data: {
      email: "alice@example.com",
      name: "Alice",
      image: "https://i.pravatar.cc/150?u=alice",
    },
  });

  const bob = await prisma.user.create({
    data: {
      email: "bob@example.com",
      name: "Bob",
      image: "https://i.pravatar.cc/150?u=bob",
    },
  });

  /* ─────────── Tenant d’Alice ─────────── */
  const aliceTenant = await prisma.tenant.create({
    data: {
      name: "Alice Hub",
      slug: "alice",
      members: {
        create: [{ userId: alice.id, role: "OWNER" }],
      },
      links: {
        create: [
          {
            slug: "github",
            url: "https://github.com/alice",
            userId: alice.id,
          },
          {
            slug: "site",
            url: "https://alice.dev",
            userId: alice.id,
          },
        ],
      },
    },
  });

  /* ─────────── Tenant de Bob ─────────── */
  const bobTenant = await prisma.tenant.create({
    data: {
      name: "Bob Space",
      slug: "bob",
      members: {
        create: [
          { userId: bob.id, role: "OWNER" },
          { userId: alice.id, role: "USER" },
        ],
      },
      links: {
        create: [
          {
            slug: "linkedin",
            url: "https://linkedin.com/in/bob",
            userId: bob.id,
          },
          {
            slug: "x",
            url: "https://twitter.com/bob",
            userId: bob.id,
          },
        ],
      },
    },
  });

  /* ─────────────── Log final ─────────────── */
  console.table({
    users: [alice.email, bob.email],
    tenants: [aliceTenant.slug, bobTenant.slug],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
