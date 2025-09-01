"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const ContactFormSchema = z.object({
    name: z
        .string()
        .min(2, { message: "Name must be at least 2 characters long." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    number: z
        .string()
        .min(10, { message: "Phone number must be at least 10 digits." })
        .regex(/^\+?[0-9\s-()]*$/, {
            message: "Please enter a valid phone number.",
        }),
    message: z
        .string()
        .min(10, { message: "Message must be at least 10 characters long." })
        .max(500, { message: "Message must be 500 characters or less." }),
});

export const addContactForm = async (formData: FormData) => {
    const rawFormData = {
        name: formData.get("name"),
        email: formData.get("email"),
        number: formData.get("number"),
        message: formData.get("message"),
    };

    const validatedFields = ContactFormSchema.safeParse(rawFormData);

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Validation failed. Please check your input.",
        };
    }

    try {
        await prisma.contactForm.create({
            data: {
                name: validatedFields.data.name,
                email: validatedFields.data.email,
                number: validatedFields.data.number,
                message: validatedFields.data.message,
            },
        });

        revalidatePath("/");

        return { message: "Your message has been sent successfully!" };
    } catch (error) {
        console.error("Database Error:", error);
        return {
            message: "Database Error: Failed to send message.",
        };
    }
};

export const getContactFormData = async () => {
    try {
        const submissions = await prisma.contactForm.findMany({
            orderBy: {
                id: "desc",
            },
        });

        return submissions;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch contact form data.");
    }
};

export const deleteContactFormData = async (id: string) => {
    if (!id) {
        return { message: "Error: ID is required to delete." };
    }

    try {
        await prisma.contactForm.delete({
            where: {
                id: id,
            },
        });

        // Revalidate the path to update the list of contacts in the UI
        revalidatePath("/");
        return { message: "Deleted submission successfully." };
    } catch (error) {
        console.error("Database Error:", error);
        return {
            message: "Database Error: Failed to delete submission.",
        };
    }
};
