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

const StartupForm = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pitch, setPitch] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const formData = new FormData(event.currentTarget);

    const formValues = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      category: formData.get("category") as string,
      link: formData.get("link") as string,
      pitch,
    };

    try {
      await formSchema.parseAsync(formValues);

      const result = await createPitch(formData, pitch);

      if (result?.status === "SUCCESS") {
        router.push(`/startup/${result._id}`);
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
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderError = (field: keyof typeof errors) =>
    errors[field] && <p className="startup-form_error">{errors[field]}</p>;

  return (
    <form onSubmit={handleSubmit} className="startup-form">
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
        <label htmlFor="link" className="startup-form_label">Image URL</label>
        <Input
          id="link"
          name="link"
          placeholder="Image URL"
          required
          className="startup-form_input"
        />
        {renderError("link")}
      </div>

      <div data-color-mode="light">
        <label htmlFor="pitch" className="startup-form_label">Pitch</label>
        <MDEditor
          value={pitch}
          onChange={(value) => setPitch(value || "")}
          preview="edit"
          height={300}
          id="pitch"
          style={{ borderRadius: 20, overflow: "hidden" }}
          textareaProps={{
            placeholder: "Briefly describe your idea and the problem it solves",
          }}
          previewOptions={{ disallowedElements: ["style"] }}
        />
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
