"use client";

import type React from "react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface TextAreaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (text: string) => void | Promise<void>;
  title?: string;
  description?: string;
  placeholder?: string;
  initialValue?: string;
  submitButtonText?: string;
  cancelButtonText?: string;
  maxLength?: number;
  textAreaLabel?: string;
  isSubmitting?: boolean;
  submitButtonVariant:
    | "default"
    | "destructive"
    | "ghost"
    | "link"
    | "outline"
    | "secondary";
}

export function TextAreaModal({
  isOpen,
  onClose,
  onSubmit,
  title = "Enter your text",
  description,
  placeholder = "Type your message here...",
  initialValue = "",
  submitButtonText = "Submit",
  submitButtonVariant,
  cancelButtonText = "Cancel",
  maxLength,
  textAreaLabel = "Message",
  isSubmitting = false,
}: TextAreaModalProps) {
  const [text, setText] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!text.trim()) {
      setError("Please enter some text");
      return;
    }

    if (maxLength && text.length > maxLength) {
      setError(`Text must be less than ${maxLength} characters`);
      return;
    }

    setError(null);

    try {
      onSubmit(text);
      setText(initialValue);
    } catch (err) {
      console.error("Error submitting form:", err);
      setError("An error occurred while submitting");
    }
  };

  const handleClose = () => {
    setText(initialValue);
    setError(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="message" className="text-left">
                {textAreaLabel}
              </Label>
              <Textarea
                id="message"
                placeholder={placeholder}
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="min-h-[100px]"
                maxLength={maxLength}
              />
              {maxLength && (
                <div className="text-xs text-muted-foreground text-right">
                  {text.length}/{maxLength}
                </div>
              )}
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
          </div>

          <DialogFooter className="sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              {cancelButtonText}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              variant={submitButtonVariant}
            >
              {isSubmitting ? "Submitting..." : submitButtonText}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
