import React from "react"
import { Card, CardContent, CardHeader } from "../ui/card"

export default function ProblemTransformation() {
    return (
        <Card
            className="
        container
         mx-auto border-0 shadow-2xl lg:rounded-2xl rounded-none  overflow-hidden
        bg-gradient-to-br from-[#1e3c72] via-[#2a5298] to-[#000000]
        p-12 
      "
        >
            <CardHeader className="text-center">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
                    The Problem <span className="text-gray-400">&</span> The Transformation
                </h2>
            </CardHeader>

            <CardContent>
                <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
                    {/* The Problem */}
                    <div className="text-left">
                        <h3 className="text-2xl font-semibold text-red-400 mb-6 flex items-center gap-2">
                            ❌ The Problem
                        </h3>
                        <ul className="space-y-5 text-gray-200 text-lg">
                            <li className="flex gap-3">
                                <span>❌</span> <p>Spending 3–4 hours daily on repetitive Excel tasks</p>
                            </li>
                            <li className="flex gap-3">
                                <span>❌</span> <p>Manually combining 50+ files every week</p>
                            </li>
                            <li className="flex gap-3">
                                <span>❌</span> <p>Struggling to create dashboards managers can understand</p>
                            </li>
                            <li className="flex gap-3">
                                <span>❌</span> <p>Stuck in career because only "basic Excel" is known</p>
                            </li>
                        </ul>
                    </div>

                    {/* The Transformation */}
                    <div className="text-left">
                        <h3 className="text-2xl font-semibold text-green-400 mb-6 flex items-center gap-2">
                            ✅ The Transformation
                        </h3>
                        <ul className="space-y-5 text-gray-200 text-lg">
                            <li className="flex gap-3">
                                <span>✅</span> <p>Automate your reports & save 10+ hours per week</p>
                            </li>
                            <li className="flex gap-3">
                                <span>✅</span> <p>Build dashboards that impress management</p>
                            </li>
                            <li className="flex gap-3">
                                <span>✅</span> <p>Gain recognition as the automation expert in your team</p>
                            </li>
                            <li className="flex gap-3">
                                <span>✅</span> <p>Open doors to Data Analyst career opportunities</p>
                            </li>
                        </ul>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
