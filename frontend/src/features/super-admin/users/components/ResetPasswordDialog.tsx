"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from "@/components/ui/dialog";
import { Input, } from "@/components/ui/input";
import { Button, } from "@/components/ui/button";
import { User } from "../types/user.types";


interface Props {
    user: User | null;
    open: boolean;
    loading?: boolean;
    onOpenChange: (open: boolean,) => void;
    onConfirm: (password: string,) => void;
}
export default function ResetPasswordDialog({ user, open, loading, onOpenChange, onConfirm, }: Props) {
    const [password, setPassword] = useState("");
    const handleSubmit = () => { if (password.length < 6) return; onConfirm(password); };
    return (
        <Dialog open={open}
            onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle> Reset Password </DialogTitle>
                    <DialogDescription> Set a new password for {" "}
                        <strong> {user?.fullName}
                        </strong>
                    </DialogDescription>
                </DialogHeader>
                <Input type="password"
                    placeholder="New password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} />

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel </Button> <Button disabled={loading || password.length < 6} onClick={handleSubmit}>
                        {loading ? "Resetting..." : "Reset Password"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>);
}
