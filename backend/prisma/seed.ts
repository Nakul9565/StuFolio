import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    // console.log("🌱 Clearing and seeding database for live testing...\n");

    // Clean existing data (COMMENTED OUT TO PREVENT DATA LOSS)
    /*
    await prisma.notification.deleteMany();
    await prisma.event.deleteMany();
    await prisma.studentSkill.deleteMany();
    await prisma.skill.deleteMany();
    await prisma.badge.deleteMany();
    await prisma.codingProfile.deleteMany();
    await prisma.attendance.deleteMany();
    await prisma.academicRecord.deleteMany();
    await prisma.semesterCGPA.deleteMany();
    await prisma.student.deleteMany();
    await prisma.mentor.deleteMany();
    await prisma.user.deleteMany();
    await prisma.subject.deleteMany();
    */

    const hashedPassword = await bcrypt.hash("password123", 10);

    // ─── Create Subjects ──────────────────────────────
    const subjectsData = [
        { name: "Data Structures & Algorithms", code: "CS301", semester: "5th Semester" },
        { name: "Operating Systems", code: "CS302", semester: "5th Semester" },
        { name: "Database Management Systems", code: "CS303", semester: "5th Semester" },
        { name: "Computer Networks", code: "CS304", semester: "5th Semester" },
        { name: "Object Oriented Programming", code: "CS305", semester: "5th Semester" },
        { name: "Software Engineering", code: "CS306", semester: "5th Semester" },
    ];

    for (const s of subjectsData) {
        await prisma.subject.upsert({
            where: { code: s.code },
            update: s,
            create: s,
        });
    }
    console.log(`✅ Upserted ${subjectsData.length} subjects`);

    // ─── Create Skills ────────────────────────────────
    const skillNames = ["C++", "Python", "JavaScript", "React", "Node.js", "SQL", "Data Structures", "Algorithms", "Machine Learning", "Git"];
    for (const name of skillNames) {
        await prisma.skill.upsert({
            where: { name },
            update: {},
            create: { name }
        });
    }
    console.log(`✅ Upserted ${skillNames.length} skills`);

    // ─── Create Main Mentor ───────────────────────────
    const mentorUser = await prisma.user.upsert({
        where: { email: "mentor@campus.edu" },
        update: {
            password: hashedPassword,
            name: "Main Mentor",
            role: "MENTOR",
            mentor: {
                update: {
                    section: "CSE-B"
                }
            }
        },
        create: {
            email: "mentor@campus.edu",
            password: hashedPassword,
            name: "Main Mentor",
            role: "MENTOR",
            mentor: {
                create: {
                    department: "Computer Science & Engineering",
                    designation: "Professor",
                    section: "CSE-B",
                },
            },
        },
    });
    console.log(`✅ Upserted mentor: ${mentorUser.name}`);

    console.log("\n🎉 Database is now CLEAN and ready for students to register!\n");
    console.log("Mentor Credentials:");
    console.log("  Email: mentor@campus.edu");
    console.log("  Pass:  password123\n");
}

main()
    .catch((e) => {
        console.error("❌ Seed error:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
