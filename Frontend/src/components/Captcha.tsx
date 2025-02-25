// components/Captcha.tsx
import { forwardRef } from 'react';
import ReCAPTCHA, { ReCAPTCHAProps } from 'react-google-recaptcha';

interface CaptchaProps extends ReCAPTCHAProps {
  onVerify: (token: string | null) => void;
}

export const Captcha = forwardRef<ReCAPTCHA, CaptchaProps>(
  ({ onVerify, ...props }, ref) => {
    return (
      <ReCAPTCHA
        ref={ref}
        onChange={onVerify}
        {...props}
      />
    );
  }
);