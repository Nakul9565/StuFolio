import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkAggregates() {
    const atts = await prisma.attendance.findMany({
        include: {
            student: { include: { user: { select: { name: true } } } },
            subject: true
        }
    });
    console.log("Current Attendance Aggregates:");
    atts.forEach(a => {
        console.log(`  - ${a.student.user.name} | ${a.subject.code}: ${a.attended}/${a.total} (${((a.attended / a.total) * 100).toFixed(1)}%)`);
    });
}

checkAggregates().catch(console.error).finally(() => prisma.$disconnect());
