"use client";
import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Github,
  Linkedin,
  Mail,
  Heart,
  ExternalLink,
  ArrowUpRight,
  Facebook,
  Phone,
  Twitter,
  Globe,
} from "lucide-react";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  const isDashboard = pathname.startsWith("/dashboard");
  const socialLinks = [

    {
      name: "LinkedIn",
      href: "https://linkedin.com/in/animesh",
      icon: Linkedin,
    },
    {
      name: "Twitter",
      href: "https://twitter.com/animesh", // change if you have a real handle
      icon: Twitter,
    },
    {
      name: "Phone",
      href: "tel:+918477081261",
      icon: Phone,
    },
    {
      name: "Email",
      href: "mailto:hello@animesh.dev",
      icon: Mail,
    },
  ];

  const quickLinks = [
    { name: "Pricing", href: "/pricing" },
    { name: "Projects", href: "/projects" },
    // { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      {isDashboard ? (
        <></>
      ) : (
        <footer className="relative mb-4 mx-auto px-4">
          <div className="w-full mx-auto">
            <div
              className={cn(
                "relative px-6 py-8 sm:px-8 sm:py-10 rounded-3xl",
                // Glass morphism base
                "bg-gradient-to-r from-white/20 via-white/10 to-white/20",
                "dark:from-black/20 dark:via-black/10 dark:to-black/20",
                // Borders and rings
                "border border-black/20 dark:border-white/20",
                "ring-1 ring-inset ring-white/20 dark:ring-white/10",
                // Backdrop effects
                "backdrop-blur-2xl backdrop-saturate-200",
                // Shadows
                "shadow-2xl shadow-black/10 dark:shadow-black/30",
                "drop-shadow-lg",
                // Hover effects
                "hover:bg-white/25 dark:hover:bg-black/25",
                "hover:border-white/40 dark:hover:border-white/30",
                "hover:ring-2 hover:ring-white/30 dark:hover:ring-white/20",
                "transition-all duration-500 ease-out",
                // Subtle inner glow
                "before:absolute before:inset-0 before:rounded-3xl",
                "before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent",
                "before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500",
                "before:pointer-events-none"
              )}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Brand Section */}
                <div className="lg:col-span-2">
                  <div className="flex items-center space-x-3 mb-4">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-2xl",
                        "bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700",
                        "shadow-lg shadow-blue-500/30 dark:shadow-blue-500/20",
                        "flex items-center justify-center",
                        "ring-2 ring-white/20 dark:ring-white/10",
                        "hover:scale-105 transition-transform duration-200"
                      )}
                    >
                      <span className="text-white text-lg font-bold drop-shadow-sm">
                        A
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-foreground">
                      Animesh
                    </h3>
                  </div>
                  <p className=" text-sm leading-relaxed mb-6">
                    A passionate data enthusiast and skilled Excel developer,
                    dedicated to transforming raw data into meaningful insights
                    with precision and creativity.
                  </p>

                  {/* Status Badge */}
                  <div
                    className={cn(
                      "inline-flex items-center space-x-2 px-4 py-2 rounded-full",
                      "bg-gradient-to-r from-green-500/20 to-emerald-500/20",
                      "border border-green-500/30 dark:border-green-400/20",
                      "ring-1 ring-green-500/20 dark:ring-green-400/10"
                    )}
                  >
                    <div className="relative w-2 h-2 rounded-full bg-green-500">
                      <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75" />
                    </div>
                    <span className="text-xs font-medium text-green-600 ">
                      Available for Classes
                    </span>
                  </div>
                </div>

                {/* Quick Links */}
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-4">
                    Quick Links
                  </h4>
                  <nav className="space-y-2">
                    {quickLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                          "flex items-center group text-sm text-muted-foreground",
                          "hover:text-foreground transition-colors duration-200"
                        )}
                      >
                        <span className="group-hover:translate-x-1 transition-transform duration-200">
                          {link.name}
                        </span>
                        <ArrowUpRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-all duration-200" />
                      </Link>
                    ))}
                  </nav>
                </div>

                {/* Social Links */}
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-4">
                    Connect
                  </h4>
                  <div className="flex flex-col gap-4">
                    {socialLinks.map((social) => {
                      const Icon = social.icon;
                      return (
                        <Button
                          key={social.name}
                          variant="ghost"
                          size="sm"
                          asChild
                          className={cn(
                            "justify-start h-auto p-2 rounded-xl",
                            "bg-white/10 dark:bg-white/5",
                            "hover:bg-white/20 dark:hover:bg-white/10",
                            "border border-white/20 dark:border-white/10",
                            "hover:border-white/40 dark:hover:border-white/20",
                            "transition-all duration-200"
                          )}
                        >
                          <Link
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Icon className="w-4 h-4 mr-2" />
                            <span className="text-sm">{social.name}</span>
                            <ExternalLink className="w-3 h-3 ml-auto opacity-60" />
                          </Link>
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Bottom Section */}
              <div className="mt-8 pt-6 border-t border-white/20 dark:border-white/10">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <p className="text-sm text-muted-foreground text-center sm:text-left">
                    © 2024 Animesh. All rights reserved.
                  </p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <span>Made with</span>
                    <Heart className="w-4 h-4 mx-1 text-red-500 fill-red-500 animate-pulse" />
                    <span>in India</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Background decorative elements */}
          <div className="absolute inset-0 -z-10 [mask-image:radial-gradient(white,transparent_80%)] pointer-events-none">
            <div className="absolute left-10 bottom-10">
              <div className="h-20 w-20 rounded-full bg-blue-400 opacity-10 blur-xl animate-pulse" />
            </div>
            <div className="absolute right-20 top-5">
              <div className="h-16 w-16 rounded-full bg-purple-400 opacity-15 blur-lg animate-pulse" />
            </div>
          </div>
        </footer>
      )}
    </>
  );
}
