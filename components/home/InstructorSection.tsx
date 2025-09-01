import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Meteors } from "@/components/magicui/meteors"
import { Laptop, Award, Briefcase } from "lucide-react"
import { Highlighter } from "@/components/magicui/highlighter"

export default function InstructorSection() {
    return (
        <Card
            className="
        relative container mx-auto border-0 shadow-2xl lg:rounded-2xl rounded-none overflow-hidden
        bg-gradient-to-br from-[#1e3c72] via-[#2a5298] to-[#000000]
        py-20
      "
        >
            {/* Meteor background */}
            <Meteors number={20} />

            <CardHeader className="relative z-10 text-center">
                <CardTitle className="text-4xl font-bold text-white">
                    About the Instructor
                </CardTitle>
            </CardHeader>

            <CardContent className="relative z-10 flex flex-col md:flex-row items-center gap-10 mx-auto">
                {/* Avatar / Placeholder */}
                <div className="flex-shrink-0">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-4xl font-bold text-black shadow-lg">
                        A
                    </div>
                </div>

                {/* Bio + Highlights */}
                <div className="text-center md:text-left ">
                    <h3 className="text-2xl font-semibold text-white">
                        Hi, I'm Animesh Singh Verma
                    </h3>
                    <p className="mt-3 text-gray-300 leading-relaxed">
                        With 5 years of corporate experience in{" "}
                        <Highlighter action="underline" color="#FF9800">
                            Advanced Excel
                        </Highlighter>{" "}
                        and 1 year in{" "}
                        <Highlighter action="highlight" color="black" >
                            VBA automation
                        </Highlighter>
                        , I've solved complex reporting challenges in banking & MIS environments.
                        <br /><br />
                        Now, I help professionals like you{" "}
                        <Highlighter action="highlight" color="black">
                            save time
                        </Highlighter>
                        ,{" "}
                        <Highlighter action="highlight" color="black">
                            reduce stress
                        </Highlighter>{" "}
                        and{" "}
                        <Highlighter action="underline" color="#FF6B6B">
                            grow careers with automation
                        </Highlighter>
                        .
                    </p>

                    <div className="mt-6 grid gap-4 md:grid-cols-3">
                        <div className="flex items-center gap-3 bg-white/5 rounded-lg px-4 py-3 border border-white/10">
                            <Laptop className="h-6 w-6 text-green-400" />
                            <span className="text-gray-200 text-sm">5+ Years Excel Expert</span>
                        </div>
                        <div className="flex items-center gap-3 bg-white/5 rounded-lg px-4 py-3 border border-white/10">
                            <Award className="h-6 w-6 text-yellow-400" />
                            <span className="text-gray-200 text-sm">VBA Automation Specialist</span>
                        </div>
                        <div className="flex items-center gap-3 bg-white/5 rounded-lg px-4 py-3 border border-white/10">
                            <Briefcase className="h-6 w-6 text-blue-400" />
                            <span className="text-gray-200 text-sm">Corporate Trainer</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
