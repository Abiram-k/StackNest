import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
interface OtpModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onVerifyOtp: (otp: string) => void;
  isPending: boolean;
}

const OtpModal = ({
  isOpen,
  onOpenChange,
  onVerifyOtp,
  isPending,
}: OtpModalProps) => {
  const [otp, setOtp] = useState("");

  const handleVerifyOtp = () => {
    onVerifyOtp(otp); // Pass the OTP to the parent component
    setOtp(""); // Clear the OTP input
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {/* <Button onClick={() => setIsOpen(true)}>Open OTP Modal</Button> */}

      <DialogContent className="max-w-md flex flex-col items-center justify-center text-center gap-4">
        <DialogHeader>
          <DialogTitle>Enter OTP</DialogTitle>
        </DialogHeader>

        {/* OTP Input */}
        <InputOTP
          maxLength={6}
          value={otp}
          onChange={(value) => setOtp(value)}
          className="flex justify-center gap-2"
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>

        <Button
          type="submit"
          disabled={isPending}
          className="w-full bg-primary-500 cursor-pointer dark:bg-primary-600 hover:bg-primary-600"
          onClick={handleVerifyOtp}
        >
          {isPending ? "Verifying OTP ..." : " Verify OTP"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default OtpModal;
