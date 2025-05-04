import Logo from "../ui/Logo";
import ToolTipProvider from "../providers/ToolTipProvider";
const tooltips = [
  {
    trigger: "Terms & Conditions",
    title: "Usage Policy",
    content:
      "StackNest is a platform for developers to connect, join rooms, share projects, and participate in daily challenges. By using this platform, you agree to our terms and conditions. Please read them carefully.",
  },
  {
    trigger: "Privacy",
    title: "Privacy Policy",
    content:
      "We value your privacy at StackNest. Your personal data is securely stored and will never be shared without your consent. Review our privacy policy to understand how we protect your data.",
  },
  {
    trigger: "Support",
    title: "Support System",
    content:
      "Need help using StackNest? Our support team is available 24/7 to assist with any issues. Check out our FAQ section or contact us for direct support.",
  },
];

const Footer = () => {
  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <Logo />
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear().toString() || 2025} Stack Nest - Abiram,
            Inc. All rights reserved.
          </p>
          <div className="flex gap-4">
            {tooltips.map((tooltip, index) => (
              <ToolTipProvider
                key={index}
                trigger={tooltip.trigger}
                title={tooltip.title}
                content={tooltip.content}
              />
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
