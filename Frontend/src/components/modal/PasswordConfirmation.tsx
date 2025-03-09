"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PasswordConfirmationProps {
  onCancel: () => void;
  onProceed: (password: string) => void;
}

export default function PasswordConfirmation({
  onCancel,
  onProceed,
}: PasswordConfirmationProps) {
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onProceed(password);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-md bg-[#1a1a1a] rounded-2xl p-6 shadow-xl">
        <h2 className="text-white text-xl font-medium mb-2">
          Enter Password To Join
        </h2>

        <p className="text-gray-400 text-sm mb-6">
          This is room is protected by password, enter password to continue, and
          enjoy the conversation
        </p>

        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-transparent border-gray-600 text-white mb-6 rounded-full h-12 px-4"
          />

          <div className="flex gap-4">
            <Button
              type="button"
              onClick={onCancel}
              className="flex-1 h-12 rounded-full bg-transparent border border-transparent relative dark:text-white"
              style={{
                backgroundImage:
                  "linear-gradient(#1a1a1a, #1a1a1a), linear-gradient(to right, #ff3366, #9933ff)",
                backgroundOrigin: "border-box",
                backgroundClip: "padding-box, border-box",
              }}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              className="flex-1 h-12 rounded-full bg-priamry-500 hover:bg-primary-500/90 dark:hover:bg-primary-500/90 dark:bg-primary-600 dark:text-gray-300 text-white border-0"
            >
              Proceed
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
