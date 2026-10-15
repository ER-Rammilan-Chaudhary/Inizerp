"use client";

import {
    type ChangeEvent,
    type FormEvent,
    useEffect,
    useMemo,
    useState,
} from "react";
import { useSearchParams } from "next/navigation";
import {
    Briefcase,
    Camera,
    CheckCircle2,
    Circle,
    Eye,
    EyeOff,
    GraduationCap,
    HeartPulse,
    IdCard,
    Loader2,
    Mail,
    MapPin,
    Phone,
    Shield,
    Sparkles,
    User,
    UserCheck,
    UserPlus,
    Users,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import type {
    CreateStudentPayload,
    Student,
    StudentAcademicYearOption,
    StudentClassOption,
    StudentSectionOption,
    UpdateStudentPayload,
} from "../types/students.types";

interface StudentFormProps<T extends CreateStudentPayload | UpdateStudentPayload> {
    student?: Student;
    loading?: boolean;
    error?: string;
    onCancel: () => void;
    onSubmit: (payload: T) => Promise<void> | void;
    academicYears?: StudentAcademicYearOption[];
    classes?: StudentClassOption[];
    sections?: StudentSectionOption[];
    onClassChange?: (classId: string) => void;
}

const getInitials = (name?: string) => {
    if (!name) return "ST";
    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((item) => item.charAt(0).toUpperCase())
        .join("");
};

const getFileUrl = (avatar?: string | null) => {
    if (!avatar) return "";
    if (avatar.startsWith("http://") || avatar.startsWith("https://")) return avatar;

    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!baseUrl) return avatar;

    try {
        return new URL(avatar.startsWith("/") ? avatar : `/${avatar}`, baseUrl).toString();
    } catch {
        return avatar;
    }
};

