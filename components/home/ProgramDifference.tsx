import React from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Building2, Hammer, UserRoundCheck, ClipboardList } from "lucide-react"

const features = [
  {
    icon: Building2,
    title: "Real Corporate Case Studies",
    description: "Banking, MIS, and Finance scenarios",
  },
  {
    icon: Hammer,
    title: "Hands-on Projects",
    description: "Practical automation projects you can apply immediately",
  },
  {
    icon: UserRoundCheck,
    title: "1-on-1 Mentorship",
    description: "Personal guidance and job support",
  },
  {
    icon: ClipboardList,
    title: "Templates & Tools",
    description: "Boost productivity with ready-to-use resources",
  },
]

export default function ProgramDifference() {
  return (
    <Card
      className="
        container mx-auto border-0 shadow-2xl rounded-2xl overflow-hidden
         bg-gradient-to-br from-[#1e3c72] via-[#2a5298] to-[#000000] 
        p-12
      "
    >
      <CardHeader className="text-center space-y-3">
        <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-white">
          What Makes This Program <span className="text-yellow-400">Different?</span>
        </h2>
        <p className="text-gray-300 text-base max-w-xl mx-auto">
          Most courses only teach formulas. <br /> This program gives you real-world skills and tools.
        </p>
      </CardHeader>

      <CardContent>
        <div className="mt-8 grid gap-8 lg:grid-cols-2  mx-auto text-left">
          {features.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <div
                key={idx}
                className="flex items-start gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
              >
                <div className="flex-shrink-0 rounded-lg bg-yellow-400/20 p-3">
                  <Icon className="h-6 w-6 text-yellow-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                  <p className="text-gray-300 text-sm">{feature.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
