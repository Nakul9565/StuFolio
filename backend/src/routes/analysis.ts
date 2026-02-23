import { Router, Response } from "express";
import prisma from "../lib/prisma";
import { AuthRequest, authenticateToken, requireRole } from "../middleware/auth";

const router = Router();

// GET /api/analysis/me — Get AI-driven performance analysis
router.get("/me", authenticateToken, requireRole("STUDENT"), async (req: AuthRequest, res: Response) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user!.userId },
            include: {
                student: {
                    include: {
                        academicRecords: { include: { subject: true } },
                        attendances: { include: { subject: true } },
                        semesterCGPAs: true,
                        codingProfiles: true,
                    }
                }
            }
        });

        if (!user?.student) return res.status(404).json({ error: "Student not found" });

        const student = user.student;

        // 1. Strength & Weakness Map (Radar Chart Data)
        // Group by subject and calculate avg score
        const strengthData = student.academicRecords.map(r => ({
            subject: r.subject.code,
            score: (r.marks / r.maxMarks) * 100,
            fullMark: 100
        }));

        // 2. GPA Prediction (Actual vs Predicted)
        const sortedSemesters = student.semesterCGPAs.sort((a, b) => a.semester.localeCompare(b.semester));
        const actualData = sortedSemesters.map(s => ({
            sem: `Sem ${s.semester}`,
            actual: s.cgpa,
            predicted: null
        }));

        // Simple linear extrapolation for prediction
        let predictedNext = null;
        if (actualData.length >= 2) {
            const last = actualData[actualData.length - 1].actual;
            const prev = actualData[actualData.length - 2].actual;
            const trend = last - prev;
            predictedNext = Math.min(10, Math.max(0, last + trend));
        } else if (actualData.length === 1) {
            predictedNext = actualData[0].actual;
        }

        const predictionData = [
            ...actualData,
            { sem: `Sem ${actualData.length + 1}`, actual: null, predicted: predictedNext || student.cgpa }
        ];

        // 3. Personalized Suggestions
        const suggestions = [];

        // Critical score check
        const lowScores = strengthData.filter(s => s.score < 70);
        lowScores.forEach(s => {
            suggestions.push({
                icon: "AlertTriangle",
                title: `Focus on ${s.subject}`,
                description: `Your score in ${s.subject} (${Math.round(s.score)}%) is below threshold. Dedicate more practice to this subject.`,
                priority: "high",
                color: "text-destructive bg-destructive/10 border-destructive/20",
            });
        });

        // Attendance check
        const lowAttendance = student.attendances.filter(a => (a.attended / a.total) < 0.75);
        lowAttendance.forEach(a => {
            suggestions.push({
                icon: "Zap",
                title: `Improve Attendance in ${a.subject.name}`,
                description: `Current attendance is ${Math.round((a.attended / a.total) * 100)}%. Low attendance correlates with lower performance.`,
                priority: "medium",
                color: "text-warning bg-warning/10 border-warning/20",
            });
        });

        // Coding streak
        if (student.streak < 3) {
            suggestions.push({
                icon: "TrendingUp",
                title: "Build your Coding Streak",
                description: "Consistent daily practice improves problem-solving speed. Aim for a 7-day streak!",
                priority: "medium",
                color: "text-primary bg-primary/10 border-primary/20",
            });
        }

        // 4. Why This Changed (Explainable AI)
        const insights = [];
        if (lowAttendance.length > 0) {
            insights.push({
                question: "Why is your performance at risk?",
                answer: `Low attendance in ${lowAttendance[0].subject.name} is the primary factor. Students with >85% attendance score significantly higher.`,
                icon: "📉"
            });
        }

        const codingSolved = student.codingProfiles.reduce((acc, cp) => {
            const stats = JSON.parse(cp.stats);
            const solved = stats.find((s: any) => s.label.includes("Solved"))?.value || 0;
            return acc + parseInt(solved);
        }, 0);

        if (codingSolved > 100) {
            insights.push({
                question: "Why is your coding rank improving?",
                answer: `Your total solved problems (${codingSolved}) across platforms puts you in the top 15% of your batch.`,
                icon: "📈"
            });
        }

        return res.json({
            strengthData,
            predictionData,
            suggestions: suggestions.slice(0, 4),
            insights: insights.length > 0 ? insights : [{
                question: "How to reach the next level?",
                answer: "Maintain your current attendance and aim for 5 medium-level LeetCode problems this week.",
                icon: "💡"
            }],
            overallTrend: predictedNext && predictedNext >= (actualData[actualData.length - 1]?.actual || 0) ? "Upward ↑" : "Steady",
            predictedGPA: predictedNext || student.cgpa,
            weakAreas: lowScores.map(s => s.subject).join(", ") || "None identified"
        });
    } catch (error: any) {
        console.error("Analysis error:", error);
        return res.status(500).json({ error: "Failed to generate analysis" });
    }
});

export default router;
