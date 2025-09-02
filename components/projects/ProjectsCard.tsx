"use client"

import React from "react"
import Link from "next/link"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const projects = [
    {
        id: 1,
        title: "📊 Data Analyst Portfolio",
        description:
            "A curated collection of my data analytics projects, dashboards, and case studies.",
        files: [
            { name: "Resume.pdf" },
            { name: "Portfolio.pdf" },
            { name: "CaseStudy.xlsx" },
        ],
    },
    {
        id: 2,
        title: "📈 Power BI Dashboard",
        description:
            "Interactive dashboard showcasing business KPIs and visual storytelling.",
        files: [{ name: "Dashboard.pbix" }, { name: "Report.pdf" }],
    },
]

export default function ProjectsCard() {
    return (
        <div className="container mx-auto">
            <h2 className="text-4xl font-bold mb-10 text-center">🚀 Featured Work</h2>

            <div className="grid gap-8 lg:grid-cols-3">
                {projects.map((project) => (
                    <Link key={project.id} href={`/projects/${project.id}`}>
                        <Card className="flex flex-col h-[340px] bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300 rounded-2xl cursor-pointer">
                            <CardHeader>
                                <CardTitle className="text-xl font-semibold">
                                    {project.title}
                                </CardTitle>
                                <CardDescription className="text-gray-600">
                                    {project.description}
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="flex flex-col justify-between gap-4 flex-grow">
                                <ul className="list-disc list-inside text-gray-800 space-y-1 text-sm">
                                    {project.files.map((file, idx) => (
                                        <li key={idx}>{file.name}</li>
                                    ))}
                                </ul>

                                <Button
                                    size="sm"
                                    className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90 self-start"
                                >
                                    View Details
                                </Button>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    )
}
