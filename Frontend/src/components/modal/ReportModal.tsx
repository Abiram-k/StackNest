"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle } from "lucide-react";
import { AiIcon } from "../ui/AiIcon";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";
import { useReport } from "@/hooks/user/userProfile/useReport";
import { ReportTypeT, ReqReport } from "@/types";

const reportReasons = [
  "Inappropriate content",
  "Spam or misleading",
  "Harassment or bullying",
  "Misinformation",
  "Copyright infringement",
  "Other",
];
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

interface ReportModalPropType {
  entityId: string;
  type:ReportTypeT;
}
export default function ReportModal({ entityId, type }: ReportModalPropType) {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedReasons, setSelectedReasons] = useState<string>();
  const [customMessage, setCustomMessage] = useState("");

  const { mutate: reportMutate, isPending: reportPending } = useReport(
    type,
    entityId
  );

  const handleReasonChange = (reasonId: string, checked: boolean) => {
    if (checked) {
      setSelectedReasons(reasonId);
    } else {
      setSelectedReasons("");
    }
  };

  const handleSubmit = () => {
    const data: ReqReport = {
      reportType: type,
      reportedEntity: entityId,
      reason: selectedReasons!,
      message: customMessage,
    };

    reportMutate(data);
    setOpen(false);
    setSelectedReasons("");
    setCustomMessage("");
  };

  const generateAIContent = async (fiedType: string) => {
    try {
      if (!customMessage) {
        toast.warning("No message founded!");
        return;
      }
      if (customMessage.length >= 1000) {
        toast.info("Message is too long!");
        return;
      }
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction:
          "You job is to make the report message from the user to gramatically correct and  more formal way and structure it properly, don't make change in core idea of the message",
      });
      const result = await model.generateContent(
        `Report Message is: ${customMessage}`
      );

      const generatedText = result.response.text().trim();
      generatedText.replace(/\*\*/g, "").replace(/```/g, "");
      setCustomMessage(generatedText);
    } catch (error) {
      toast.error("Failed Ai generation, try later!");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {(isLoading || reportPending) && <Spinner />}
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          Report
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Report Content</DialogTitle>
          <DialogDescription>
            Please select the reason(s) for your report and provide additional
            details if needed.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-3">
            <p className="text-sm font-medium ">Reason for reporting : </p>
            {reportReasons.map((reason, index) => (
              <div
                key={`${reason}-${index}`}
                className="flex items-center space-x-2"
              >
                <Checkbox
                  id={reason}
                  checked={selectedReasons == reason}
                  onCheckedChange={(checked) =>
                    handleReasonChange(reason, checked as boolean)
                  }
                />
                <Label
                  htmlFor={reason}
                  className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {reason}
                </Label>
              </div>
            ))}
          </div>
          <div className="space-y-2 relative">
            <Label htmlFor="message" className="text-sm font-medium">
              Additional details :
            </Label>
            <Textarea
              id="message"
              placeholder="Please provide more information about your report..."
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              className="min-h-[100px]"
            />
            <div className="absolute top-13 right-0">
              <AiIcon
                name="customMessage"
                generateAIContent={generateAIContent}
                toolTipString="Make it proper using AI 🤖"
              />
            </div>
          </div>
        </div>
        <DialogFooter className="sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            variant={"destructive"}
            disabled={selectedReasons?.length === 0}
          >
            Submit Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
