// app/loading.tsx
"use client"

import { Loader2 } from "lucide-react"

export default function Loading() {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-[#1e3c72] via-[#2a5298] to-[#000000]">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-12 w-12 animate-spin text-white" />
                <p className="text-white text-lg font-medium animate-pulse">Loading....</p>
            </div>
        </div>
    )
}
