import { getSchools } from "@/api/school.api";
import Link from "next/link";

export default async function SchoolsPage() {
  const response = await getSchools(1, 50);

  const schools = response.schools;

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">

        <h1 className="text-3xl font-bold">
          Schools
        </h1>

        <button
          className="rounded-lg bg-primary px-5 py-2 text-primary-foreground"
        >
          Add School
        </button>

      </div>


      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

        {schools.length > 0 ? (

          schools.map((school) => (

            <div
              key={school.id}
              className="rounded-xl border p-5 shadow-sm"
            >

              <div className="flex items-center gap-3">

                {school.logo && (
                  <img
                    src={school.logo}
                    alt={school.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                )}

                <div>
                  <h2 className="text-xl font-semibold">
                    {school.name}
                  </h2>

                  {school.slogan && (
                    <p className="text-sm text-muted-foreground">
                      {school.slogan}
                    </p>
                  )}

                </div>

              </div>


              <div className="mt-4 space-y-1 text-sm">

                {school.email && (
                  <p>
                    Email: {school.email}
                  </p>
                )}

                {school.phone && (
                  <p>
                    Phone: {school.phone}
                  </p>
                )}

                {school.address && (
                  <p>
                    Address: {school.address}
                  </p>
                )}

                {school.principal && (
                  <p>
                    Principal: {school.principal}
                  </p>
                )}

              </div>


              <Link
                href={`/schools/${school.id}`}
                className="mt-5 inline-block rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
              >
                View Details
              </Link>


            </div>

          ))

        ) : (

          <p className="text-muted-foreground">
            No schools found.
          </p>

        )}

      </div>

    </div>
  );
}