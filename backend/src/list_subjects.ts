import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function listSubjects() {
    const subjects = await prisma.subject.findMany();
    console.log("Subjects in database:");
    subjects.forEach(s => {
        console.log(`  - ID: ${s.id} | Name: ${s.name} | Code: ${s.code}`);
    });
}

listSubjects().catch(console.error).finally(() => prisma.$disconnect());
