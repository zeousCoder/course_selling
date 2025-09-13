import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Meteors } from "@/components/magicui/meteors";
import { BarChart3, Building2, Users, DollarSign, Target } from "lucide-react";

export default function ProjectsSection() {
  const projects = [
    {
      icon: <BarChart3 className="h-8 w-8 text-yellow-400" />,
      title: "Learn In-Demand Excel Mastery",
      desc: `“Skills are the foundation of your future success.”
Master advanced Excel techniques – from powerful formulas, pivot tables, dynamic
dashboards, to automation with VBA. These are the industry-relevant skills that help you
solve complex problems efficiently and stand out in any professional setting.
Build expertise that empowers you to take control of your work and deliver outstanding
results.`,
    },
    {
      icon: <Building2 className="h-8 w-8 text-blue-400" />,
      title: "Follow a Structured Career Roadmap",
      desc: `“Without a map, even the brightest skills can get lost.”
A well-defined learning path takes you from beginner to advanced professional. Each lesson,
each hands-on project builds on the last — ensuring continuous growth and clarity in your
development journey.
 Clear milestones help you track progress and stay motivated every step of the way.`,
    },
    {
      icon: <Users className="h-8 w-8 text-green-400" />,
      title: "Apply Skills to Real-World Projects",
      desc: `“Theory becomes power only when applied.”
Create impactful solutions like automated reporting systems, interactive dashboards, and
dynamic data analysis tools. These projects reflect real workplace challenges and help you
develop problem-solving confidence.
Transform your knowledge into practical capabilities that boost your productivity and
professional value.`,
    },
    // {
    //   icon: <DollarSign className="h-8 w-8 text-purple-400" />,
    //   title: "Finance MIS Tool",
    //   desc: "Comprehensive finance tool with VBA automation features",
    // },
    // {
    //   icon: <Target className="h-8 w-8 text-red-400" />,
    //   title: "Capstone Project",
    //   desc: "One-Click Business Dashboard - Your masterpiece project",
    //   highlight: true,
    // },
  ];

  return (
    <Card
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
          3 Pillars of Professional Success with Excel
        </CardTitle>
        <p className="mt-3 text-gray-300  mx-auto text-lg">
          Apply your learning with real-world, hands-on projects.
        </p>
      </CardHeader>

      <section className="relative w-full z-10 mt-10">
        <div className="grid gap-8 grid-cols-1 lg:grid-cols-3 w-full mx-auto">
          {projects.map((proj, i) => (
            <div
              key={i}
              className={`
                p-6 w-full rounded-xl border shadow-lg transition-transform
                bg-white/5 backdrop-blur-sm hover:scale-105
                
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
      </section>
    </Card>
  );
}
