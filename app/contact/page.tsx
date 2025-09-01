import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Mail, Github, Linkedin, MapPin, Phone } from "lucide-react";
import React from "react";
import { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
    title: "Contact Me",
    description:
        "Get in touch with Animesh. Send a message, find my social links, or see my location.",
};

// Define a type for our contact details for better type-safety
type ContactDetail = {
    label: string;
    value: string;
    href: string;
    icon: React.ElementType;
};

const contactDetails: ContactDetail[] = [
    {
        label: "Email",
        value: "hello@animesh.dev",
        href: "mailto:hello@animesh.dev",
        icon: Mail,
    },
    {
        label: "GitHub",
        value: "github.com/animesh",
        href: "https://github.com/animesh",
        icon: Github,
    },
    {
        label: "LinkedIn",
        value: "linkedin.com/in/animesh",
        href: "https://linkedin.com/in/animesh",
        icon: Linkedin,
    },
    {
        label: "Phone",
        value: "+91-9876543210",
        href: "tel:+919876543210",
        icon: Phone,
    },
    {
        label: "Address",
        value: "Bengaluru, India", // Simplified for display
        href: "https://www.google.com/maps/search/?api=1&query=Bengaluru+India", // Google Maps search link
        icon: MapPin,
    },
];

// Consistent card class for styling
const cardClassName =
    "rounded-3xl shadow-2xl border border-white/20 dark:border-white/10 bg-blue-cyan backdrop-blur-md";

export default function ContactPage() {
    const mapAddress = "Bengaluru, India"; // The address to show on the map

    return (
        <div className="h-full w-full  pt-30 pb-16 flex items-center justify-center px-4 ">
            {/* Grid layout for the three cards */}
            <div className="w-full flex flex-col gap-4">
                <div className="w-full grid lg:grid-cols-2 grid-cols-1 gap-4">
                    {/* Card 1: Contact Information */}
                    <Card className={`${cardClassName} lg:col-span-1`}>
                        <CardHeader>
                            <CardTitle className="text-xl font-semibold">Get in Touch</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground mb-8">
                                I'm always open to discussing new projects, creative ideas, or
                                opportunities to be part of your vision.
                            </p>
                            <div className="flex flex-col gap-6">
                                {contactDetails.map((contact) => (
                                    <Link
                                        key={contact.label}
                                        href={contact.href}
                                        target={
                                            contact.href.startsWith("http") ? "_blank" : undefined
                                        }
                                        rel="noopener noreferrer"
                                        className="flex items-center group"
                                    >
                                        <div className="flex-shrink-0 rounded-lg bg-primary/10 p-3 group-hover:bg-primary/20 transition-colors">
                                            <contact.icon className="h-6 w-6 text-primary" />
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-sm font-semibold text-primary">
                                                {contact.label}
                                            </p>
                                            <p className="text-base text-foreground group-hover:underline">
                                                {contact.value}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Card 2: Contact Form */}
                    <Card className={`${cardClassName} lg:col-span-1`}>
                        <CardHeader>
                            <CardTitle className="text-xl font-semibold">
                                Send Me a Message
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ContactForm />
                        </CardContent>
                    </Card>
                </div>

                {/* Card 3: Map */}
                {/* <Card className={`${cardClassName} w-full flex flex-col`}>
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Find Me Here</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-0 rounded-b-3xl overflow-hidden">
            <iframe
              title="Location Map"
              src={`https://www.google.com/maps?q=${encodeURIComponent(
                mapAddress
              )}&output=embed`}
              width="100%"
              height="100%"
              className="border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </CardContent>
        </Card> */}
            </div>
        </div>
    );
}
