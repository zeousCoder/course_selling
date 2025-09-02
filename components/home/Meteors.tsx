import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Meteors } from "@/components/magicui/meteors"
import { BarChart3, Building2, Users, DollarSign, Target } from "lucide-react"

export default function ProjectsSection() {
    const projects = [
        {
            icon: <BarChart3 className="h-8 w-8 text-yellow-400" />,
            title: "Automated Sales Report",
            desc: "Build dynamic sales reporting system with real-time data updates",
        },
        {
            icon: <Building2 className="h-8 w-8 text-blue-400" />,
            title: "Loan Portfolio Dashboard",
            desc: "Banking sector dashboard with comprehensive KPIs and risk metrics",
        },
        {
            icon: <Users className="h-8 w-8 text-green-400" />,
            title: "HR Attrition Dashboard",
            desc: "Employee analytics with attrition insights and predictive modeling",
        },
        {
            icon: <DollarSign className="h-8 w-8 text-purple-400" />,
            title: "Finance MIS Tool",
            desc: "Comprehensive finance tool with VBA automation features",
        },
        {
            icon: <Target className="h-8 w-8 text-red-400" />,
            title: "Capstone Project",
            desc: "One-Click Business Dashboard - Your masterpiece project",
            highlight: true,
        },
    ]

    return (
        <section
            className="
        relative  container rounded-xl mx-auto border-0 shadow-2xl overflow-hidden
        bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364]
        p-12
      "
        >
            {/* Meteor animation background */}
            <Meteors number={30} />

            <CardHeader className="relative z-10 text-center">
                <CardTitle className="text-4xl font-bold text-white">
                    Projects You'll Build
                </CardTitle>
                <p className="mt-3 text-gray-300 max-w-3xl mx-auto text-lg">
                    Apply your learning with real-world, hands-on projects.
                </p>
            </CardHeader>

            <CardContent className="relative w-full z-10 mt-10">
                <div className="grid gap-8 grid-cols-1 lg:grid-cols-3 container mx-auto">
                    {projects.map((proj, i) => (
                        <div
                            key={i}
                            className={`
                p-6 w-full rounded-xl border shadow-lg transition-transform
                bg-white/5 backdrop-blur-sm hover:scale-105
                ${proj.highlight ? "border-yellow-400/70 shadow-yellow-500/30" : "border-white/10"}
              `}
                        >
                            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-white/10 mb-4">
                                {proj.icon}
                            </div>
                            <h3 className="text-xl font-semibold text-white">{proj.title}</h3>
                            <p className="mt-2 text-gray-300">{proj.desc}</p>
                        </div>
                    ))}
                </div>
            </CardContent>
        </section>
    )
}
