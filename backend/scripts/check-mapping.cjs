const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
    const mentors = await prisma.mentor.findMany({ include: { user: true } });
    const students = await prisma.student.findMany({ include: { user: true } });

    console.log("=== MENTORS ===");
    for (const m of mentors) {
        console.log(`- [${m.user.email}] Section: "${m.section}" Name: ${m.user.name}`);
    }

    console.log("\n=== STUDENTS ===");
    for (const s of students) {
        console.log(`- [${s.user.email}] Section: "${s.section}" Name: ${s.user.name}`);
    }
}

main().finally(() => prisma.$disconnect());
