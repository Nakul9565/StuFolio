import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkAllDaily() {
    const logs = await prisma.dailyAttendance.findMany({
        orderBy: { date: 'desc' },
        take: 10
    });
    console.log("Recent DailyAttendance records:");
    logs.forEach(l => {
        console.log(`  - ID: ${l.id} | Date: ${l.date.toISOString()} | Raw: ${l.date}`);
    });
}

checkAllDaily().catch(console.error).finally(() => prisma.$disconnect());
