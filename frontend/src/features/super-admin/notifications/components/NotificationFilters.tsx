"use client";
import { Button, } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import type {
    NotificationFilters as Filters,
    NotificationPriority,
    NotificationScope,
    NotificationType,
} from "../types/notification.types";


interface Props { filters: Filters; onChange: (value: Partial<Filters>) => void; onReset: () => void; }


export default function NotificationFilters({ filters, onChange, onReset, }: Props) {

    return (
        <div className="flex flex-wrap gap-3">
            <Select value={filters.scope ?? "all"}
                onValueChange={(value) => {
                    onChange({ scope: value === "all" ? undefined : value as NotificationScope, }
                    );
                }}>
                <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Scope" /> </SelectTrigger >
                <SelectContent > <SelectItem value="all"> All Scope </SelectItem >
                    <SelectItem value="GLOBAL"> Global </SelectItem >
                    <SelectItem value="SCHOOL"> School </SelectItem >
                </SelectContent >
            </Select >

            <Select value={filters.type ?? "all"}
                onValueChange={(value) => {
                    onChange({ type: value === "all" ? undefined : value as NotificationType, }
                    );
                }}>

                <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Type" />
                </SelectTrigger > <SelectContent >
                    <SelectItem value="all"> all Type </SelectItem >
                    <SelectItem value="SYSTEM"> System </SelectItem >
                    <SelectItem value="ANNOUNCEMENT"> Announcement </SelectItem >
                    <SelectItem value="EMERGENCY"> Emergency </SelectItem >
                    <SelectItem value="EXAM"> Exam </SelectItem >
                    <SelectItem value="FEES"> Fees </SelectItem >
                </SelectContent >
            </Select>

            <Select value={filters.priority ?? "all"}
                onValueChange={(value) => {
                    onChange({
                        priority: value === "all" ? undefined : value as NotificationPriority,
                    });
                }}>


                <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent >
                    <SelectItem value="all"> all Priority </SelectItem >
                    <SelectItem value="LOW"> Low </SelectItem >
                    <SelectItem value="NORMAL"> Normal </SelectItem >
                    <SelectItem value="HIGH"> High </SelectItem >
                    <SelectItem value="URGENT"> Urgent </SelectItem >
                </SelectContent >
            </Select >

            <Select value={filters.readStatus ?? "all"}
                onValueChange={(value) => {
                    onChange({ readStatus: value as "all" | "read" | "unread", }
                    );
                }}>

                <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Read Status" />
                </SelectTrigger>
                <SelectContent >
                    <SelectItem value="all"> all </SelectItem >
                    <SelectItem value="read"> Read </SelectItem >
                    <SelectItem value="unread"> Unread </SelectItem >
                </SelectContent >
            </Select >

            <Button variant="outline" onClick={onReset}>
                Reset
            </Button >


        </div >
    );
}