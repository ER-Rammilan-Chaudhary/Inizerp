
"use client";
import { MoreHorizontal, Eye, Pencil, Trash2, Bell, Check } from "lucide-react";
import { Button, } from "@/components/ui/button";
import Loader from "@/components/common/Loader";
import { Checkbox, } from "@/components/ui/checkbox";
import { Badge, } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu";
import type { Notification, NotificationTableProps, } from "../types/notification.types";

export default function NotificationTable({ data, loading, selectedRows, onSelectionChange, onView, onEdit, onDelete, onMarkRead, onBulkDelete, onBulkRead, }: NotificationTableProps) {

    const isLoading = loading;
    const toggleRow = (id: string) => {
        if (selectedRows.includes(id)) { onSelectionChange(selectedRows.filter(item => item !== id,),); return; }
        onSelectionChange([...selectedRows, id,]);
    };

    const toggleAll = () => {
        if (selectedRows.length === data.length) {
            onSelectionChange([]); return;
        }
        onSelectionChange(data.map((item) => item.id,),);
    };
    const getPriorityVariant = (priority: string) => {
        switch (priority) { case "HIGH": case "URGENT": return "destructive"; case "NORMAL": return "secondary"; default: return "outline"; }
    };


    if (isLoading) {
        return <Loader text="Loading Notification..." />;
    }


    if (data.length === 0) {
        return (
            <div className="rounded-xl border py-12 text-center">
                <Bell className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
                <h3 className="font-semibold"> No notifications found </h3 >
                <p className="mt-1 text-sm text-muted-foreground"> Create your first notification. </p >
            </div>
        );

    }

    return (

        <div className="space-y-4 pb-10">
            {selectedRows.length > 0 && (
                <div className="flex flex-wrap items-center justify-between rounded-lg border bg-muted/30 p-3">
                    <p className="text-sm font-medium"> {selectedRows.length}selected </p >

                    <div className="flex gap-2">
                        <Button size="sm" onClick={() => onBulkRead(selectedRows)}> Mark Read </Button >
                        <Button size="sm" variant="destructive" onClick={() => onBulkDelete(selectedRows)}> Delete </Button >
                    </div>
                </div>

            )}

            <div className="overflow-x-auto rounded-xl border">
                <table className="min-w-full text-sm">
                    <thead className="bg-muted/40">
                        <tr>
                            <th className="w-12 p-3">
                                <Checkbox checked={data.length > 0 && selectedRows.length === data.length}
                                    onCheckedChange={toggleAll}
                                />
                            </th>
                            <th className="p-3 text-left"> Title </th >
                            <th className="p-3 text-left"> Type </th >
                            <th className="p-3 text-left"> Priority </th >
                            <th className="p-3 text-left"> Status </th >
                            <th className="p-3 text-left"> Created </th >
                            <th className="w-20 p-3 text-center"> Action </th >
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item: Notification) => (
                            <tr key={item.id} className="border-b transition-colors hover:bg-muted/50">
                                <td className="p-3"> <Checkbox checked={selectedRows.includes(item.id)} onCheckedChange={() => toggleRow(item.id)} />
                                </td >
                                <td className="p-3"> <div className="font-medium"> {item.title}
                                </div >
                                    <div className="max-w-xs truncate text-xs text-muted-foreground"> {item.message}</div >
                                </td >
                                <td className="p-3">
                                    <Badge variant="outline"> {item.type.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (l: string) => l.toUpperCase())}
                                    </Badge >
                                </td >
                                <td className="p-3"> <Badge variant={getPriorityVariant(item.priority)}>
                                    {item.priority}
                                </Badge >
                                </td >
                                <td className="p-3">
                                    <Badge variant={item.status === "SENT" ? "default" : item.status === "SCHEDULED" ? "secondary" : item.status === "DRAFT" ? "outline" : "destructive"}>
                                        {item.status}
                                    </Badge >
                                </td >
                                <td className="p-3 text-sm text-muted-foreground"> {new Date(item.createdAt).toLocaleDateString()}
                                </td >
                                <td className="p-3 text-right">
                                    <DropdownMenu >
                                        <DropdownMenuTrigger >
                                            <MoreHorizontal className="h-4 w-4 cursor-pointer" />
                                        </DropdownMenuTrigger >
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => onView(item)}>
                                                <Eye className="mr-2 h-4 w-4" /> View
                                            </DropdownMenuItem >
                                            <DropdownMenuItem onClick={() => onEdit(item)}>
                                                <Pencil className="mr-2 h-4 w-4" /> Edit
                                            </DropdownMenuItem >
                                            <DropdownMenuItem onClick={() => onMarkRead(item)}>
                                                <Check className="mr-2 h-4 w-4" /> Mark Read
                                            </DropdownMenuItem >
                                            <DropdownMenuItem className="text-red-600" onClick={() => onDelete(item)}>
                                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                                            </DropdownMenuItem >
                                        </DropdownMenuContent >
                                    </DropdownMenu >
                                </td >
                            </tr >
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
}



