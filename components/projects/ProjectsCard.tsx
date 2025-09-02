"use client"

import React from "react"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

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
        downloadAll: "/downloads/data-analyst-portfolio.zip",
    },
    {
        id: 2,
        title: "📈 Power BI Dashboard",
        description:
            "Interactive dashboard showcasing business KPIs and visual storytelling.",
        files: [{ name: "Dashboard.pbix" }, { name: "Report.pdf" }, { name: "Dashboard.pbix" }, { name: "Report.pdf" }, { name: "Dashboard.pbix" }, { name: "Report.pdf" }],
        downloadAll: "/downloads/powerbi-dashboard.zip",
    },
    {
        id: 3,
        title: "📈 Power BI Dashboard",
        description:
            "Interactive dashboard showcasing business KPIs and visual storytelling.",
        files: [{ name: "Dashboard.pbix" }, { name: "Report.pdf" }],
        downloadAll: "/downloads/powerbi-dashboard.zip",
    },
]

export default function ProjectsCard() {
    return (
        <div className="container mx-auto">
            <h2 className="text-4xl font-bold mb-10 text-center">🚀 Featured Work</h2>

            <div className="grid gap-8 lg:grid-cols-3 grid-cols-1">
                {projects.map((project) => (
                    <Card
                        key={project.id}
                        className="flex flex-col h-[340px] bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300 rounded-2xl"
                    >
                        {/* Header */}
                        <CardHeader className="flex-grow-0">
                            <CardTitle className="text-xl font-semibold">
                                {project.title}
                            </CardTitle>
                            <CardDescription className="text-gray-600">
                                {project.description}
                            </CardDescription>
                        </CardHeader>

                        {/* Content */}
                        <CardContent className="flex flex-col flex-grow justify-between gap-4">
                            {/* File list */}
                            <ul className="list-disc list-inside text-gray-800 space-y-1 text-sm flex-grow">
                                {project.files.map((file, idx) => (
                                    <li key={idx}>{file.name}</li>
                                ))}
                            </ul>

                            {/* Download Button */}
                            <Button
                                asChild
                                size="sm"
                                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90 self-start"
                            >
                                <a
                                    href={project.downloadAll}
                                    download
                                    className="flex items-center gap-2"
                                >
                                    <Download size={16} /> Download All Files
                                </a>
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
