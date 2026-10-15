// "use client";

// import {
//     ArrowDownAZ,
//     ArrowDownUp,
//     ArrowUpAZ,
// } from "lucide-react";

// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from "@/components/ui/select";

// export interface DataTableSortOption {
//     value: string;
//     label: string;
// }

// interface DataTableSortProps {
//     value?: string;
//     options: DataTableSortOption[];
//     onChange: (value: string) => void;
//     placeholder?: string;
//     disabled?: boolean;
//     className?: string;
// }

// function getSortIcon(value: string) {
//     if (value.endsWith(":asc")) {
//         return <ArrowDownAZ className="size-4" />;
//     }

//     if (value.endsWith(":desc")) {
//         return <ArrowUpAZ className="size-4" />;
//     }

//     return <ArrowDownUp className="size-4" />;
// }

// export default function DataTableSort({
//     value,
//     options,
//     onChange,
//     placeholder = "Sort by",
//     disabled = false,
//     className,
// }: DataTableSortProps) {
//     const selectedOption = options.find(
//         (option) => option.value === value,
//     );

//     return (
//         <Select
//             value={value ?? ""}
//             onValueChange={(nextValue) => {
//                 if (nextValue) {
//                     onChange(nextValue);
//                 }
//             }}
//             disabled={disabled}
//         >
//             <SelectTrigger
//                 className={className ?? "w-[190px]"}
//             >
//                 <SelectValue placeholder={placeholder}>
//                     {selectedOption ? (
//                         <span className="flex items-center gap-2">
//                             {getSortIcon(selectedOption.value)}
//                             <span>{selectedOption.label}</span>
//                         </span>
//                     ) : null}
//                 </SelectValue>
//             </SelectTrigger>

//             <SelectContent>
//                 {options.map((option) => (
//                     <SelectItem
//                         key={option.value}
//                         value={option.value}
//                     >
//                         <span className="flex items-center gap-2">
//                             {getSortIcon(option.value)}
//                             <span>{option.label}</span>
//                         </span>
//                     </SelectItem>
//                 ))}
//             </SelectContent>
//         </Select>
//     );
// }


"use client";

import {
    ArrowDownAZ,
    ArrowDownUp,
    ArrowUpAZ,
} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export interface DataTableSortOption {
    value: string;
    label: string;
}

interface DataTableSortProps {
    value?: string;
    options: DataTableSortOption[];
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
}

function getSortIcon(value: string) {
    if (value.endsWith(":asc")) {
        return <ArrowDownAZ className="size-4" />;
    }

    if (value.endsWith(":desc")) {
        return <ArrowUpAZ className="size-4" />;
    }

    return <ArrowDownUp className="size-4" />;
}

export default function DataTableSort({
    value,
    options,
    onChange,
    placeholder = "Sort by",
    disabled = false,
    className,
}: DataTableSortProps) {
    const selectedOption = options.find(
        (option) => option.value === value,
    );

    return (
        <Select
            value={value ?? ""}
            onValueChange={(nextValue) => {
                if (nextValue) {
                    onChange(nextValue);
                }
            }}
            disabled={disabled}
        >
            <SelectTrigger className={className ?? "w-[190px]"}>
                <SelectValue placeholder={placeholder}>
                    {selectedOption ? (
                        <span className="flex items-center gap-2">
                            {getSortIcon(selectedOption.value)}
                            <span>{selectedOption.label}</span>
                        </span>
                    ) : null}
                </SelectValue>
            </SelectTrigger>

            <SelectContent>
                {options.map((option) => (
                    <SelectItem
                        key={option.value}
                        value={option.value}
                    >
                        <span className="flex items-center gap-2">
                            {getSortIcon(option.value)}
                            <span>{option.label}</span>
                        </span>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}