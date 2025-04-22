import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
interface FormData {
  name: string;
  email: string;
  type: string;
  message: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    type: "",
    message: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.email || !formData.message) {
      toast.error("Please fill all the field");
      return;
    }
    toast.success("Form submitted");
    navigate("/user/about");
    setFormData({ name: "", email: "", type: "", message: "" });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black mt-20">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Fuel Your Brand's Goals with{" "}
            <span className="text-primary-500 dark:text-primary-600">
              Beyond
            </span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            You will get a response within 24 hours. We will explain in details
            how we can help you fuel and grow your brand within the stated
            budget.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-xl font-medium text-gray-900 dark:text-gray-400 mb-3"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="block w-full border-0 dark:text-white border-b border-gray-300 py-1.5 text-gray-900 placeholder:text-gray-400 focus:border-blue-600 focus:ring-0 sm:text-sm sm:leading-6"
              />
            </div>

            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-xl font-medium dark:text-gray-400 text-gray-900 mb-3"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="block w-full border-0 dark:text-white border-b border-gray-300 py-1.5 text-gray-900 placeholder:text-gray-400 focus:border-blue-600 focus:ring-0 sm:text-sm sm:leading-6"
              />
            </div>

            {/* Type Input */}
            <div>
              <label
                htmlFor="type"
                className="block dark:text-gray-400 text-xl font-medium text-gray-900 mb-3"
              >
                Type
              </label>
              <input
                type="text"
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="block w-full border-0 border-b dark:text-white border-gray-300 py-1.5 text-gray-900 placeholder:text-gray-400 focus:border-blue-600 focus:ring-0 sm:text-sm sm:leading-6"
              />
            </div>

            {/* Message Input */}
            <div>
              <label
                htmlFor="message"
                className="block text-xl dark:text-gray-400 font-medium text-gray-900 mb-3"
              >
                Message ...
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                className="block w-full border-0 border-b py-1.5 dark:text-white text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6 "
              />
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="rounded-md bg-primary-500  px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary-600/90 dark:bg-primary-600 dark:hover:bg-primary-600/90"
            >
              Send Enquiry
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
