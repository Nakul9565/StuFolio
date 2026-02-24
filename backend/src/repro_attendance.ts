import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function test() {
    const student = await prisma.student.findFirst({
        where: { enrollment: "09520802724" }
    });
    const subject = await prisma.subject.findFirst({
        where: { code: "CS212" }
    });
    const mentor = await prisma.mentor.findFirst();

    if (!student || !subject || !mentor) {
        console.error("Data not found");
        return;
    }

    const date = new Date();
    date.setHours(0, 0, 0, 0);

    console.log(`Initial state for ${student.enrollment} - ${subject.code}`);
    let att = await prisma.attendance.findUnique({
        where: { studentId_subjectId: { studentId: student.id, subjectId: subject.id } }
    });
    console.log(`Aggregate: ${att?.attended}/${att?.total}`);

    // Simulate marking ABSENT
    console.log("\nMarking ABSENT...");

    // This is a simplified version of the logic in mentor.ts
    await prisma.$transaction(async (tx) => {
        const existing = await tx.dailyAttendance.findUnique({
            where: { studentId_subjectId_date: { studentId: student.id, subjectId: subject.id, date } }
        });
        const oldStatus = existing ? existing.status : "NO_CLASS";
        const newStatus = "ABSENT";

        if (oldStatus !== newStatus) {
            await tx.dailyAttendance.upsert({
                where: { studentId_subjectId_date: { studentId: student.id, subjectId: subject.id, date } },
                create: { studentId: student.id, subjectId: subject.id, date, status: newStatus, mentorId: mentor.id },
                update: { status: newStatus }
            });

            const updateData: any = {};
            if (oldStatus === "NO_CLASS") {
                updateData.total = { increment: 1 };
            } else if (oldStatus === "PRESENT") {
                updateData.attended = { decrement: 1 };
            }

            if (Object.keys(updateData).length > 0) {
                await tx.attendance.upsert({
                    where: { studentId_subjectId: { studentId: student.id, subjectId: subject.id } },
                    create: { studentId: student.id, subjectId: subject.id, total: 1, attended: 0 },
                    update: updateData
                });
            }
        }
    });

    att = await prisma.attendance.findUnique({
        where: { studentId_subjectId: { studentId: student.id, subjectId: subject.id } }
    });
    console.log(`Final state Aggregate: ${att?.attended}/${att?.total}`);
}

test()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
