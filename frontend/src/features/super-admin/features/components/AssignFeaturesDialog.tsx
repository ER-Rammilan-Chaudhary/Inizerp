"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useFeatureList } from "../hooks/useFeatureList";
import { useSchoolFeatures } from "../hooks/useSchoolFeatures";
import { useUpdateSchoolFeatures } from "../hooks/useUpdateSchoolFeatures";

interface Props {
    schoolId: string;
}

export default function AssignFeaturesDialog({
    schoolId,
}: Props) {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<string[]>([]);
    const { data, isLoading, } = useFeatureList({ page: 1, limit: 100, });
    const features = data ?? [];

    const { data: schoolFeatures = [], } = useSchoolFeatures(schoolId);
    const { assignFeature, isUpdating, } = useUpdateSchoolFeatures(schoolId);
    const assignedIds = schoolFeatures.map((item) => item.module.id,);
    const handleSelect = (moduleId: string) => {
        if (assignedIds.includes(moduleId)) { return; }
        setSelected((current) => current.includes(moduleId) ? current.filter((id) => id !== moduleId,) : [...current, moduleId],);
    };

    const handleAssign = async () => {
        for (const moduleId of selected) { await assignFeature({ moduleId, enabled: true, }); }
        setSelected([]);
        setOpen(false);
    };

    const handleDialogChange = (value: boolean) => {
        setOpen(value);
        if (!value) {
            setSelected([]);
        }
    };

    return (
        <Dialog
            open={open} onOpenChange={handleDialogChange}>
            <DialogTrigger render={<Button type="button"> Assign Features </Button >} />

            <DialogContent >
                <DialogHeader>
                    <DialogTitle>
                        Assign School Features
                    </DialogTitle>
                </DialogHeader>

                <div className="max-h-[500px] space-y-3 overflow-y-auto">
                    {isLoading ? (
                        <p className="py-6 text-center">
                            Loading features...
                        </p>
                    ) : features.length === 0 ? (
                        <p className="py-6 text-center text-muted-foreground">
                            No features available
                        </p>
                    ) : (
                        features.map((feature) => {
                            const assigned = assignedIds.includes(feature.id);
                            const checked = assigned || selected.includes(feature.id);
                            return (
                                <div
                                    key={feature.id}
                                    className="flex items-center gap-3 rounded-lg border p-3 cursor-pointer"
                                >
                                    <Checkbox
                                        checked={checked}
                                        disabled={assigned}
                                        onCheckedChange={() => handleSelect(feature.id)
                                        }
                                    />

                                    <div className="flex-1">
                                        <h4 className="font-medium">
                                            {feature.name}
                                        </h4>

                                        {/* <p className="text-sm text-muted-foreground">
                                            {feature.category}
                                        </p> */}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                <Button type="button"
                    disabled={selected.length === 0 || isUpdating} onClick={handleAssign}>{isUpdating ? "Assigning..." : "Assign Selected"}
                </Button>
            </DialogContent>
        </Dialog>
    );
}