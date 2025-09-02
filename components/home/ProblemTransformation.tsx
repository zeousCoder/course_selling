import React from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { XCircle, CheckCircle2 } from "lucide-react"

const problems = [
  "Spending 3–4 hours daily on repetitive Excel tasks",
  "Manually combining 50+ files every week",
  "Struggling to create dashboards managers can understand",
  "Stuck in career because only 'basic Excel' is known",
]

const transformations = [
  "Automate your reports & save 10+ hours per week",
  "Build dashboards that impress management",
  "Gain recognition as the automation expert in your team",
  "Open doors to Data Analyst career opportunities",
]

export default function ProblemTransformation() {
  return (
    <Card
      className="
        container mx-auto border-0 shadow-2xl rounded-2xl  overflow-hidden
        bg-gradient-to-b from-[#0f2027] to-[#203a43]
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
              <XCircle className="h-6 w-6 text-red-400" /> The Problem
            </h3>
            <ul className="space-y-5 text-gray-200 text-lg">
              {problems.map((problem, idx) => (
                <li
                  key={idx}
                  className="flex gap-3 items-start p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <XCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-1" />
                  <p>{problem}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* The Transformation */}
          <div className="text-left">
            <h3 className="text-2xl font-semibold text-green-400 mb-6 flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-green-400" /> The Transformation
            </h3>
            <ul className="space-y-5 text-gray-200 text-lg">
              {transformations.map((point, idx) => (
                <li
                  key={idx}
                  className="flex gap-3 items-start p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-1" />
                  <p>{point}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
