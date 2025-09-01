"use client";

import {
    Form,
    FormField,
    FormLabel,
    FormControl,
    FormDescription,
    FormMessage,
    FormItem,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { useContactForm } from "@/hooks/useContactForm";

export function ContactForm() {
    const { form, onSubmit, status } = useContactForm();

    return (
        <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Your Name <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter your full name"
                                    {...field}  className="border-2 border-black"
                                    disabled={status === "loading"}
                                    required
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Email Address <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type="email"
                                    placeholder="your@email.com"
                                    {...field} className="border-2 border-black"
                                    disabled={status === "loading"}
                                    required
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="number"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Phone Number <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type="tel"
                                    placeholder="+91 9876543210"
                                    {...field}  className="border-2 border-black"
                                    disabled={status === "loading"}
                                    required
                                />
                            </FormControl>
                            <FormDescription>
                                Include country code for international numbers
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Your Message <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Tell me about your project or just say hello..."
                                    rows={5}
                                    {...field}  className="border-2 border-black"
                                    disabled={status === "loading"}
                                    required
                                />
                            </FormControl>
                            <FormDescription>
                                Please provide details about your inquiry (minimum 10
                                characters)
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button
                    type="submit"
                    className="w-full"
                    disabled={status === "loading"}
                    variant={"outline"}
                >
                    {status === "loading" ? "Sending..." : "Send Message"}
                </Button>
            </form>
        </Form>
    );
}
