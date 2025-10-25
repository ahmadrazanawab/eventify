import DashboardStats from "./dashboard-stats";

export default function AdminDashboardPage() {
    return (
        <div className="space-y-6 mt-20">
            <div className="space-y-2">
                <h1 className="text-2xl font-semibold tracking-tight">Welcome, Admin</h1>
                <p className="text-sm text-muted-foreground">
                    Manage and monitor your events, users, and system settings from one place.
                </p>
            </div>
            <DashboardStats />
        </div>
    );
}