export default function StudentForm<T extends CreateStudentPayload | UpdateStudentPayload>({
    student,
    loading = false,
    error,
    onCancel,
    onSubmit,
    academicYears = [],
    classes = [],
    sections = [],
    onClassChange,
}: StudentFormProps<T>) {
    const activeEnrollment = useMemo(
        () =>
            student?.enrollments?.find(
                (enrollment) => enrollment.status === "ACTIVE" && enrollment.academicYear.isCurrent,
            ) ??
            student?.enrollments?.find((enrollment) => enrollment.status === "ACTIVE") ??
            student?.enrollments?.[0],
        [student],
    );

    const [form, setForm] = useState({
        fullName: student?.user.fullName ?? "",
        email: student?.user.email ?? "",
        phone: student?.user.phone ?? "",
        password: "",
        rollNo: activeEnrollment?.rollNo ?? student?.rollNo ?? "",
        dob: student?.dob ? student.dob.slice(0, 10) : "",
        gender: student?.gender ?? "",
        address: student?.address ?? "",
        parentId: student?.parentId ?? "",
        guardianId: student?.guardianId ?? "",
        admissionDate: student?.admissionDate ? student.admissionDate.slice(0, 10) : "",
        bloodGroup: student?.bloodGroup ?? "",
        academicYearId: activeEnrollment?.academicYearId ?? "",
        classId: activeEnrollment?.classId ?? "",
        sectionId: activeEnrollment?.sectionId ?? "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [avatar, setAvatar] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState("");

    // DIRECT PARENT CREATION FIELDS (NO DROPDOWN)
    const [parentFullName, setParentFullName] = useState("");
    const [parentEmail, setParentEmail] = useState("");
    const [parentPhone, setParentPhone] = useState("");
    const [parentPassword, setParentPassword] = useState("Parent@123");
    const [parentOccupation, setParentOccupation] = useState("");

    // DIRECT GUARDIAN CREATION FIELDS (NO DROPDOWN)
    const [guardianFullName, setGuardianFullName] = useState("");
    const [guardianRelationship, setGuardianRelationship] = useState("");
    const [guardianPhone, setGuardianPhone] = useState("");

    const searchParams = useSearchParams();

    useEffect(() => {
        if (student) return;

        const qFullName = searchParams.get("fullName");
        const qAcademicYearId = searchParams.get("academicYearId");
        const qClassId = searchParams.get("classId");
        const qParentFullName = searchParams.get("parentFullName");
        const qParentPhone = searchParams.get("parentPhone");

        if (qFullName || qAcademicYearId || qClassId) {
            setForm((prev) => ({
                ...prev,
                fullName: qFullName || prev.fullName,
                academicYearId: qAcademicYearId || prev.academicYearId,
                classId: qClassId || prev.classId,
            }));
            if (qClassId) {
                onClassChange?.(qClassId);
            }
        }

        if (qParentFullName) {
            setParentFullName(qParentFullName);
        }
        if (qParentPhone) {
            setParentPhone(qParentPhone);
        }
    }, [student, searchParams, onClassChange]);

    useEffect(() => {
        if (!student) return;

        const enrollment =
            student.enrollments?.find(
                (item) => item.status === "ACTIVE" && item.academicYear.isCurrent,
            ) ??
            student.enrollments?.find((item) => item.status === "ACTIVE") ??
            student.enrollments?.[0];

        setForm({
            fullName: student.user.fullName ?? "",
            email: student.user.email ?? "",
            phone: student.user.phone ?? "",
            password: "",
            rollNo: enrollment?.rollNo ?? student.rollNo ?? "",
            dob: student.dob ? student.dob.slice(0, 10) : "",
            gender: student.gender ?? "",
            address: student.address ?? "",
            parentId: student.parentId ?? "",
            guardianId: student.guardianId ?? "",
            admissionDate: student.admissionDate ? student.admissionDate.slice(0, 10) : "",
            bloodGroup: student.bloodGroup ?? "",
            academicYearId: enrollment?.academicYearId ?? "",
            classId: enrollment?.classId ?? "",
            sectionId: enrollment?.sectionId ?? "",
        });

        if (student.parentId && student.parent) {
            setParentFullName(student.parent.user.fullName ?? "");
            setParentEmail(student.parent.user.email ?? "");
            setParentPhone(student.parent.user.phone ?? "");
            setParentOccupation(student.parent.occupation ?? "");
        }

        onClassChange?.(enrollment?.classId ?? "");
    }, [student, onClassChange]);

    useEffect(() => {
        if (!avatar) {
            setAvatarPreview(getFileUrl(student?.user.avatar));
            return;
        }

        const objectUrl = URL.createObjectURL(avatar);
        setAvatarPreview(objectUrl);

        return () => {
            URL.revokeObjectURL(objectUrl);
        };
    }, [avatar, student?.user.avatar]);

    const filteredSections = sections.filter(
        (section) => !form.classId || section.classId === form.classId,
    );

    const selectedClass = classes.find((c) => c.id === form.classId);
    const selectedSection = sections.find((s) => s.id === form.sectionId);

    const handleChange = (
        event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = event.target;
        setForm((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const handleClassChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const classId = event.target.value;
        setForm((current) => ({
            ...current,
            classId,
            sectionId: "",
        }));
        onClassChange?.(classId);
    };

    const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        setAvatar(file);
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // Validation for parent account creation
        if (parentFullName.trim()) {
            if (!parentEmail.trim()) {
                toast.error("Please enter Parent Email to create or link the parent account");
                return;
            }

            if (form.email.trim().toLowerCase() === parentEmail.trim().toLowerCase()) {
                toast.error("Student Email and Parent Email cannot be identical. Both need separate email accounts.");
                return;
            }
        }

        const basePayload = {
            fullName: form.fullName.trim(),
            email: form.email.trim(),
            phone: form.phone.trim() || null,
            rollNo: form.rollNo.trim() || null,
            dob: form.dob || null,
            gender: form.gender || null,
            address: form.address.trim() || null,
            parentId: form.parentId || null,
            guardianId: form.guardianId || null,
            admissionDate: form.admissionDate || null,
            bloodGroup: form.bloodGroup.trim() || null,
            academicYearId: form.academicYearId,
            classId: form.classId,
            sectionId: form.sectionId || null,
            avatar,
            parentFullName: parentFullName.trim() || null,
            parentEmail: parentEmail.trim() || null,
            parentPhone: parentPhone.trim() || null,
            parentOccupation: parentOccupation.trim() || null,
            parentPassword: parentPassword.trim() || null,
            guardianFullName: guardianFullName.trim() || null,
            guardianRelationship: guardianRelationship.trim() || null,
            guardianPhone: guardianPhone.trim() || null,
        };

        if (student) {
            const payload: UpdateStudentPayload = {
                ...basePayload,
                ...(form.password.trim() ? { password: form.password } : {}),
            };
            await onSubmit(payload as T);
            return;
        }

        if (!form.password.trim()) {
            toast.error("Please enter a password for the student account (minimum 8 characters)");
            return;
        }

        const payload: CreateStudentPayload = { ...basePayload, password: form.password };
        await onSubmit(payload as T);
    };

    // Checklist validation
    const hasName = Boolean(form.fullName.trim());
    const hasEmail = Boolean(form.email.trim());
    const hasAcademicYear = Boolean(form.academicYearId);
    const hasClass = Boolean(form.classId);
    const hasPassword = Boolean(student || form.password.trim().length >= 8);
    const isReadyToSubmit = hasName && hasEmail && hasAcademicYear && hasClass && hasPassword;
    const isSubmitting = loading;

    return (
        <form onSubmit={handleSubmit} className="w-full space-y-6">
            {error && (
                <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive font-medium flex items-center gap-2">
                    <Shield className="h-4 w-4 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {/* Enterprise 2-Column Architecture: 8 cols main form + 4 cols preview/sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* LEFT COLUMN: 8 COLS */}
                <div className="lg:col-span-8 space-y-6">
                    {/* SECTION 1: Personal & Account Identity */}
                    <Card className="border-border bg-card shadow-sm">
                        <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-base font-semibold flex items-center gap-2">
                                    <User className="h-4 w-4 text-primary" />
                                    Personal & Student Account
                                </CardTitle>
                                <Badge variant="secondary" className="text-xs">
                                    Student Credentials
                                </Badge>
                            </div>
                            <CardDescription>
                                Basic identifying information and login credentials for the student portal.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="fullName" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                                        Student Legal Name <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="fullName"
                                        name="fullName"
                                        value={form.fullName}
                                        onChange={handleChange}
                                        required
                                        disabled={isSubmitting}
                                        placeholder="e.g. Johnathan Doe"
                                        className="h-10 text-sm bg-background"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                                        <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                                        Student Email <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        required
                                        disabled={isSubmitting}
                                        placeholder="student@school.edu"
                                        className="h-10 text-sm bg-background"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                                        <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                                        Contact Phone <span className="text-xs text-muted-foreground font-normal">(Optional)</span>
                                    </Label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        value={form.phone}
                                        onChange={handleChange}
                                        disabled={isSubmitting}
                                        placeholder="+1 (555) 000-0000"
                                        className="h-10 text-sm bg-background"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-xs font-semibold text-foreground flex items-center justify-between">
                                        <span>
                                            {student ? "New Password" : "Password"} {!student && <span className="text-destructive">*</span>}
                                        </span>
                                        {student && (
                                            <span className="text-[11px] text-muted-foreground font-normal">
                                                Leave blank to retain
                                            </span>
                                        )}
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            value={form.password}
                                            onChange={handleChange}
                                            required={!student}
                                            minLength={8}
                                            disabled={isSubmitting}
                                            placeholder={student ? "•••••••• (unchanged)" : "Min. 8 characters"}
                                            className="h-10 pr-10 text-sm bg-background"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            tabIndex={-1}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* SECTION 2: Academic Enrollment */}
                    <Card className="border-border bg-card shadow-sm">
                        <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-base font-semibold flex items-center gap-2">
                                    <GraduationCap className="h-4 w-4 text-primary" />
                                    Academic Enrollment
                                </CardTitle>
                                <Badge variant="outline" className="text-xs font-normal">
                                    Session & Class
                                </Badge>
                            </div>
                            <CardDescription>
                                Academic year cohort, standard class, designated section and roll assignment.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="academicYearId" className="text-xs font-semibold text-foreground">
                                        Academic Year <span className="text-destructive">*</span>
                                    </Label>
                                    <select
                                        id="academicYearId"
                                        name="academicYearId"
                                        value={form.academicYearId}
                                        onChange={handleChange}
                                        required
                                        disabled={isSubmitting}
                                        className="border-input bg-background ring-offset-background focus-visible:ring-primary flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <option value="">-- Select Academic Year --</option>
                                        {academicYears.map((item) => (
                                            <option key={item.id} value={item.id}>
                                                {item.name} {item.code ? `(${item.code})` : ""}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="classId" className="text-xs font-semibold text-foreground">
                                        Class Standard <span className="text-destructive">*</span>
                                    </Label>
                                    <select
                                        id="classId"
                                        name="classId"
                                        value={form.classId}
                                        onChange={handleClassChange}
                                        required
                                        disabled={isSubmitting}
                                        className="border-input bg-background ring-offset-background focus-visible:ring-primary flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <option value="">-- Select Class --</option>
                                        {classes.map((item) => (
                                            <option key={item.id} value={item.id}>
                                                {item.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="sectionId" className="text-xs font-semibold text-foreground">
                                        Section Division
                                    </Label>
                                    <select
                                        id="sectionId"
                                        name="sectionId"
                                        value={form.sectionId}
                                        onChange={handleChange}
                                        disabled={isSubmitting || !form.classId}
                                        className="border-input bg-background ring-offset-background focus-visible:ring-primary flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <option value="">
                                            {!form.classId ? "-- First Select Class --" : "-- Select Section (Optional) --"}
                                        </option>
                                        {filteredSections.map((item) => (
                                            <option key={item.id} value={item.id}>
                                                Section {item.name} {item.capacity ? `(Cap: ${item.capacity})` : ""}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="rollNo" className="text-xs font-semibold text-foreground">
                                        Roll Number <span className="text-xs text-muted-foreground font-normal">(Optional)</span>
                                    </Label>
                                    <Input
                                        id="rollNo"
                                        name="rollNo"
                                        value={form.rollNo}
                                        onChange={handleChange}
                                        disabled={isSubmitting}
                                        placeholder="e.g. 14 or A-02"
                                        className="h-10 text-sm bg-background"
                                    />
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="admissionDate" className="text-xs font-semibold text-foreground">
                                        Admission Date
                                    </Label>
                                    <Input
                                        id="admissionDate"
                                        name="admissionDate"
                                        type="date"
                                        value={form.admissionDate}
                                        onChange={handleChange}
                                        disabled={isSubmitting}
                                        className="h-10 text-sm bg-background max-w-sm"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* SECTION 3: Parent & Guardian Details (DIRECT INPUT FIELDS - NO DROPDOWNS) */}
                    <Card className="border-border bg-card shadow-sm">
                        <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-base font-semibold flex items-center gap-2">
                                    <Users className="h-4 w-4 text-primary" />
                                    Parent & Guardian Information
                                </CardTitle>
                                <Badge variant="secondary" className="text-xs">
                                    Direct Entry
                                </Badge>
                            </div>
                            <CardDescription>
                                Enter parent information here. When student is registered, their parent account will be created and linked automatically.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            {/* Primary Parent Direct Input Fields */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 pb-1 border-b border-border/60">
                                    <UserCheck className="h-4 w-4 text-primary" />
                                    <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                                        Primary Parent Details
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="parentFullName" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                                            Parent Full Name
                                        </Label>
                                        <Input
                                            id="parentFullName"
                                            value={parentFullName}
                                            onChange={(e) => setParentFullName(e.target.value)}
                                            disabled={isSubmitting}
                                            placeholder="e.g. Ramesh Sharma"
                                            className="h-10 text-sm bg-background"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="parentEmail" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                                            <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                                            Parent Email {parentFullName.trim() && <span className="text-destructive">*</span>}
                                        </Label>
                                        <Input
                                            id="parentEmail"
                                            type="email"
                                            value={parentEmail}
                                            onChange={(e) => setParentEmail(e.target.value)}
                                            disabled={isSubmitting}
                                            placeholder="parent@example.com"
                                            className="h-10 text-sm bg-background"
                                        />
                                        <p className="text-[11px] text-muted-foreground">
                                            Used for the parent portal login account.
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="parentPhone" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                                            <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                                            Parent Contact Phone
                                        </Label>
                                        <Input
                                            id="parentPhone"
                                            value={parentPhone}
                                            onChange={(e) => setParentPhone(e.target.value)}
                                            disabled={isSubmitting}
                                            placeholder="+91 9876543210"
                                            className="h-10 text-sm bg-background"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="parentOccupation" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                                            <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                                            Parent Occupation
                                        </Label>
                                        <Input
                                            id="parentOccupation"
                                            value={parentOccupation}
                                            onChange={(e) => setParentOccupation(e.target.value)}
                                            disabled={isSubmitting}
                                            placeholder="e.g. Doctor, Business, Engineer"
                                            className="h-10 text-sm bg-background"
                                        />
                                    </div>

                                    {!student && (
                                        <div className="space-y-2 md:col-span-2">
                                            <Label htmlFor="parentPassword" className="text-xs font-semibold text-foreground flex items-center justify-between">
                                                <span>Parent Portal Password</span>
                                                <span className="text-[11px] text-muted-foreground font-normal">
                                                    Default: Parent@123
                                                </span>
                                            </Label>
                                            <Input
                                                id="parentPassword"
                                                value={parentPassword}
                                                onChange={(e) => setParentPassword(e.target.value)}
                                                disabled={isSubmitting}
                                                placeholder="Parent@123"
                                                className="h-10 text-sm bg-background"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Secondary Guardian Direct Input Fields */}
                            <div className="pt-4 border-t border-border/60 space-y-4">
                                <div className="flex items-center gap-2 pb-1 border-b border-border/40">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                                        Secondary Guardian Details (Optional)
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="guardianFullName" className="text-xs font-medium text-foreground">
                                            Guardian Name
                                        </Label>
                                        <Input
                                            id="guardianFullName"
                                            value={guardianFullName}
                                            onChange={(e) => setGuardianFullName(e.target.value)}
                                            disabled={isSubmitting}
                                            placeholder="e.g. Suresh Sharma"
                                            className="h-10 text-sm bg-background"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="guardianRelationship" className="text-xs font-medium text-foreground">
                                            Relationship
                                        </Label>
                                        <Input
                                            id="guardianRelationship"
                                            value={guardianRelationship}
                                            onChange={(e) => setGuardianRelationship(e.target.value)}
                                            disabled={isSubmitting}
                                            placeholder="e.g. Uncle, Grandparent"
                                            className="h-10 text-sm bg-background"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="guardianPhone" className="text-xs font-medium text-foreground">
                                            Guardian Phone
                                        </Label>
                                        <Input
                                            id="guardianPhone"
                                            value={guardianPhone}
                                            onChange={(e) => setGuardianPhone(e.target.value)}
                                            disabled={isSubmitting}
                                            placeholder="+91 0000000000"
                                            className="h-10 text-sm bg-background"
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* SECTION 4: Demographics & Medical Profile */}
                    <Card className="border-border bg-card shadow-sm">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <HeartPulse className="h-4 w-4 text-primary" />
                                Demographics & Health Profile
                            </CardTitle>
                            <CardDescription>
                                Student demographic details, medical identifiers, and residential address.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="dob" className="text-xs font-semibold text-foreground">
                                        Date of Birth
                                    </Label>
                                    <Input
                                        id="dob"
                                        name="dob"
                                        type="date"
                                        value={form.dob}
                                        onChange={handleChange}
                                        disabled={isSubmitting}
                                        className="h-10 text-sm bg-background"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="gender" className="text-xs font-semibold text-foreground">
                                        Gender
                                    </Label>
                                    <select
                                        id="gender"
                                        name="gender"
                                        value={form.gender}
                                        onChange={handleChange}
                                        disabled={isSubmitting}
                                        className="border-input bg-background ring-offset-background focus-visible:ring-primary flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="MALE">Male</option>
                                        <option value="FEMALE">Female</option>
                                        <option value="OTHER">Other</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="bloodGroup" className="text-xs font-semibold text-foreground">
                                        Blood Group
                                    </Label>
                                    <select
                                        id="bloodGroup"
                                        name="bloodGroup"
                                        value={form.bloodGroup}
                                        onChange={handleChange}
                                        disabled={isSubmitting}
                                        className="border-input bg-background ring-offset-background focus-visible:ring-primary flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <option value="">Select Blood Group</option>
                                        <option value="A+">A+</option>
                                        <option value="A-">A-</option>
                                        <option value="B+">B+</option>
                                        <option value="B-">B-</option>
                                        <option value="O+">O+</option>
                                        <option value="O-">O-</option>
                                        <option value="AB+">AB+</option>
                                        <option value="AB-">AB-</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2 pt-2">
                                <Label htmlFor="address" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                                    <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                                    Residential Address
                                </Label>
                                <textarea
                                    id="address"
                                    name="address"
                                    value={form.address}
                                    onChange={handleChange}
                                    rows={3}
                                    disabled={isSubmitting}
                                    placeholder="Enter street, city, state, postal code..."
                                    className="border-input bg-background ring-offset-background focus-visible:ring-primary flex w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* RIGHT COLUMN: 4 COLS */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Live Student Identity Card Preview */}
                    <Card className="border-border bg-card shadow-sm overflow-hidden">
                        <div className="h-16 bg-gradient-to-r from-primary to-primary/80 p-3 text-primary-foreground flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <IdCard className="h-5 w-5" />
                                <span className="text-xs font-bold uppercase tracking-wider">Student ID Card</span>
                            </div>
                            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded">
                                {student?.admissionNo ?? "NEW-ST"}
                            </span>
                        </div>
                        <CardContent className="p-5 pt-0 -mt-8">
                            <div className="flex flex-col items-center text-center">
                                {/* Photo Container with Upload Trigger */}
                                <div className="relative group">
                                    <div className="h-24 w-24 rounded-2xl border-4 border-background bg-muted text-foreground flex items-center justify-center overflow-hidden shadow-md font-bold text-2xl">
                                        {avatarPreview ? (
                                            <img
                                                src={avatarPreview}
                                                alt={form.fullName || "Student Photo"}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            getInitials(form.fullName)
                                        )}
                                    </div>
                                    <label
                                        htmlFor="avatar-upload"
                                        className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center cursor-pointer shadow hover:scale-105 transition"
                                        title="Change Photo"
                                    >
                                        <Camera className="h-4 w-4" />
                                        <input
                                            id="avatar-upload"
                                            type="file"
                                            accept="image/jpeg,image/png,image/webp"
                                            onChange={handleAvatarChange}
                                            disabled={isSubmitting}
                                            className="sr-only"
                                        />
                                    </label>
                                </div>

                                <div className="mt-3">
                                    <h4 className="font-bold text-base text-foreground leading-tight">
                                        {form.fullName.trim() || "Student Full Name"}
                                    </h4>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        {form.email.trim() || "student@school.edu"}
                                    </p>
                                </div>

                                {/* ID Badge Quick Details */}
                                <div className="mt-4 w-full bg-muted/40 rounded-xl p-3 text-xs space-y-2">
                                    <div className="flex justify-between items-center text-muted-foreground">
                                        <span>Class:</span>
                                        <span className="font-semibold text-foreground">
                                            {selectedClass ? selectedClass.name : "Not Selected"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-muted-foreground">
                                        <span>Section:</span>
                                        <span className="font-semibold text-foreground">
                                            {selectedSection ? selectedSection.name : "--"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-muted-foreground">
                                        <span>Roll No:</span>
                                        <span className="font-semibold text-foreground">
                                            {form.rollNo.trim() || "--"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-muted-foreground">
                                        <span>Blood Group:</span>
                                        <span className="font-semibold text-foreground">
                                            {form.bloodGroup || "--"}
                                        </span>
                                    </div>
                                    {parentFullName.trim() && (
                                        <div className="flex justify-between items-center text-muted-foreground border-t border-border/40 pt-1.5">
                                            <span>Parent:</span>
                                            <span className="font-semibold text-foreground truncate max-w-[120px]">
                                                {parentFullName}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <label
                                    htmlFor="avatar-upload"
                                    className="mt-3 inline-flex items-center gap-1.5 text-xs text-primary font-medium hover:underline cursor-pointer"
                                >
                                    <Camera className="h-3.5 w-3.5" />
                                    {avatar ? avatar.name : "Upload / Replace Photo"}
                                </label>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Submission Card & Checklist */}
                    <Card className="border-border bg-card shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-primary" />
                                Registration Checklist
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2 text-xs">
                                <div className="flex items-center gap-2">
                                    {hasName ? (
                                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                    ) : (
                                        <Circle className="h-4 w-4 text-muted-foreground" />
                                    )}
                                    <span className={hasName ? "text-foreground font-medium" : "text-muted-foreground"}>
                                        Student Legal Name
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {hasEmail ? (
                                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                    ) : (
                                        <Circle className="h-4 w-4 text-muted-foreground" />
                                    )}
                                    <span className={hasEmail ? "text-foreground font-medium" : "text-muted-foreground"}>
                                        Student Portal Email
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {hasAcademicYear && hasClass ? (
                                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                    ) : (
                                        <Circle className="h-4 w-4 text-muted-foreground" />
                                    )}
                                    <span className={hasAcademicYear && hasClass ? "text-foreground font-medium" : "text-muted-foreground"}>
                                        Class & Session Assigned
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {hasPassword ? (
                                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                    ) : (
                                        <Circle className="h-4 w-4 text-muted-foreground" />
                                    )}
                                    <span className={hasPassword ? "text-foreground font-medium" : "text-muted-foreground"}>
                                        Student Password Configured
                                    </span>
                                </div>
                                {parentFullName.trim() && (
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-blue-500" />
                                        <span className="text-foreground font-medium truncate">
                                            Parent Account: {parentFullName}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="pt-2 border-t border-border flex flex-col gap-2">
                                <Button
                                    type="submit"
                                    disabled={isSubmitting || !isReadyToSubmit}
                                    className="w-full shadow-sm font-medium h-10"
                                >
                                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {student ? "Update Student Record" : "Register Student"}
                                </Button>

                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onCancel}
                                    disabled={isSubmitting}
                                    className="w-full h-10"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </form>
    );
}
