"use client";
import { Card, CardContent, CardHeader, CardTitle, } from "@/components/ui/card";
import DeleteSchoolDialog from "./DeleteSchoolDialog";


interface Props { schoolId: string; schoolName: string; }


export default function SchoolDangerZone({ schoolId, schoolName, }: Props) {
    return (
        <Card className="border-red-500">
            <CardHeader>
                <CardTitle className="text-red-600">
                    Danger Zone
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">Deleting this school will permanently remove school data.</p>
                <DeleteSchoolDialog schoolId={schoolId} schoolName={schoolName} />
            </CardContent>
        </Card>
    );
}