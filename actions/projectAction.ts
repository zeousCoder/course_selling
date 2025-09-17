"use server";

import cloudinary from "@/lib/cloudinary";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function postProject(data: FormData) {
  try {
    const title = data.get("title") as string;
    const description = data.get("description") as string;
    const viewDetails = data.get("viewDetails") as string;
    // Get the single file from the form. We'll name it "downloadFile" on the form.
    const downloadFile = data.get("downloadFile") as File;
    const filesNameString = data.get("filesName") as string;

    // 1. Input Validation
    if (
      !title ||
      !description ||
      !downloadFile ||
      filesNameString.length === 0
    ) {
      return {
        success: false,
        message: "Please provide all required fields and a file.",
      };
    }

    // 2. Upload the file to Cloudinary
    const arrayBuffer = await downloadFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { resource_type: "raw", folder: "portfolio-projects" },
          (error, result) => {
            if (error) {
              console.error("Cloudinary upload error:", error);
              return reject(error);
            }
            resolve(result);
          }
        )
        .end(buffer);
    });

    const downloadLink = result.secure_url;

    // 3. Prepare the filesName array from the string input
    const filesName = filesNameString.split(",").map((name) => name.trim());

    // 4. Store project details in the database using Prisma
    await prisma.project.create({
      data: {
        title,
        description,
        downloadLink, // The URL from Cloudinary
        viewDetails,
        filesName, // The array of names from the form
      },
    });

    revalidatePath("/projects");

    return { success: true, message: "Project created successfully!" };
  } catch (error) {
    console.error("Server Action Error:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
}

export async function getProjects() {
  try {
    // Fetch all projects from the database
    const projects = await prisma.project.findMany({
      orderBy: {
        createdAt: "desc", // Sorts projects by the newest first
      },
    });

    return { success: true, data: projects };
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return { success: false, data: [], message: "Failed to load projects." };
  }
}

export async function deleteProjects(id: string) {
  try {
    if (!id) {
      return { success: false, message: "Project ID is required." };
    }
    await prisma.project.delete({
      where: {
        id: id,
      },
    });

    revalidatePath("/projects");
    return { success: true, message: "Project deleted successfully!" };
  } catch (error) {
    console.error("Server Action Error:", error);
  }
}
