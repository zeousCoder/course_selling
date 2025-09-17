"use client";

import { useSession, signIn, signOut } from "@/lib/auth-client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";

export default function LoginSys() {
    const { data: session } = useSession();
    const dashboard = session?.user.role === "ADMIN";
    const [isPending, setIsPending] = useState(false);

    // Handle Google Login
    async function handleGoogleLogin() {
        if (isPending) return;
        setIsPending(true);

        try {
            await signIn.social({
                provider: "google",
                callbackURL: "/",
                errorCallbackURL: "/error",
            });
        } catch (err) {
            console.error("Google login failed:", err);
            setIsPending(false);
        }
    }

    return (
        <div className="flex flex-col gap-3 items-center">
            {!session ? (
                <Button
                    onClick={handleGoogleLogin}
                    disabled={isPending}
                    className="w-full "
                >
                    Login
                </Button>
            ) : !dashboard ? (
                <Avatar>
                    <AvatarImage src={session.user.image || ""} alt="user" />
                    <AvatarFallback>
                        {session.user.name
                            .split(" ")
                            .map((namePart) => namePart.charAt(0))
                            .join("")}
                    </AvatarFallback>
                </Avatar>
            ) : (
                <Link href={"/dashboard"}>
                    <Avatar>
                        <AvatarImage src={session.user.image || ""} alt="user" />
                        <AvatarFallback>
                            {session.user.name
                                .split(" ")
                                .map((namePart) => namePart.charAt(0))
                                .join("")}
                        </AvatarFallback>
                    </Avatar>
                </Link>
            )}
        </div>
    );
}
