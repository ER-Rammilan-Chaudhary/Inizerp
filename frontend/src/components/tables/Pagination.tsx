
"use client";

import { Button } from "@/components/ui/button";
import {
    usePathname,
    useRouter,
    useSearchParams,
} from "next/navigation";

export interface PaginationData {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

interface PaginationProps {
    pagination: PaginationData;
    className?: string;
}

export default function Pagination({
    pagination,
    className,
}: PaginationProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { page, total, limit, totalPages, } = pagination;
    const hasNext = page < totalPages;
    const hasPrevious = page > 1;


    const changePage = (newPage: number) => {
        if (newPage < 1 || newPage > totalPages) {
            return;
        }
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", newPage.toString());
        router.push(`${pathname}?${params.toString()} `);
    };

    const startItem =
        total === 0 ? 0 : (page - 1) * limit + 1;

    const endItem = Math.min(page * limit, total);

    return (
        <div
            className={`flex items-center justify-between py-4 ${className ?? ""} `}>
            <p className="text-sm text-muted-foreground"> Showing {startItem}– {endItem}of {total}</p >
            <div className="flex items-center gap-2">
                <Button variant="outline" disabled={!hasPrevious} onClick={() => changePage(page - 1)}> Previous </Button >
                <span className="text-sm text-muted-foreground"> Page {page}of {totalPages}</span >
                <Button variant="outline" disabled={!hasNext} onClick={() => changePage(page + 1)}> Next </Button >
            </div>
        </div>
    );
}
