import React from "react"
import {
    Users,
    Banknote,
    AreaChart,
    Target,
    Rocket
} from "lucide-react"
import { Card } from "../ui/card"

// Define your data in an array for easy management
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
        isFeatured: true, // A flag for special styling
    },
]

export default function WhoIsThisFor() {
    return (
        // Use a <section> for semantic HTML and page-level styling
        <section className="container rounded-xl py-20  bg-gradient-to-br from-[#1e3c72] via-[#2a5298] to-[#000000] ">
            <div className="w-full mx-auto text-center px-4">

                {/* Main Header */}
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
                    Is This Program Right For You?
                </h2>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-400">
                    This course is designed for ambitious professionals who want to reclaim their time and become indispensable to their teams.
                </p>

                {/* Grid for the feature list */}
                <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
                    {whoIsThisForData.map((item, index) => (
                        <li
                            key={index}
                            // Make the featured item span two columns on large screens
                            className={`
                flex flex-col items-start text-left p-6 rounded-xl border
                border-white/10 bg-white/5 backdrop-blur-sm
                ${item.isFeatured ? "lg:col-span-2 lg:flex-row lg:items-center lg:gap-6" : ""}
              `}
                        >
                            {/* Icon with a styled background */}
                            <div className="bg-slate-800 p-3 rounded-lg border border-white/10">
                                {item.icon}
                            </div>
                            <p className={`mt-4 text-base text-slate-300 ${item.isFeatured ? "lg:mt-0" : ""}`}>
                                {item.text}
                            </p>
                        </li>
                    ))}
                </ul>

            </div>
        </section>
    )
}