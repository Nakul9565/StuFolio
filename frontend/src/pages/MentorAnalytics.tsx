import { motion } from "framer-motion";
import {
    BarChart3,
    TrendingUp,
    Users,
    Target,
    Flame,
    AlertTriangle,
} from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    LineChart,
    Line,
    Legend,
} from "recharts";
import DashboardLayout from "@/components/DashboardLayout";

const monthlyPerformance = [
    { month: "Aug", avgScore: 68, topScore: 88, bottomScore: 42 },
    { month: "Sep", avgScore: 71, topScore: 90, bottomScore: 45 },
    { month: "Oct", avgScore: 74, topScore: 91, bottomScore: 48 },
    { month: "Nov", avgScore: 73, topScore: 92, bottomScore: 46 },
    { month: "Dec", avgScore: 76, topScore: 93, bottomScore: 50 },
    { month: "Jan", avgScore: 78, topScore: 94, bottomScore: 52 },
    { month: "Feb", avgScore: 75, topScore: 94, bottomScore: 49 },
];

const subjectAvgScores = [
    { subject: "DSA", avg: 76, highest: 95, lowest: 45 },
    { subject: "OS", avg: 68, highest: 88, lowest: 38 },
    { subject: "DBMS", avg: 78, highest: 96, lowest: 52 },
    { subject: "CN", avg: 62, highest: 82, lowest: 30 },
    { subject: "OOP", avg: 74, highest: 92, lowest: 40 },
    { subject: "SE", avg: 71, highest: 90, lowest: 42 },
];

const codingActivityByMonth = [
    { month: "Aug", active: 28, inactive: 14 },
    { month: "Sep", active: 30, inactive: 12 },
    { month: "Oct", active: 32, inactive: 10 },
    { month: "Nov", active: 29, inactive: 13 },
    { month: "Dec", active: 26, inactive: 16 },
    { month: "Jan", active: 34, inactive: 8 },
    { month: "Feb", active: 31, inactive: 11 },
];

const atRiskTrend = [
    { month: "Aug", atRisk: 8 },
    { month: "Sep", atRisk: 7 },
    { month: "Oct", atRisk: 6 },
    { month: "Nov", atRisk: 7 },
    { month: "Dec", atRisk: 6 },
    { month: "Jan", atRisk: 5 },
    { month: "Feb", atRisk: 5 },
];

const keyMetrics = [
    { label: "Avg Class Score", value: "74.6", icon: BarChart3, color: "primary", change: "↑ 3.2% from last sem" },
    { label: "Students Improving", value: "67%", icon: TrendingUp, color: "accent", change: "28 of 42 students" },
    { label: "Active Coders", value: "31", icon: Flame, color: "warning", change: "74% of class" },
    { label: "Students At Risk", value: "5", icon: AlertTriangle, color: "destructive", change: "↓ from 8 in August" },
];

const tooltipStyle = {
    background: "#ffffff",
    border: "1px solid hsl(220, 13%, 91%)",
    borderRadius: "8px",
    color: "hsl(220, 14%, 10%)",
};

