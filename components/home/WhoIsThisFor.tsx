import React from "react"
import {
    Users,
    Banknote,
    AreaChart,
    Target,
    Rocket
} from "lucide-react"

// Define your data in an array
const whoIsThisForData = [
    {
        icon: <Users className="h-6 w-6 text-cyan-400" />,
        text: "MIS Executives tired of repetitive reporting",
    },
    {
        icon: <Banknote className="h-6 w-6 text-cyan-400" />,
        text: "Banking & Finance professionals handling bulk data",
    },
    {
        icon: <AreaChart className="h-6 w-6 text-cyan-400" />,
        text: "Data Analysts who want to upgrade skills with automation",
    },
    {
        icon: <Target className="h-6 w-6 text-cyan-400" />,
        text: "Job seekers preparing for Analyst/MIS interviews",
    },
    {
        icon: <Rocket className="h-6 w-6 text-cyan-400" />,
        text: "Any professional ready to transform their Excel skills",
        isFeatured: true,
    },
]

export default function WhoIsThisFor() {
    const featured = whoIsThisForData.find((item) => item.isFeatured)
    const others = whoIsThisForData.filter((item) => !item.isFeatured)

    return (
        <section className="container rounded-xl py-20 bg-gradient-to-br from-[#1e3c72] via-[#2a5298] to-[#000000]">
            <div className="w-full mx-auto text-center px-4">
                {/* Main Header */}
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
                    Is This Program Right For You?
                </h2>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-white">
                    This course is designed for ambitious professionals who want to reclaim their time and become indispensable to their teams.
                </p>

                {/* Two-column grid layout */}
                <div className="mt-12 grid grid-cols-1 lg:grid-cols-3  gap-6">
                    {/* Left side → non-featured in 2-col grid */}
                    <div className="lg:col-span-2 grid grid-cols-1 lg:grid-cols-2   gap-6">
                        {others.map((item, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-4 p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm hover:scale-[1.02] transition-transform"
                            >
                                <div className="bg-slate-800 p-3 rounded-lg border border-white/10">
                                    {item.icon}
                                </div>
                                <p className="text-base text-slate-300">{item.text}</p>
                            </div>
                        ))}
                    </div>

                    {/* Right side → featured item */}
                    {featured && (
                        <div className="flex flex-col items-center justify-center p-8 rounded-xl border border-cyan-400/40 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 shadow-xl hover:scale-[1.02] transition-transform">
                            <div className="bg-slate-900  w-fit p-4 rounded-lg border border-white/10 mb-4">
                                {featured.icon}
                            </div>
                            <p className="text-lg md:text-xl font-semibold text-white leading-relaxed">
                                {featured.text}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}
