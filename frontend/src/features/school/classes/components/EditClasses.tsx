// 'use client'
// import { useEffect, useState } from "react";
// import { Loader2 } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

// import type { Class, CreateClassPayload, UpdateClassPayload, } from "../types/classes.types";
// import { ClassArray } from "clsx";
// import { tr } from "zod/v4/locales";


// interface ClassFormProps {
//     classItem?: Class;
//     loading?: boolean;
//     onSubmit: (payload: CreateClassPayload | UpdateClassPayload,) => void | Promise<void>;
//     onCancel?: () => void;
// }



// export default function EditClassesPage({ classItem, loading = false, onSubmit, onCancel }: ClassFormProps) {
//     const [name, setName] = useState('')

//     useEffect(() => {
//         setName(classItem?.name ?? '')
//     }, [classItem])

//     const handleSubmit = async (event: React.FormEvent<HTMLFormElement>,) => {
//         event.preventDefault();
//         const trimmedName = name.trim()

//         if (!trimmedName) {
//             return;
//         }
//         await onSubmit({ name: trimmedName })
//     }


//     return (
//         <form onSubmit={handleSubmit}>
//             <div className="field">
//                 <label htmlFor="class-name"> Class Name</label>
//                 <input type="text" value={name}
//                     onChange={(event) => setName(event.target.value)}
//                     placeholder='Enter class Name'
//                     disabled={loading}
//                     required
//                 />
//             </div>

//             <div className="submit">
//                 {oncancel && (
//                     <Button type="button" variant="outline" onClick={onCancel} disabled={loading} >cencel
//                     </Button>
//                 )}

//                 <Button type="submit" disabled={loading || !name.trim()}>
//                     {loading && (
//                         <Loader2 className="mr-2 h-4 w-4 animate-spin"></Loader2>
//                     )}
//                     {classItem ? "Update Class" : "Create Class"}
//                 </Button>
//             </div>
//         </form >

//     )
// }