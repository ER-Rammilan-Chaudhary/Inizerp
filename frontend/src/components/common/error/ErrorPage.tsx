"use client";

import type { ReactNode } from "react";

interface Props {
    title?: string;
    message?: string;
    buttonText?: string;
    onRetry?: () => void;
    secondaryAction?: ReactNode;
}

export default function ErrorPage({ title = "Something went wrong", message = "Unable to complete your request.", buttonText = "Retry", onRetry, secondaryAction, }: Props) {

    return (
        <div className="flex min-h-[60vh] items-center justify-center p-4">
            <div className="w-full max-w-md rounded-xl border bg-card p-6 text-center shadow-sm">

                <div className="mb-4 text-4xl"> ⚠️</div >
                <h2 className="text-xl font-semibold"> {title}</h2 >
                <p className="mt-2 text-sm text-muted-foreground"> {message}</p >


                {(onRetry || secondaryAction) && (
                    <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-center">
                        {onRetry && (
                            <button
                                onClick={onRetry}
                                className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground"
                            >
                                {buttonText}
                            </button>
                        )}

                        {secondaryAction}
                    </div>
                )}

            </div>
        </div>
    );
}