"use client";

import { useState } from "react";
import { toast } from "sonner";
import { DoorOpen, Plus, Loader2, Edit2, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useClasses,
  useCreateSection,
  useDeleteSection,
  useSections,
  useUpdateSection,
} from "@/features/school/classes/hooks/useClasses";

export default function SectionsPage() {
  const { data: classesData, isLoading: loadingClasses } = useClasses();
  const classes = classesData?.data ?? [];

  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const activeClassId = selectedClassId || classes[0]?.id || "";

  const { data: sectionsData, isLoading: loadingSections } =
    useSections(activeClassId);
  const sections = sectionsData?.data ?? [];

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [sectionName, setSectionName] = useState("");
  const [capacity, setCapacity] = useState("");

  const createSectionMutation = useCreateSection();
  const updateSectionMutation = useUpdateSection();
  const deleteSectionMutation = useDeleteSection();

  const handleOpenCreate = () => {
    setEditingSectionId(null);
    setSectionName("");
    setCapacity("");
    setModalOpen(true);
  };

  const handleOpenEdit = (sec: { id: string; name: string; capacity?: number | null }) => {
    setEditingSectionId(sec.id);
    setSectionName(sec.name);
    setCapacity(sec.capacity ? String(sec.capacity) : "");
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sectionName.trim()) {
      toast.error("Section name is required");
      return;
    }

    const payload = {
      name: sectionName.trim(),
      capacity: capacity ? parseInt(capacity, 10) : null,
    };

    try {
      if (editingSectionId) {
        await updateSectionMutation.mutateAsync({
          classId: activeClassId,
          sectionId: editingSectionId,
          payload,
        });
        toast.success("Section updated successfully");
      } else {
        await createSectionMutation.mutateAsync({
          classId: activeClassId,
          payload,
        });
        toast.success("Section created successfully");
      }
      setModalOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save section";
      toast.error(msg);
    }
  };

  const handleDelete = async (sectionId: string) => {
    if (!window.confirm("Are you sure you want to delete this section?")) return;

    try {
      await deleteSectionMutation.mutateAsync({
        classId: activeClassId,
        sectionId,
      });
      toast.success("Section deleted successfully");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete section";
      toast.error(msg);
    }
  };

  const selectedClass = classes.find((c) => c.id === activeClassId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <DoorOpen className="h-6 w-6 text-primary" />
            Class Sections
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage class divisions, student capacities, and section assignments.
          </p>
        </div>

        <Button
          type="button"
          onClick={handleOpenCreate}
          disabled={!activeClassId}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Section</span>
        </Button>
      </div>

      {/* Class Selector Bar */}
      <Card className="p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
            Select Class:
          </label>
          <div className="flex flex-wrap gap-2">
            {loadingClasses ? (
              <div className="text-xs text-muted-foreground">Loading classes...</div>
            ) : classes.length === 0 ? (
              <div className="text-xs text-muted-foreground">No classes created yet.</div>
            ) : (
              classes.map((cls) => (
                <button
                  key={cls.id}
                  type="button"
                  onClick={() => setSelectedClassId(cls.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${activeClassId === cls.id
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                    }`}
                >
                  Class {cls.name}
                </button>
              ))
            )}
          </div>
        </div>
      </Card>

      {/* Sections Table */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="font-semibold text-foreground text-sm">
            {selectedClass ? `Sections in Class ${selectedClass.name}` : "Sections"}
          </h2>
          <span className="text-xs text-muted-foreground">
            {sections.length} Section{sections.length !== 1 ? "s" : ""}
          </span>
        </div>

        {loadingSections ? (
          <div className="p-12 text-center text-sm text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2 text-primary" />
            Loading sections...
          </div>
        ) : sections.length === 0 ? (
          <div className="p-12 text-center text-sm text-muted-foreground">
            No sections found for this class. Click &quot;Add Section&quot; to create Section A, B, etc.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 border-b text-xs font-semibold uppercase text-muted-foreground">
                <tr>
                  <th className="px-5 py-3">Section Name</th>
                  <th className="px-5 py-3">Capacity</th>
                  <th className="px-5 py-3">Enrolled Students</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {sections.map((sec) => (
                  <tr key={sec.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-foreground">
                      Section {sec.name}
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground">
                      {sec.capacity ? `${sec.capacity} students` : "Unlimited"}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        <Users className="h-3 w-3" />
                        <span>{sec.studentCount ?? 0} students</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenEdit(sec)}
                          className="h-8 w-8 p-0"
                          title="Edit Section"
                        >
                          <Edit2 className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(sec.id)}
                          className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                          title="Delete Section"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Section Dialog */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md">
          <form onSubmit={handleSave}>
            <DialogHeader>
              <DialogTitle>
                {editingSectionId ? "Edit Section" : "Add New Section"}
              </DialogTitle>
              <DialogDescription>
                {selectedClass ? `Configure section for Class ${selectedClass.name}.` : ""}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div>
                <label className="text-xs font-medium text-foreground mb-1 block">
                  Section Name *
                </label>
                <Input
                  value={sectionName}
                  onChange={(e) => setSectionName(e.target.value)}
                  placeholder="e.g. A, B, Blue, Red"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium text-foreground mb-1 block">
                  Max Capacity (Optional)
                </label>
                <Input
                  type="number"
                  min="1"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  placeholder="e.g. 40"
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  createSectionMutation.isPending || updateSectionMutation.isPending
                }
              >
                Save Section
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
