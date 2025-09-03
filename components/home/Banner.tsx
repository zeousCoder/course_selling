import React from 'react'
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card'
import { Rocket, ArrowRight } from 'lucide-react'
import { NumberTicker } from '../magicui/number-ticker'

export default function Banner() {
  return (
    <section
      className="
      container rounded-xl mx-auto text-center border-0 shadow-2xl  overflow-hidden
        bg-gradient-to-br from-[#1e3c72] via-[#2a5298] to-[#000000] 
        py-20
      "
    >
      <CardHeader>
        {/* Engaging Icon */}
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-white/10 rounded-full shadow-md ">
            <Rocket className="h-10 w-10 text-yellow-400 motion-preset-pulse-sm " />

          </div>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
          Automate <NumberTicker
            value={70}
            className="text-6xl font-bold tracking-tighter text-yellow-500 "
          /> % of Your Reporting Work with Excel & VBA
        </h1>
      </CardHeader>

      <CardContent>
        {/* Supporting Text */}
        <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-gray-200 leading-relaxed">
          Stop wasting hours on manual reports. In just 8 weeks, master advanced Excel + VBA automation, build dashboards, and become the "go-to" automation expert in your office.
        </p>
      </CardContent>

      <CardFooter className="flex justify-center mt-8">
        {/* Call-to-Action Button */}

        <div className="flex items-center justify-center ">
          <div className="relative group">
            <button
              className="relative inline-block p-px font-semibold leading-6 text-white bg-gray-800 shadow-2xl cursor-pointer rounded-xl shadow-zinc-900 transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95"
            >
              <span
                className="absolute inset-0 rounded-xl bg-gradient-to-r from-teal-400 via-blue-500 to-purple-500 p-[2px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              ></span>

              <span className="relative z-10 block px-6 py-3 rounded-xl bg-gray-950">
                <div className="relative z-10 flex items-center space-x-2">
                  <span className="transition-all duration-500 group-hover:translate-x-1"
                  >Enroll Now
                  </span
                  >
                  <svg
                    className="w-6 h-6 transition-transform duration-500 group-hover:translate-x-1"
                    data-slot="icon"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      clipRule="evenodd"
                      d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                      fillRule="evenodd"
                    />
                  </svg>

                </div>
              </span>
            </button>
          </div>
        </div>

      </CardFooter>
    </section>
  )
}
