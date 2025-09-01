"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  addContactForm,
  getContactFormData,
  deleteContactFormData,
} from "@/actions/contactAction";

const ContactFormSchema = z.object({
  name: z.string().min(2, "Name is required").max(50, "Name is too long"),
  email: z.string().email("Please enter a valid email"),
  number: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number is too long")
    .regex(/^[+]?[\d\s\-\(\)]+$/, "Please enter a valid phone number"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(500, "Message is too long"),
});

export type ContactFormValues = z.infer<typeof ContactFormSchema>;

export const useContactForm = () => {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(ContactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      number: "",
      message: "",
    },
  });

  const onSubmit = async (values: ContactFormValues) => {
    setStatus("loading");
    const loadingToastId = toast.loading("Sending message...", {
      description: "Please wait while we send your message.",
    });

    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("number", values.number);
      formData.append("message", values.message);

      const result = await addContactForm(formData);

      toast.dismiss(loadingToastId);

      if (result?.errors) {
        setStatus("error");
        toast.error("Validation failed", {
          description: "Please check the form and try again.",
        });
      } else {
        setStatus("success");
        form.reset();
        toast.success("Message sent successfully! ✨", {
          description: `Thanks ${values.name}! I'll get back to you soon.`,
        });

        fetchSubmissions();
      }
    } catch (error) {
      console.error(error);
      setStatus("error");
      toast.dismiss(loadingToastId);
      toast.error("Failed to send message", {
        description: "Something went wrong. Please try again later.",
      });
    } finally {
      setTimeout(() => setStatus("idle"), 1000);
    }
  };

  //  Fetch submissions
  const fetchSubmissions = async () => {
    setLoadingData(true);
    try {
      const data = await getContactFormData();
      setSubmissions(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load submissions");
    } finally {
      setLoadingData(false);
    }
  };

  //  Delete submission
  const deleteSubmission = async (id: string) => {
    try {
      const result = await deleteContactFormData(id);
      toast.success(result.message);
      fetchSubmissions();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete submission");
    }
  };

  return {
    form,
    onSubmit,
    status,
    submissions,
    loadingData,
    fetchSubmissions,
    deleteSubmission,
  };
};
