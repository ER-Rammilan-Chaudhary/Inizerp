"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Clock,
  Coffee,
  Plus,
  RotateCcw,
  Trash2,
  Utensils,
  BookOpen,
  Loader2,
  CalendarDays,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

import type {
  AddPeriodPayload,
  PeriodMasterItem,
  PeriodType,
} from "../types/timetables.types";
import {
  useAddPeriod,
  useDeletePeriod,
  usePeriods,
  useSavePeriods,
} from "../hooks/useTimetables";
import { getErrorMessage } from "@/lib/error-message";

interface PeriodModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DEFAULT_BELL_SCHEDULE: PeriodMasterItem[] = [
  { id: "p1", periodNumber: 1, name: "Period 1", type: "REGULAR", startTime: "08:00", endTime: "08:45" },
  { id: "p2", periodNumber: 2, name: "Period 2", type: "REGULAR", startTime: "08:45", endTime: "09:30" },
  { id: "p3", periodNumber: 3, name: "Period 3", type: "REGULAR", startTime: "09:30", endTime: "10:15" },
  { id: "p4", periodNumber: 4, name: "Period 4", type: "REGULAR", startTime: "10:30", endTime: "11:15" },
  { id: "p5", periodNumber: 5, name: "Period 5", type: "REGULAR", startTime: "11:15", endTime: "12:00" },
  { id: "p6", periodNumber: 6, name: "Period 6", type: "REGULAR", startTime: "12:00", endTime: "12:45" },
  { id: "l1", periodNumber: null, name: "Lunch Break", type: "LUNCH", startTime: "12:45", endTime: "13:15" },
  { id: "p7", periodNumber: 7, name: "Period 7", type: "REGULAR", startTime: "13:15", endTime: "14:00" },
];

