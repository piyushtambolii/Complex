const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function promote(phone) {
  try {
    const user = await prisma.user.update({
      where: { phone },
      data: { role: "SUPERADMIN" }
    });
    console.log(`Successfully promoted ${user.name} (${user.phone}) to SUPERADMIN!`);
  } catch (e) {
    console.error("Error: Could not find a user with that phone number.");
    console.error(e.message);
  } finally {
    await prisma.$disconnect();
  }
}

const targetPhone = process.argv[2];

if (!targetPhone) {
  console.log("Usage: node promote_admin.js <phone_number>");
  process.exit(1);
}

promote(targetPhone);
