"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import MDEditor from "@uiw/react-md-editor";
import { formSchema } from "@/lib/validation";
import { z } from "zod";
import { createPitch } from "@/lib/actions";
import FileUpload from "./ui/file-upload";

const StartupForm = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pitch, setPitch] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>("");
  const router = useRouter();

  const handleUploadImage = async (file: File) => {
    try {
      setErrors({});
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setImageUrl(data.url);
        console.log("Image uploaded successfully:", data.url);
      } else {
        console.error("Upload failed:", data.error);
        setErrors({ image: data.error || "Failed to upload image" });
      }
    } catch (error) {
      console.error("Upload error:", error);
      setErrors({ image: "Failed to upload image" });
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      const formData = new FormData(event.currentTarget);

      const formValues = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        category: formData.get("category") as string,
        link: imageUrl,
        pitch,
      };

      if (!imageUrl) {
        setErrors({ image: "Please upload an image" });
        return;
      }

      await formSchema.parseAsync(formValues);

      const submissionData = new FormData();
      submissionData.append("title", formValues.title);
      submissionData.append("description", formValues.description);
      submissionData.append("category", formValues.category);
      submissionData.append("link", imageUrl);

      const result = await createPitch(submissionData, pitch);

      if (result?.status === "SUCCESS") {
        router.push(`/startup/${result._id}`);
      } else {
        setErrors({ form: result?.error || "Failed to create startup" });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.flatten().fieldErrors;
        const formattedErrors: Record<string, string> = {};

        Object.entries(fieldErrors).forEach(([key, value]) => {
          if (value && value.length > 0) {
            formattedErrors[key] = value[0];
          }
        });

        setErrors(formattedErrors);
      } else {
        console.error("Unexpected error:", error);
        setErrors({ form: "An unexpected error occurred. Please try again." });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderError = (field: keyof typeof errors) =>
    errors[field] && <p className="startup-form_error">{errors[field]}</p>;

  return (
    <form onSubmit={handleSubmit} className="startup-form">
      {errors.form && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {errors.form}
        </div>
      )}

      <div>
        <label htmlFor="title" className="startup-form_label">Title</label>
        <Input
          id="title"
          name="title"
          placeholder="Startup Title"
          required
          className="startup-form_input"
        />
        {renderError("title")}
      </div>

      <div>
        <label htmlFor="description" className="startup-form_label">Description</label>
        <Textarea
          id="description"
          name="description"
          placeholder="Startup Description"
          required
          className="startup-form_textarea"
        />
        {renderError("description")}
      </div>

      <div>
        <label htmlFor="category" className="startup-form_label">Category</label>
        <Input
          id="category"
          name="category"
          placeholder="e.g. Tech, Health, Education"
          required
          className="startup-form_input"
        />
        {renderError("category")}
      </div>

      <div>
        <label htmlFor="link" className="startup-form_label">Image Upload</label>
        <FileUpload
          onUploadSuccess={handleUploadImage}
          onUploadError={(error) => setErrors({ image: error })}
        />
        {renderError("image")}
      </div>


      <div data-color-mode="light">
        <label htmlFor="pitch" className="startup-form_label">Pitch</label>
        <div className="w-full overflow-hidden">
          <MDEditor
            value={pitch}
            onChange={(value) => setPitch(value || "")}
            preview="edit"
            height={300}
            id="pitch"
            style={{
              borderRadius: 20,
              overflow: "hidden",
              width: "100%",
              maxWidth: "100%"
            }}
            textareaProps={{
              placeholder: "Briefly describe your idea and the problem it solves",
              style: { fontSize: "16px" }
            }}
            previewOptions={{ disallowedElements: ["style"] }}
          />
        </div>
        {renderError("pitch")}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="startup-form_btn text-white"
      >
        {isSubmitting ? "Submitting..." : "Submit Your Pitch"}
        <Send className="size-6 ml-2" />
      </Button>
    </form>
  );
};

export default StartupForm;
