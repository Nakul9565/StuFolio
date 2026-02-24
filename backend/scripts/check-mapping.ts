import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const students = await prisma.student.findMany({
        include: { user: { select: { name: true, email: true, role: true } } }
    });
    const mentors = await prisma.mentor.findMany({
        include: { user: { select: { name: true, email: true, role: true } } }
    });

    console.log("--- MENTORS ---");
    mentors.forEach(m => {
        console.log(`Mentor: ${m.user.name} (${m.user.email}) | Section: ${m.section}`);
    });

    console.log("\n--- STUDENTS ---");
    students.forEach(s => {
        console.log(`Student: ${s.user.name} (${s.user.email}) | Section: ${s.section}`);
    });
}

main()
    .catch((e) => console.error(e))
    .finally(() => prisma.$disconnect());
