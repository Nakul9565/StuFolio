import prisma from "./lib/prisma";
import { Prisma } from "@prisma/client";

/**
 * DEBUG SCRIPT: Verifies attendance relation data.
 */
async function debug() {
    console.log("--- Attendance Data Debug ---");

    const include = {
        user: { select: { name: true, email: true } },
        attendances: { include: { subject: true } },
        dailyAttendances: { include: { subject: true }, orderBy: { date: 'desc' as const } }
    };

    // Fetch students with relations explicitly
    const students = await prisma.student.findMany({ include }) as any[];

    if (students.length === 0) {
        console.log("No students found in database.");
        return;
    }

    for (const student of students) {
        console.log(`\nStudent: ${student.user.name} (${student.enrollment})`);

        console.log("Summaries (Attendance Table):");
        student.attendances.forEach((a: any) => {
            const pct = a.total > 0 ? ((a.attended / a.total) * 100).toFixed(1) : "0";
            console.log(`  - ${a.subject.code}: ${a.attended}/${a.total} (${pct}%)`);
        });

        console.log("Daily Logs (DailyAttendances Table - Latest 5):");
        const logs = student.dailyAttendances;
        if (logs.length === 0) {
            console.log("  (No daily attendance logs found)");
        } else {
            logs.slice(0, 5).forEach((da: any) => {
                const dateStr = da.date instanceof Date ? da.date.toISOString().split('T')[0] : String(da.date);
                console.log(`  - ${dateStr} | ${da.subject.code}: ${da.status}`);
            });
        }
    }
}

debug()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
