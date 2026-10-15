"use client";

import { Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGlobalSearch } from "@/hooks/useGlobalSearch";

export default function HeaderSearch() {
    const { search, setSearch, clearSearch, } = useGlobalSearch();


    return (
        <HeaderSearchInput
            search={search}
            setSearch={setSearch}
            clearSearch={clearSearch}
        />
    );
}


function HeaderSearchInput({ search, setSearch, clearSearch, }: { search: string; setSearch: (value: string) => void; clearSearch: () => void; }) {
    const router = useRouter();
    const pathname = usePathname();

    const [value, setValue] = useState(search);
    const isClearingRef = useRef(false);

    useEffect(() => {
        if (isClearingRef.current) { return; }
        setValue(search);
    }, [search]);


    useEffect(() => {
        if (isClearingRef.current) {
            return;
        }

        const trimmedValue = value.trim();

        if (trimmedValue === search) {
            return;
        }

        const timer = setTimeout(() => {
            if (isClearingRef.current) {
                return;
            }
            setSearch(trimmedValue);
            const params = new URLSearchParams(window.location.search,);

            if (trimmedValue) {
                params.set("search", trimmedValue);
            } else {
                params.delete("search");
            }
            params.set("page", "1");
            const queryString = params.toString();
            router.replace(queryString ? `${pathname}?${queryString}` : pathname,);

        }, 500);

        return () => clearTimeout(timer);
    }, [value, search, setSearch, router, pathname,]);

    const handleClear = () => {
        isClearingRef.current = true;
        setValue("");
        clearSearch();
        const params = new URLSearchParams(window.location.search,);
        params.delete("search");
        params.set("page", "1");

        const queryString = params.toString();
        router.replace(queryString ? `${pathname}?${queryString}` : pathname,);

        window.setTimeout(() => {
            isClearingRef.current = false;
        }, 0);
    };

    return (
        <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
                value={value}
                onChange={(event) => {
                    isClearingRef.current = false;
                    setValue(event.target.value);
                }}
                placeholder="Search across platform..."
                className="h-9 sm:h-10 pl-9 pr-9 text-xs sm:text-sm bg-card/60 focus:bg-card border-border/80"
            />

            {value && (
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={handleClear}
                    className=" absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer"
                >
                    <X className="size-4" />
                    <span className="sr-only">
                        Clear search
                    </span>
                </Button>
            )}
        </div>
    );
}

