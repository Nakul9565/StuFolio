import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkToday() {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    console.log("Checking records for date (UTC normalized):", today.toISOString());

    // 1. Check daily logs
    const logs = await prisma.dailyAttendance.findMany({
        where: { date: today },
        include: {
            student: { include: { user: { select: { name: true } } } },
            subject: true
        }
    });

    console.log(`Found ${logs.length} DAILY LOGS for today.`);
    logs.forEach(l => {
        console.log(`  - ${l.student.user.name} | ${l.subject.code}: ${l.status}`);
    });

    // 2. Check aggregates for those students/subjects
    console.log("\nChecking AGGREGATE SUMMARY for these subjects:");
    for (const log of logs) {
        const agg = await prisma.attendance.findUnique({
            where: {
                studentId_subjectId: {
                    studentId: log.studentId,
                    subjectId: log.subjectId
                }
            }
        });
        console.log(`  - ${log.student.user.name} | ${log.subject.code}: ${agg?.attended}/${agg?.total} (${agg ? ((agg.attended / agg.total) * 100).toFixed(1) : 0}%)`);
    }
}

checkToday().catch(console.error).finally(() => prisma.$disconnect());
