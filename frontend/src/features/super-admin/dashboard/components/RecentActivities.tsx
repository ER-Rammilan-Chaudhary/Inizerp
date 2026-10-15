"use client";

interface Activity {
    id: string; action: string; entity: string; createdAt: string;
    user: { name: string; email: string; };
}
interface Props { data?: Activity[]; }

export default function RecentActivities({ data = [] }: Props) {
    return (
        <div className="rounded-xl bg-card p-6 shadow">
            <h2 className="mb-4 text-lg font-semibold">
                Recent Activities
            </h2>

            <div className="space-y-4">
                {data.map((item) => (
                    <div
                        key={item.id}
                        className="border-b pb-3 last:border-b-0"
                    >
                        <p className="font-medium">
                            {item.user.name}
                        </p>

                        <p className="text-sm text-gray-600">
                            {item.action} • {item.entity}
                        </p>

                        <p className="text-xs text-muted-foreground">
                            {new Date(item.createdAt).toLocaleString()}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}