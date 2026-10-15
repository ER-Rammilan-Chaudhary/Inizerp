"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { getSchools } from "@/features/super-admin/schools/api/school.api";
import { createUser } from "@/features/super-admin/users/api/user.api";
import { getErrorMessage } from "@/lib/error-message";
import { toast } from "sonner";

interface School {
    id: string;
    name: string;
}

interface FormData {
    fullName: string;
    email: string;
    password: string;
    schoolId: string;
    avatar: File | null;
}


export default function CreateUserForm() {
    const router = useRouter();

    const [schools, setSchools] = useState<School[]>([]);
    const [loadingSchools, setLoadingSchools] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [formData, setFormData] = useState<FormData>({
        fullName: "",
        email: "",
        password: "",
        schoolId: "",
        avatar: null,
    });

    // ======================================================
    // FETCH SCHOOLS
    // ======================================================

    useEffect(() => {
        const fetchSchools = async () => {
            try {
                setLoadingSchools(true);
                setError("");

                const result = await getSchools(1, 100);

                setSchools(result.schools || []);
            } catch (error) {
                setError(
                    error instanceof Error
                        ? error.message
                        : "Failed to fetch schools",
                );
            } finally {
                setLoadingSchools(false);
            }
        };

        fetchSchools();
    }, []);


    const handleAvatarChange = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = e.target.files?.[0] ?? null;

        setError("");
        setSuccess("");

        if (!file) {
            setFormData((prev) => ({
                ...prev,
                avatar: null,
            }));
            return;
        }

        if (
            file.type !== "image/jpeg" &&
            file.type !== "image/png" &&
            file.type !== "image/webp"
        ) {
            setError("Only JPG, PNG or WEBP images are allowed");

            e.target.value = "";

            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            setError("Image must be less than 2MB");

            e.target.value = "";

            return;
        }

        setFormData((prev) => ({
            ...prev,
            avatar: file,
        }));
    };

    // ======================================================
    // INPUT CHANGE
    // ======================================================

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setError("");
        setSuccess("");
    };

    // ======================================================
    // SUBMIT
    // ======================================================

    const handleSubmit = async (
        e: FormEvent<HTMLFormElement>,
    ) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        // --------------------------------------------------
        // Validation
        // --------------------------------------------------

        if (!formData.fullName.trim()) {
            setError("Full name is required");
            return;
        }

        if (!formData.email.trim()) {
            setError("Email is required");
            return;
        }

        if (!formData.password) {
            setError("Password is required");
            return;
        }

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        if (!formData.schoolId) {
            setError("Please select a school");
            return;
        }

        // --------------------------------------------------
        // Create User
        // --------------------------------------------------

        try {
            setLoading(true);
            setError("");
            const result = await createUser({
                fullName: formData.fullName.trim(),
                email: formData.email.trim().toLowerCase(),
                password: formData.password,
                schoolId: formData.schoolId,
                avatar: formData.avatar,
            });

            if (!result?.success) {
                throw new Error(
                    result?.message || "Failed to create school admin",
                );
            }

            toast.success("School admin created successfully!");
            router.push("/super-admin/users");
        } catch (error: unknown) {
            console.error("CREATE USER ERROR:", error);
            setError(getErrorMessage(error, "Something went wrong"));
        } finally {
            setLoading(false);
        }

    };

    // ======================================================
    // UI
    // ======================================================

    return (
        <div className="w-full space-y-6 pb-10">
            <div className="w-full">

                {/* ==================================================
                    HEADER
                ================================================== */}

                <div className="mb-6">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">
                            Create School Admin
                        </h1>
                        <p className="text-xs text-muted-foreground">
                            Create a new school administrator and assign them to a school.
                        </p>
                    </div>
                </div>

                {/* ==================================================
                    FORM CARD
                ================================================== */}

                <div className="overflow-hidden rounded-[var(--radius)] border border-border bg-card shadow-sm">

                    <form onSubmit={handleSubmit}>

                        <div className="space-y-6 p-6">

                            {/* ==================================================
                                ERROR
                            ================================================== */}

                            {error && (
                                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
                                    {error}
                                </div>
                            )}

                            {/* ==================================================
                                SUCCESS
                            ================================================== */}

                            {success && (
                                <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900 dark:bg-green-950/30 dark:text-green-300">
                                    {success}
                                </div>
                            )}

                            {/* ==================================================
                                FULL NAME
                            ================================================== */}

                            <div>
                                <label
                                    htmlFor="fullName"
                                    className="mb-2 block text-sm font-medium text-foreground"
                                >
                                    Full Name
                                </label>

                                <input
                                    id="fullName"
                                    name="fullName"
                                    type="text"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    placeholder="Enter full name"
                                    disabled={loading}
                                    autoComplete="name"
                                    className="h-11 w-full rounded-lg border border-input bg-background px-4 text-sm text-foreground outline-none placeholder:text-muted-foreground transition focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50"
                                />
                            </div>

                            {/* ==================================================
                                EMAIL
                            ================================================== */}

                            <div>
                                <label
                                    htmlFor="email"
                                    className="mb-2 block text-sm font-medium text-foreground"
                                >
                                    Email Address
                                </label>

                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="admin@example.com"
                                    disabled={loading}
                                    autoComplete="email"
                                    className="h-11 w-full rounded-lg border border-input bg-background px-4 text-sm text-foreground outline-none placeholder:text-muted-foreground transition focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50"
                                />
                            </div>

                            {/* ==================================================
                                PASSWORD
                            ================================================== */}

                            <div>
                                <label
                                    htmlFor="password"
                                    className="mb-2 block text-sm font-medium text-foreground"
                                >
                                    Password
                                </label>

                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter password"
                                    disabled={loading}
                                    autoComplete="new-password"
                                    className="h-11 w-full rounded-lg border border-input bg-background px-4 text-sm text-foreground outline-none placeholder:text-muted-foreground transition focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50"
                                />

                                <p className="mt-2 text-xs text-muted-foreground">
                                    Password must be at least 6 characters.
                                </p>
                            </div>


                            {/* ==================================================
    ADMIN PHOTO
================================================== */}

                            <div>
                                <label
                                    htmlFor="avatar"
                                    className="mb-2 block text-sm font-medium text-foreground"
                                >
                                    Admin Photo
                                </label>

                                <input
                                    id="avatar"
                                    name="avatar"
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    disabled={loading}
                                    onChange={handleAvatarChange}
                                    className="block w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-foreground"
                                />

                                <p className="mt-2 text-xs text-muted-foreground">
                                    JPG, PNG or WEBP. Maximum size 2MB.
                                </p>

                                {formData.avatar && (
                                    <div className="mt-4 flex items-center gap-3">
                                        <img
                                            src={URL.createObjectURL(formData.avatar)}
                                            alt="Admin preview"
                                            className="h-16 w-16 rounded-full object-cover border border-border"
                                        />

                                        <div>
                                            <p className="text-sm font-medium text-foreground">
                                                {formData.avatar.name}
                                            </p>

                                            <p className="text-xs text-muted-foreground">
                                                {(formData.avatar.size / 1024 / 1024).toFixed(2)} MB
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>


                            {/* ==================================================
                                SCHOOL
                            ================================================== */}

                            <div>
                                <label
                                    htmlFor="schoolId"
                                    className="mb-2 block text-sm font-medium text-foreground"
                                >
                                    School
                                </label>

                                <select
                                    id="schoolId"
                                    name="schoolId"
                                    value={formData.schoolId}
                                    onChange={handleChange}
                                    disabled={
                                        loading ||
                                        loadingSchools
                                    }
                                    className="h-11 w-full rounded-lg border border-input bg-background px-4 text-sm text-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="">
                                        {loadingSchools
                                            ? "Loading schools..."
                                            : "Select a school"}
                                    </option>

                                    {schools.map((school) => (
                                        <option
                                            key={school.id}
                                            value={school.id}
                                        >
                                            {school.name}
                                        </option>
                                    ))}
                                </select>

                                {!loadingSchools &&
                                    schools.length === 0 && (
                                        <p className="mt-2 text-xs text-muted-foreground">
                                            No schools available.
                                        </p>
                                    )}
                            </div>

                            {/* ==================================================
                                ROLE
                            ================================================== */}

                            <div>
                                <label className="mb-2 block text-sm font-medium text-foreground">
                                    Role
                                </label>

                                <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/50 px-4 py-3">
                                    <span className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                                        SCHOOL ADMIN
                                    </span>

                                    <span className="text-sm text-muted-foreground">
                                        School administrator access
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* ==================================================
                            ACTIONS
                        ================================================== */}

                        <div className="flex justify-end gap-3 border-t border-border bg-muted/30 px-6 py-4">

                            <button
                                type="button"
                                onClick={() => router.back()}
                                disabled={loading}
                                className="rounded-lg border border-input bg-background px-5 py-2.5 text-sm font-medium text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={
                                    loading ||
                                    loadingSchools
                                }
                                className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {loading
                                    ? "Creating..."
                                    : "Create School Admin"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
