import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Check,
    X,
    Save,
    Calendar as CalendarIcon,
    Users,
    BookOpen,
    Loader2,
    AlertCircle,
    CheckCircle2
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Student {
    id: string;
    name: string;
    enrollment: string;
    status: "PRESENT" | "ABSENT";
}

const MentorAttendancePage = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [subjects, setSubjects] = useState<any[]>([]);
    const [selectedSubject, setSelectedSubject] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [studentsData, subjectsData] = await Promise.all([
                    api.getMentorStudents(),
                    api.getMentorSubjects()
                ]);

                // @ts-ignore
                setStudents(studentsData.map((s: any) => ({
                    id: s.id,
                    name: s.name,
                    enrollment: s.enrollment,
                    status: "PRESENT" // Default to present
                })));

                setSubjects(subjectsData);
                if (subjectsData.length > 0) setSelectedSubject(subjectsData[0].id);
            } catch (err) {
                console.error("Failed to load data:", err);
                toast.error("Failed to load students or subjects");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleStatusChange = (studentId: string, status: "PRESENT" | "ABSENT") => {
        setStudents(prev => prev.map(s => s.id === studentId ? { ...s, status } : s));
    };

    const toggleAll = (status: "PRESENT" | "ABSENT") => {
        setStudents(prev => prev.map(s => ({ ...s, status })));
    };

    const handleSubmit = async () => {
        if (!selectedSubject) {
            toast.error("Please select a subject");
            return;
        }

        setSubmitting(true);
        try {
            await api.submitDailyAttendance(
                selectedSubject,
                date,
                students.map(s => ({ studentId: s.id, status: s.status }))
            );
            toast.success("Attendance recorded successfully");
        } catch (err) {
            console.error("Submission error:", err);
            toast.error("Failed to submit attendance");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <DashboardLayout title="Daily Attendance" role="mentor">
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout
            title="Daily Attendance"
            subtitle="Mark attendance for your section"
            role="mentor"
        >
            <div className="space-y-6">
                {/* Controls */}
                <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="text-xs font-medium text-muted-foreground block mb-2">Select Subject</label>
                            <select
                                value={selectedSubject}
                                onChange={(e) => setSelectedSubject(e.target.value)}
                                className="w-full h-10 rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                            >
                                {subjects.map(s => (
                                    <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-muted-foreground block mb-2">Select Date</label>
                            <div className="relative">
                                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full h-10 rounded-lg border border-border bg-background pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                                />
                            </div>
                        </div>
                        <div className="flex items-end gap-2">
                            <Button
                                variant="outline"
                                className="flex-1 rounded-lg h-10 border-accent/20 text-accent hover:bg-accent/5"
                                onClick={() => toggleAll("PRESENT")}
                            >
                                All Present
                            </Button>
                            <Button
                                variant="outline"
                                className="flex-1 rounded-lg h-10 border-destructive/20 text-destructive hover:bg-destructive/5"
                                onClick={() => toggleAll("ABSENT")}
                            >
                                All Absent
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Student Grid */}
                <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-border bg-secondary/30">
                                    <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Student Name</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Enrollment</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50">
                                {students.map((student) => (
                                    <tr key={student.id} className="hover:bg-secondary/10 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-foreground">{student.name}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <code className="text-[11px] font-medium text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded">
                                                {student.enrollment}
                                            </code>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center items-center gap-3">
                                                <button
                                                    onClick={() => handleStatusChange(student.id, "PRESENT")}
                                                    className={`h-9 w-24 rounded-full text-xs font-bold transition-all border flex items-center justify-center gap-2 ${student.status === "PRESENT"
                                                            ? "bg-accent/10 border-accent text-accent shadow-sm"
                                                            : "bg-transparent border-border text-muted-foreground hover:bg-secondary"
                                                        }`}
                                                >
                                                    <Check className="h-3.5 w-3.5" />
                                                    Present
                                                </button>
                                                <button
                                                    onClick={() => handleStatusChange(student.id, "ABSENT")}
                                                    className={`h-9 w-24 rounded-full text-xs font-bold transition-all border flex items-center justify-center gap-2 ${student.status === "ABSENT"
                                                            ? "bg-destructive/10 border-destructive text-destructive shadow-sm"
                                                            : "bg-transparent border-border text-muted-foreground hover:bg-secondary"
                                                        }`}
                                                >
                                                    <X className="h-3.5 w-3.5" />
                                                    Absent
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex justify-end gap-4">
                    <Button
                        disabled={submitting}
                        onClick={handleSubmit}
                        className="rounded-xl h-11 px-8 font-semibold shadow-glow flex items-center gap-2"
                    >
                        {submitting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Save className="h-4 w-4" />
                        )}
                        Submit Attendance For {date}
                    </Button>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default MentorAttendancePage;
