import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function check() {
    const studentId = (await prisma.student.findFirst({ where: { enrollment: "09520802724" } }))?.id;
    const subjectId = (await prisma.subject.findFirst({ where: { code: "CS212" } }))?.id;

    if (!studentId || !subjectId) {
        console.error("IDs not found");
        return;
    }

    const summary = await prisma.attendance.findUnique({
        where: { studentId_subjectId: { studentId, subjectId } }
    });
    console.log("Summary Table Record:", summary);

    const logs = await prisma.dailyAttendance.findMany({
        where: { studentId, subjectId },
        orderBy: { date: 'desc' }
    });
    console.log("Daily Attendance Logs:", logs);
}

check().catch(console.error).finally(() => prisma.$disconnect());
