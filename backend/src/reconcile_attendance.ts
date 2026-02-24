import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function reconcile() {
    console.log("Starting attendance reconciliation...");

    // 1. Get all daily attendance records
    const logs = await prisma.dailyAttendance.findMany({
        include: { subject: true, student: true }
    });

    console.log(`Analyzing ${logs.length} daily logs...`);

    const cleanedLogs: any[] = [];
    const seen = new Set();

    for (const log of logs) {
        // Normalize date to UTC Midnight
        const d = new Date(log.date);
        // If it's 18:30 UTC, it was intended to be the NEXT day in IST.
        // But let's just assume any time between 12:00 UTC and 23:59 UTC belongs to that day's IST or next day's UTC.
        // The most consistent way: If it's > 12:00 UTC, it's likely IST midnight of the day shown? 
        // Actually, if it's 18:30 on Feb 23, it means Feb 24 00:00 IST.
        // So we should add 5.5 hours THEN set to midnight UTC.
        const normalized = new Date(d.getTime() + 5.5 * 60 * 60 * 1000);
        normalized.setUTCHours(0, 0, 0, 0);

        const key = `${log.studentId}-${log.subjectId}-${normalized.toISOString()}`;

        if (seen.has(key)) {
            console.log(`  - Duplicate found for ${key}. Deleting old ID: ${log.id}`);
            await prisma.dailyAttendance.delete({ where: { id: log.id } });
            continue;
        }

        seen.add(key);

        if (d.getTime() !== normalized.getTime()) {
            console.log(`  - Fixing date: ${d.toISOString()} -> ${normalized.toISOString()} for ID: ${log.id}`);
            await prisma.dailyAttendance.update({
                where: { id: log.id },
                data: { date: normalized }
            });
        }
    }

    console.log("Recalculating aggregate totals...");

    // 2. Clear aggregate table
    // (Or just update them one by one based on new counts)
    await prisma.attendance.deleteMany({});

    // 3. Re-read cleaned logs
    const allLogs = await prisma.dailyAttendance.findMany();

    const aggregates: Record<string, { studentId: string, subjectId: string, attended: number, total: number }> = {};

    for (const log of allLogs) {
        const key = `${log.studentId}-${log.subjectId}`;
        if (!aggregates[key]) {
            aggregates[key] = { studentId: log.studentId, subjectId: log.subjectId, attended: 0, total: 0 };
        }

        aggregates[key].total += 1;
        if (log.status === "PRESENT") {
            aggregates[key].attended += 1;
        }
    }

    // 4. Batch create aggregates
    for (const agg of Object.values(aggregates)) {
        console.log(`  - Updating ${agg.studentId} | ${agg.subjectId}: ${agg.attended}/${agg.total}`);
        await prisma.attendance.create({
            data: agg
        });
    }

    console.log("Reconciliation complete.");
}

reconcile()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
