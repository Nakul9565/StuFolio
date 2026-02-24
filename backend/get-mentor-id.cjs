const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
    const mentors = await prisma.mentor.findMany({
        include: { user: { select: { email: true, name: true } } }
    });
    console.log("=== MENTOR LIST ===");
    mentors.forEach(m => {
        console.log(`Email: ${m.user.email}`);
        console.log(`Mentor ID: ${m.id}`);
        console.log(`User ID:   ${m.userId}`);
        console.log("-------------------");
    });
}

main().finally(() => prisma.$disconnect());
