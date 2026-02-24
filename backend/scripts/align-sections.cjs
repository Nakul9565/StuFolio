const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
    const result = await prisma.student.updateMany({
        data: { section: "CSE-B" }
    });
    const mentorResult = await prisma.mentor.updateMany({
        data: { section: "CSE-B" }
    });
    console.log(`Updated ${result.count} students and ${mentorResult.count} mentors to section CSE-B`);
}

main().finally(() => prisma.$disconnect());