export default function PeriodModal({ open, onOpenChange }: PeriodModalProps) {
  const { data: periods = [], isLoading } = usePeriods();
  const addPeriodMutation = useAddPeriod();
  const deletePeriodMutation = useDeletePeriod();
  const savePeriodsMutation = useSavePeriods();

  const [name, setName] = useState("");
  const [type, setType] = useState<PeriodType>("REGULAR");
  const [startTime, setStartTime] = useState("14:00");
  const [endTime, setEndTime] = useState("14:45");
  const [periodNumber, setPeriodNumber] = useState<number | "">("");

  // Determine next period number
  const nextPeriodNumber =
    periods.filter((p) => p.type === "REGULAR" && p.periodNumber).length + 1;

  const handleTypeChange = (nextType: PeriodType) => {
    setType(nextType);
    if (nextType === "BREAK") {
      setName("Short Break");
      setPeriodNumber("");
    } else if (nextType === "LUNCH") {
      setName("Lunch Break");
      setPeriodNumber("");
    } else {
      setName(`Period ${nextPeriodNumber}`);
      setPeriodNumber(nextPeriodNumber);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter a period name");
      return;
    }

    if (!startTime || !endTime) {
      toast.error("Start time and end time are required");
      return;
    }

    if (startTime >= endTime) {
      toast.error("End time must be after start time");
      return;
    }

    const payload: AddPeriodPayload = {
      name: name.trim(),
      type,
      startTime,
      endTime,
      periodNumber:
        type === "REGULAR"
          ? (typeof periodNumber === "number" ? periodNumber : nextPeriodNumber)
          : null,
    };

    try {
      await addPeriodMutation.mutateAsync(payload);
      toast.success("New period added to master bell schedule!");
      setName("");
      setType("REGULAR");
      setPeriodNumber("");
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to add period"));
    }
  };

  const handleDelete = async (periodId: string) => {
    try {
      await deletePeriodMutation.mutateAsync(periodId);
      toast.success("Period removed from master bell schedule");
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to delete period"));
    }
  };

  const handleResetToDefault = async () => {
    if (
      !window.confirm(
        "Reset Period Master to the standard school schedule (7 Periods  + Lunch)?",
      )
    ) {
      return;
    }

    try {
      await savePeriodsMutation.mutateAsync({ periods: DEFAULT_BELL_SCHEDULE });
      toast.success("Master schedule reset to standard bell timings!");
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to reset bell schedule"));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-6">
        <DialogHeader className="pb-3 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Clock className="h-5 w-5" />
              </span>
              <div>
                <DialogTitle className="text-lg font-bold">
                  Period Master & Bell Schedule
                </DialogTitle>
                <DialogDescription className="text-xs">
                  Fixed daily timetable periods and break slots for the school.
                </DialogDescription>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleResetToDefault}
              disabled={savePeriodsMutation.isPending}
              className="text-xs h-8 gap-1.5"
            >
              <RotateCcw className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Reset Default</span>
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6 py-4 pr-1">
          {/* Section 1: Add New Period Form */}
          <div className="rounded-xl border bg-muted/30 p-4 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Plus className="h-3.5 w-3.5 text-primary" />
              <span>Add New Period / Break</span>
            </h4>

            <form onSubmit={handleAdd} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Type Selection */}
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Slot Type</Label>
                  <select
                    value={type}
                    onChange={(e) => handleTypeChange(e.target.value as PeriodType)}
                    className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs shadow-xs focus:border-primary focus:outline-none"
                  >
                    <option value="REGULAR">📖 Lecture / Regular</option>
                    <option value="LUNCH">🍱 Lunch Break</option>
                  </select>
                </div>

                {/* Name */}
                <div className="space-y-1 sm:col-span-2">
                  <Label className="text-xs font-semibold">Label / Name</Label>
                  <Input
                    placeholder={type === "REGULAR" ? `e.g. Period $ { nextPeriodNumber }` : "e.g. Short Break"}

                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-8 text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                {/* Start Time */}
                <div className="space-y-1">
                  <Label className="text-xs font-semibold flex items-center gap-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span>Start Time</span>
                  </Label>
                  <Input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="h-8 text-xs"
                    required
                  />
                </div>

                {/* End Time */}
                <div className="space-y-1">
                  <Label className="text-xs font-semibold flex items-center gap-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span>End Time</span>
                  </Label>
                  <Input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="h-8 text-xs"
                    required
                  />
                </div>

                {/* Add Button */}
                <Button
                  type="submit"
                  size="sm"
                  disabled={addPeriodMutation.isPending}
                  className="h-8 text-xs gap-1.5"
                >
                  {addPeriodMutation.isPending ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Plus className="h-3.5 w-3.5" />
                  )}
                  <span>Add Period</span>
                </Button>
              </div>
            </form>
          </div>

          {/* Section 2: Current Periods List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Current Bell Schedule ({periods.length} Slots)
              </h4>
              <span className="text-xs text-muted-foreground">
                Sorted by schedule start time
              </span>
            </div>

            {isLoading ? (
              <div className="p-8 text-center text-xs text-muted-foreground">
                <Loader2 className="mx-auto h-5 w-5 animate-spin mb-2" />
                Loading period master...
              </div>
            ) : periods.length === 0 ? (
              <div className="rounded-xl border border-dashed p-8 text-center text-xs text-muted-foreground">
                No periods configured. Click &quot;Reset Default&quot; to restore standard timings.
              </div>
            ) : (
              <div className="rounded-xl border overflow-hidden bg-card">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/50 border-b font-semibold text-muted-foreground uppercase text-[10px]">
                    <tr>
                      <th className="px-3.5 py-2.5">Slot</th>
                      <th className="px-3.5 py-2.5">Type</th>
                      <th className="px-3.5 py-2.5">Timings</th>
                      <th className="px-3.5 py-2.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {periods.map((item) => (
                      <tr
                        key={item.id}
                        className={`hover:bg-muted/30 transition-colors ${item.type === "BREAK"
                          ? "bg-amber-500/5" : item.type === "LUNCH" ? "bg-orange-500/5" : ""}`
                        }
                      >
                        <td className="px-3.5 py-2 font-medium flex items-center gap-2">
                          <span className=" font-bold text-foreground inline-flex items-center justify-center h-6 w-6 rounded bg-muted text-[11px]">
                            {item.periodNumber ? `P${item.periodNumber}` : "—"}
                          </span>
                          <span>{item.name}</span>
                        </td>
                        <td className="px-3.5 py-2">
                          {item.type === "REGULAR" ? (
                            <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                              Lecture
                            </Badge>
                          ) : item.type === "BREAK" ? (
                            <Badge variant="outline" className="text-[10px] bg-amber-500/10 text-amber-600 border-amber-500/20 gap-1">
                              <Coffee className="h-3 w-3" />
                              Break
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-[10px] bg-orange-500/10 text-orange-600 border-orange-500/20 gap-1">
                              <Utensils className="h-3 w-3" />
                              Lunch
                            </Badge>
                          )}
                        </td>
                        <td className="px-3.5 py-2 text-muted-foreground">
                          {item.startTime} – {item.endTime}
                        </td>
                        <td className="px-3.5 py-2 text-right">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(item.id)}
                            disabled={deletePeriodMutation.isPending}
                            className="h-7 w-7 text-destructive hover:bg-destructive/10"
                            title="Delete period"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="pt-3 border-t">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
