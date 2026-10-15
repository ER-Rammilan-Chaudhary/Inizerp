"use client";

interface LoaderProps {
    text?: string;
    fullScreen?: boolean;
}

export default function Loader({
    text = "Loading...",
    fullScreen = false,
}: LoaderProps) {
    return (
        <div
            role="status"
            aria-live="polite"
            className={
                fullScreen
                    ? "fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
                    : "flex min-h-[40vh] items-center justify-center"
            }
        >
            <div className="flex flex-col items-center gap-4">
                <div className="relative h-12 w-12">
                    <div className="absolute inset-0 rounded-full border-4 border-border" />
                    <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-primary" />
                </div>
                <p className="animate-pulse text-sm font-medium text-muted-foreground">
                    {text}
                </p>
            </div>
        </div>
    );
}