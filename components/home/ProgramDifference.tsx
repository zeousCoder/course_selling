import React from "react"
import { Card, CardContent, CardHeader } from "../ui/card"

export default function ProgramDifference() {
  return (
    <Card
      className="
        container mx-auto border-0 shadow-2xl rounded-2xl overflow-hidden
        bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364]
        p-12 
      "
    >
      <CardHeader className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
          What Makes This Program <span className="text-yellow-400">Different?</span>
        </h2>
        <p className="mt-3 text-gray-300 max-w-2xl mx-auto text-lg">
          Most courses only teach formulas. <br /> This program gives you real-world skills and tools.
        </p>
      </CardHeader>

      <CardContent>
        <div className="mt-8 grid gap-8 md:grid-cols-2 max-w-4xl mx-auto text-left">
          <div className="flex items-start gap-4">
            <span className="text-3xl">🏢</span>
            <div>
              <h3 className="text-xl font-semibold text-white">Real Corporate Case Studies</h3>
              <p className="text-gray-300">Banking, MIS, and Finance scenarios</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <span className="text-3xl">🛠️</span>
            <div>
              <h3 className="text-xl font-semibold text-white">Hands-on Projects</h3>
              <p className="text-gray-300">Practical automation projects you can apply immediately</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <span className="text-3xl">👨‍🏫</span>
            <div>
              <h3 className="text-xl font-semibold text-white">1-on-1 Mentorship</h3>
              <p className="text-gray-300">Personal guidance and job support</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <span className="text-3xl">📋</span>
            <div>
              <h3 className="text-xl font-semibold text-white">Templates & Tools</h3>
              <p className="text-gray-300">Boost productivity with ready-to-use resources</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
