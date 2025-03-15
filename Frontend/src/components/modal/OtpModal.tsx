import { useEffect, useState } from "react";
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
  handleResendOtp: () => void;
  isPending: boolean;
}

const OtpModal = ({
  isOpen,
  onOpenChange,
  onVerifyOtp,
  handleResendOtp,
  isPending,
}: OtpModalProps) => {
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    setCanResend(false);
    if (timer > 0 && isOpen) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer, isOpen]);

  const handleVerifyOtp = () => {
    onVerifyOtp(otp);
    setOtp("");
  };

  const handleResend = () => {
    setTimer(60);
    setCanResend(false);
    handleResendOtp();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md flex flex-col items-center justify-center text-center gap-4">
        <DialogHeader>
          <DialogTitle>Enter OTP</DialogTitle>
        </DialogHeader>
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

        {canResend ? (
          <button
            onClick={handleResend}
            className=" text-primary-500 rounded border-black"
          >
            Resend OTP
          </button>
        ) : (
          <p className="text-gray-500">
            Resend OTP in <span className="font-semibold">{timer}</span> seconds
          </p>
        )}
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
