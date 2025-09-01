"use client"; // Add this for client-side functionality
import Link from "next/link";
import React from "react";
import { cn } from "@/lib/utils";
import {
    Sheet,
    SheetTrigger,
    SheetContent,
    SheetClose,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";
import LoginSys from "./LoginSys";

export default function Header() {
    const pathname = usePathname();

    const isDashboard = pathname.startsWith("/dashboard");

    const navLinks = [
        { name: "Pricing", href: "/pricing" },
        { name: "Contact", href: "/contact" },
    ];

    const isActiveLink = (href: string) => pathname === href;

    return (
        <>
            {isDashboard ? (
                <></>
            ) : (
                <header className="fixed top-4 inset-x-0 max-w-4xl mx-auto z-50 px-4">
                    <div
                        className={cn(
                            "relative flex items-center justify-between px-6 py-3.5 rounded-3xl group cursor-pointer",
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
                            // Enhanced Interactions with Glass Ring Effects
                            "group-hover:bg-white/30 dark:group-hover:bg-black/30",
                            "group-hover:border-white/50 dark:group-hover:border-white/40",
                            "group-hover:ring-2 group-hover:ring-white/30 dark:group-hover:ring-white/20",
                            "group-hover:shadow-3xl group-hover:shadow-black/20 dark:group-hover:shadow-black/40",
                            "group-hover:backdrop-blur-3xl",
                            "transition-all duration-500 ease-out",
                            // Subtle inner glow with enhanced hover
                            "before:absolute before:inset-0 before:rounded-3xl",
                            "before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent",
                            "before:opacity-0 group-hover:before:opacity-100 before:transition-opacity before:duration-500",
                            "before:pointer-events-none",
                            // Outer glow ring on hover
                            "after:absolute after:inset-[-2px] after:rounded-3xl after:opacity-0",
                            "after:bg-gradient-to-r after:from-white/20 after:via-transparent after:to-white/20",
                            "dark:after:from-white/10 dark:after:via-transparent dark:after:to-white/10",
                            "group-hover:after:opacity-100 after:transition-all after:duration-500",
                            "after:pointer-events-none after:-z-10",
                            "group-hover:scale-[1.02] group-hover:-translate-y-0.5"
                        )}
                    >
                        <div className="flex items-center space-x-3 relative z-10">
                            <div
                                className={cn(
                                    "relative w-9 h-9 rounded-2xl",
                                    "bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700",
                                    "shadow-lg shadow-blue-500/30 dark:shadow-blue-500/20",
                                    "flex items-center justify-center",
                                    "ring-2 ring-white/20 dark:ring-white/10",
                                    // Enhanced hover effects for avatar
                                    "group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300",
                                    "group-hover:shadow-xl group-hover:shadow-blue-500/40 dark:group-hover:shadow-blue-500/30",
                                    "group-hover:ring-4 group-hover:ring-white/30 dark:group-hover:ring-white/20"
                                )}
                            >
                                <span className="text-white text-sm font-bold drop-shadow-sm">
                                    A
                                </span>
                            </div>
                            <h1
                                className={cn(
                                    "text-xl font-bold tracking-tight",
                                    "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900",
                                    "dark:from-white dark:via-gray-100 dark:to-white",
                                    "bg-clip-text text-transparent"
                                )}
                            >
                                <Link href="/" className="">
                                    Animesh
                                </Link>
                            </h1>
                        </div>

                        {/* Desktop nav links */}
                        <nav className="hidden sm:flex items-center space-x-6 relative z-10">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        "relative px-4 py-2 rounded-xl text-sm font-medium",
                                        // Active link styles
                                        isActiveLink(link.href)
                                            ? "bg-white/40 dark:bg-white/20 text-gray-900 dark:text-white border-white/50 dark:border-white/30 ring-2 ring-white/30 dark:ring-white/20 shadow-lg shadow-black/15 dark:shadow-black/25"
                                            : "font-semibold border-transparent",
                                        // Enhanced hover effects with glass rings
                                        "hover:bg-white/30 dark:hover:bg-white/15",
                                        "hover:text-gray-900 dark:hover:text-white",
                                        "transition-all duration-300 ease-out",
                                        "border",

                                        // Subtle glow effect
                                        "before:absolute before:inset-0 before:rounded-xl before:opacity-0",
                                        "before:bg-gradient-to-r before:from-white/10 before:to-white/10",
                                        "dark:before:from-white/5 dark:before:to-white/5",
                                        "hover:before:opacity-100 before:transition-opacity before:duration-300",
                                        "before:pointer-events-none"
                                    )}
                                >
                                    {link.name}
                                    {/* Active indicator dot */}
                                    {isActiveLink(link.href) && (
                                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-blue-500 dark:bg-blue-400 rounded-full animate-pulse" />
                                    )}
                                </Link>
                            ))}
                        </nav>

                        <div className="flex items-center space-x-2 relative z-10">

                            <span className="lg:flex hidden">
                                <LoginSys />
                            </span>

                            {/* Mobile Menu Button - Enhanced Glass Design */}
                            <div className="lg:hidden flex">
                                <Sheet>
                                    <SheetTrigger asChild>
                                        <Button
                                            variant={"ghost"}
                                            size={"icon"}
                                            className={cn(
                                                "relative rounded-xl z-20",
                                                "bg-white/20 dark:bg-white/10",
                                                "border border-white/30 dark:border-white/20",
                                                "backdrop-blur-xl",
                                                // Enhanced hover effects
                                                "hover:bg-white/40 dark:hover:bg-white/20",
                                                "hover:border-white/50 dark:hover:border-white/40",
                                                "hover:ring-2 hover:ring-white/30 dark:hover:ring-white/20",
                                                "hover:shadow-lg hover:shadow-black/10 dark:hover:shadow-black/20",
                                                "hover:scale-110 hover:-translate-y-0.5",
                                                "transition-all duration-300 ease-out",
                                                // Subtle inner glow
                                                "before:absolute before:inset-0 before:rounded-xl before:opacity-0",
                                                "before:bg-gradient-to-r before:from-white/20 before:to-white/20",
                                                "dark:before:from-white/10 dark:before:to-white/10",
                                                "hover:before:opacity-100 before:transition-opacity before:duration-300",
                                                "before:pointer-events-none"
                                            )}
                                        >
                                            <Menu className="hover:rotate-90 transition-transform duration-300" />
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent
                                        side="right"
                                        className={cn(
                                            "w-80 p-0",
                                            "bg-white/90 dark:bg-black/90",
                                            "backdrop-blur-2xl backdrop-saturate-150",
                                            "border-l border-white/20 dark:border-white/10"
                                        )}
                                    >
                                        <div className="flex flex-col h-full">
                                            {/* Header */}
                                            <div className="px-6 py-6 border-b border-white/20 dark:border-white/10">
                                                <div className="flex items-center space-x-3">
                                                    <div
                                                        className={cn(
                                                            "w-8 h-8 rounded-xl",
                                                            "bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700",
                                                            "shadow-lg shadow-blue-500/25",
                                                            "flex items-center justify-center"
                                                        )}
                                                    >
                                                        <span className="text-white text-sm font-bold">
                                                            A
                                                        </span>
                                                    </div>
                                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                        Animesh
                                                    </h2>
                                                </div>
                                            </div>

                                            {/* Navigation Links */}
                                            <div className="flex-1 px-6 py-6">
                                                <nav className="space-y-2">
                                                    {navLinks.map((link) => (
                                                        <SheetClose asChild key={link.href}>
                                                            <Link
                                                                href={link.href}
                                                                className={cn(
                                                                    "relative flex items-center px-4 py-3 rounded-xl text-base font-medium",
                                                                    // Active link styles for mobile
                                                                    isActiveLink(link.href)
                                                                        ? "bg-white/60 dark:bg-white/20 text-gray-900 dark:text-white border-white/50 dark:border-white/30 ring-1 ring-white/30 dark:ring-white/20"
                                                                        : "text-gray-700 dark:text-gray-300 border-transparent",
                                                                    // Enhanced hover effects for mobile links
                                                                    "hover:bg-white/50 dark:hover:bg-white/15",
                                                                    "hover:text-gray-900 dark:hover:text-white",
                                                                    "transition-all duration-300 ease-out",
                                                                    "border",
                                                                    "hover:border-white/40 dark:hover:border-white/25",
                                                                    "hover:shadow-lg hover:shadow-black/10 dark:hover:shadow-black/15",
                                                                    "hover:ring-1 hover:ring-white/20 dark:hover:ring-white/15",
                                                                    "hover:scale-[1.02] hover:translate-x-1",
                                                                    "group",
                                                                    // Subtle glow effect
                                                                    "before:absolute before:inset-0 before:rounded-xl before:opacity-0",
                                                                    "before:bg-gradient-to-r before:from-white/20 before:to-transparent",
                                                                    "dark:before:from-white/10 dark:before:to-transparent",
                                                                    "hover:before:opacity-100 before:transition-opacity before:duration-300",
                                                                    "before:pointer-events-none"
                                                                )}
                                                            >
                                                                <span className="group-hover:translate-x-1 transition-transform duration-300">
                                                                    {link.name}
                                                                </span>
                                                                {/* Active indicator for mobile */}
                                                                {isActiveLink(link.href) && (
                                                                    <div className="ml-auto w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full animate-pulse" />
                                                                )}
                                                            </Link>
                                                        </SheetClose>
                                                    ))}
                                                </nav>
                                            </div>
                                            {/* <span className="p-4">
                        <LoginSys />
                      </span> */}

                                            {/* Footer */}
                                            <div className="px-6 py-6 border-t border-white/20 dark:border-white/10">
                                                <div className="flex items-center justify-between">

                                                    <LoginSys />
                                                    {/* <ThemeToggle /> */}
                                                </div>
                                            </div>
                                        </div>
                                    </SheetContent>
                                </Sheet>
                            </div>

                            {/* <div className="hidden lg:flex">
                <ThemeToggle />
              </div> */}
                        </div>
                    </div>
                </header>
            )}
        </>
    );
}