const MentorAnalytics = () => {
    return (
        <DashboardLayout title="Analytics" subtitle="Batch-level performance & trends" role="mentor">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {keyMetrics.map((m, i) => (
                    <motion.div
                        key={m.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="rounded-xl border border-border bg-card p-5 card-hover"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-medium text-muted-foreground">{m.label}</span>
                            <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${m.color === "primary" ? "bg-primary/10 text-primary" :
                                m.color === "accent" ? "bg-accent/10 text-accent" :
                                    m.color === "warning" ? "bg-warning/10 text-warning" :
                                        "bg-destructive/10 text-destructive"
                                }`}>
                                <m.icon className="h-4 w-4" />
                            </div>
                        </div>
                        <div className="text-3xl font-display font-bold text-foreground">{m.value}</div>
                        <div className="text-xs text-muted-foreground mt-1">{m.change}</div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Performance Trend */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="rounded-xl border border-border bg-card p-6"
                >
                    <h3 className="font-display font-semibold text-foreground mb-1">Class Performance Band</h3>
                    <p className="text-xs text-muted-foreground mb-4">Top, average, and bottom scores over time</p>
                    <ResponsiveContainer width="100%" height={280}>
                        <LineChart data={monthlyPerformance}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
                            <XAxis dataKey="month" tick={{ fill: "hsl(220, 9%, 46%)", fontSize: 11 }} axisLine={false} />
                            <YAxis tick={{ fill: "hsl(220, 9%, 46%)", fontSize: 11 }} axisLine={false} domain={[30, 100]} />
                            <Tooltip contentStyle={tooltipStyle} />
                            <Line type="monotone" dataKey="topScore" stroke="hsl(172, 66%, 40%)" strokeWidth={2} dot={false} name="Top" />
                            <Line type="monotone" dataKey="avgScore" stroke="hsl(234, 89%, 56%)" strokeWidth={2} dot={false} name="Average" />
                            <Line type="monotone" dataKey="bottomScore" stroke="hsl(0, 72%, 51%)" strokeWidth={2} dot={false} name="Bottom" />
                            <Legend wrapperStyle={{ fontSize: '11px' }} />
                        </LineChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Subject Comparison */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="rounded-xl border border-border bg-card p-6"
                >
                    <h3 className="font-display font-semibold text-foreground mb-1">Subject-wise Average</h3>
                    <p className="text-xs text-muted-foreground mb-4">Class averages by subject</p>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={subjectAvgScores}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
                            <XAxis dataKey="subject" tick={{ fill: "hsl(220, 9%, 46%)", fontSize: 11 }} axisLine={false} />
                            <YAxis tick={{ fill: "hsl(220, 9%, 46%)", fontSize: 11 }} axisLine={false} domain={[0, 100]} />
                            <Tooltip contentStyle={tooltipStyle} />
                            <Bar dataKey="avg" fill="hsl(234, 89%, 56%)" radius={[4, 4, 0, 0]} barSize={28} name="Class Avg" />
                        </BarChart>
                    </ResponsiveContainer>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Coding Activity */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="rounded-xl border border-border bg-card p-6"
                >
                    <h3 className="font-display font-semibold text-foreground mb-1">Coding Activity</h3>
                    <p className="text-xs text-muted-foreground mb-4">Active vs inactive coding students per month</p>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={codingActivityByMonth}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
                            <XAxis dataKey="month" tick={{ fill: "hsl(220, 9%, 46%)", fontSize: 11 }} axisLine={false} />
                            <YAxis tick={{ fill: "hsl(220, 9%, 46%)", fontSize: 11 }} axisLine={false} />
                            <Tooltip contentStyle={tooltipStyle} />
                            <Bar dataKey="active" fill="hsl(172, 66%, 40%)" radius={[4, 4, 0, 0]} barSize={20} name="Active" stackId="a" />
                            <Bar dataKey="inactive" fill="hsl(0, 72%, 51%)" radius={[4, 4, 0, 0]} barSize={20} name="Inactive" stackId="a" />
                            <Legend wrapperStyle={{ fontSize: '11px' }} />
                        </BarChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* At-Risk Trend */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 }}
                    className="rounded-xl border border-border bg-card p-6"
                >
                    <h3 className="font-display font-semibold text-foreground mb-1">At-Risk Students Trend</h3>
                    <p className="text-xs text-muted-foreground mb-4">Number of at-risk students over time</p>
                    <ResponsiveContainer width="100%" height={250}>
                        <AreaChart data={atRiskTrend}>
                            <defs>
                                <linearGradient id="maa1" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="hsl(0, 72%, 51%)" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="hsl(0, 72%, 51%)" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
                            <XAxis dataKey="month" tick={{ fill: "hsl(220, 9%, 46%)", fontSize: 11 }} axisLine={false} />
                            <YAxis tick={{ fill: "hsl(220, 9%, 46%)", fontSize: 11 }} axisLine={false} domain={[0, 15]} />
                            <Tooltip contentStyle={tooltipStyle} />
                            <Area type="monotone" dataKey="atRisk" stroke="hsl(0, 72%, 51%)" fill="url(#maa1)" strokeWidth={2} name="At Risk" />
                        </AreaChart>
                    </ResponsiveContainer>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                        <div className="text-sm text-muted-foreground">
                            Down from <span className="text-foreground font-medium">8 in Aug</span> to <span className="text-accent font-medium">5 in Feb</span>.
                        </div>
                        <div className="text-xs text-accent font-medium">37% reduction ↓</div>
                    </div>
                </motion.div>
            </div>
        </DashboardLayout>
    );
};

export default MentorAnalytics;
