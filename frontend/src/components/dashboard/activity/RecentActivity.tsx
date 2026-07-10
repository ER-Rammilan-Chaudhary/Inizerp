const activities = [
  "New school registered",
  "Subscription upgraded",
  "Teacher added",
  "Payment received",
  "New admin created",
];

export default function RecentActivity() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">

      <h2 className="text-xl font-semibold mb-6">
        Recent Activity
      </h2>

      <div className="space-y-5">

        {activities.map((item, index) => (

          <div
            key={index}
            className="flex gap-4 items-center"
          >

            <div className="h-3 w-3 rounded-full bg-primary"/>

            <p>{item}</p>

          </div>

        ))}

      </div>

    </div>
  );
}   