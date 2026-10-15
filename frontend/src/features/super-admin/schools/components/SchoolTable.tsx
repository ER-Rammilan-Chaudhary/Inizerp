"use client";

import { useRouter } from "next/navigation";
import { SchoolActions } from "./SchoolActions";
import type { School } from "@/features/super-admin/schools/types/school";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Loader from "@/components/common/Loader";

interface SchoolTableProps {
    schools: School[]; loading?: boolean;
}

export default function SchoolTable({ schools, loading = false, }: SchoolTableProps) {
    const router = useRouter();

    if (loading) {
        return (
            <Loader
                text="Loading school details..."
                fullScreen
            />
        );
    }

    if (!schools.length) {
        return (
            <div className="flex h-60 items-center justify-center text-muted-foreground">
                No schools found.
            </div>
        );
    }
    return (
        <div className="w-full rounded-xl border overflow-x-auto">
            <div className="min-w-[700px]">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>School</TableHead>
                            <TableHead>Principal</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead className="text-right">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {schools.map((school) => (
                            <TableRow key={school.id}>

                                <TableCell>
                                    <div className="flex items-center gap-3">

                                        <div className="flex h-10 w-10 items-center justify-center rounded-full overflow-hidden bg-primary/10">

                                            {school.logo ? (
                                                <img
                                                    src={`${process.env.NEXT_PUBLIC_SERVER_URL}${school.logo}`}
                                                    alt={school.name}
                                                    className="h-full w-full object-contain bg-white"
                                                />
                                            ) : (
                                                school.name.charAt(0).toUpperCase()
                                            )}

                                        </div>


                                        <div>
                                            <p className="font-medium">
                                                {school.name}
                                            </p>

                                            <p className="text-xs text-muted-foreground">
                                                {school.slug}
                                            </p>
                                        </div>

                                    </div>
                                </TableCell>


                                <TableCell>
                                    {school.principal ?? "-"}
                                </TableCell>


                                <TableCell>
                                    {school.email ?? "-"}
                                </TableCell>


                                <TableCell>
                                    {school.phone ?? "-"}
                                </TableCell>


                                <TableCell>
                                    <Badge
                                        variant={
                                            school.status === "ACTIVE"
                                                ? "default"
                                                : school.status === "TRIAL"
                                                    ? "secondary"
                                                    : "destructive"
                                        }
                                    >
                                        {school.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    {new Date(
                                        school.createdAt
                                    ).toLocaleDateString()}
                                </TableCell>


                                <TableCell className="text-right">
                                    <SchoolActions
                                        school={school}
                                        onEdit={(school) => {
                                            router.push(`/super-admin/schools/${school.id}/edit`);
                                        }}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

            </div>

        </div>
    );
}