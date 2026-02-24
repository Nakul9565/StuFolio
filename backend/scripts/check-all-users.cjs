const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany({
        include: { student: true, mentor: true }
    });

    let output = "=== ALL USERS ===\n";
    for (const u of users) {
        let section = "N/A";
        if (u.role === "STUDENT") section = u.student?.section || "MISSING";
        if (u.role === "MENTOR") section = u.mentor?.section || "MISSING";
        output += `Role: ${u.role.padEnd(8)} | Section: ${section.padEnd(10)} | Email: ${u.email}\n`;
    }
    fs.writeFileSync("user-mapping.txt", output);
    console.log("Output written to user-mapping.txt");
}

main().finally(() => prisma.$disconnect());
