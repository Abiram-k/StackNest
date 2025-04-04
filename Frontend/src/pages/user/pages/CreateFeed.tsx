import { HttpService } from "@/api/httpService";
import { ImageService } from "@/api/public/imageService";
import DetailsForm from "@/components/forms/DetailsForm";
import ImageUploader from "@/components/ImageUploader";
import { Spinner } from "@/components/ui/spinner";
import { usePostNewFeed } from "@/hooks/feeds/usePostNewFeed";
import { useVerifyFeedForm } from "@/hooks/validation/useFeedForm";
import { FeedReqType } from "@/types";
import { validateFeedSchema } from "@/validation/feedSchema";
import { ArrowLeft } from "lucide-react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const instructions = {
  content: (title: string) => `
  You are a technical content writer for StackNest - a developer community platform.
  Generate a concise, well-structured description (100-120 words) that:
  - Directly relates to the title "${title}"
  - Uses a formal, informative tone
  - Includes technical emojis (🫂, 💻, 🔧, ✨, ⚙️, 🔗)
  - Is formatted with line breaks and optional bullet points
  - Avoids marketing tone, focuses on practical developer value
`,
  contentPrompt: (title: string) => `
Title: ${title}
Generate a technical description with:
- A brief problem statement
- Explanation of the topic
- Implementation insights
- Benefits summary
Limit to 2-3 emojis.
`,
  title: `You are a concise, creative technical title generator for blog posts or articles.
   Generate a short, catchy, and relevant title (max 12 words) based on the following content.
   Avoid clickbait. Ensure clarity, relevance, and developer appeal.`,
  titlePropmt: (content: string) => `
  Content:
  ${content}
  Generate a StackNest-compatible technical blog post title.`,
};

import { GoogleGenerativeAI } from "@google/generative-ai";

const CreateFeed = () => {
  const {
    register,
    reset,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useVerifyFeedForm({
    schema: validateFeedSchema,
    defaultValues: {
      title: "",
      content: "",
      media: "",
      scheduledAt: null,
    },
  });
  const selectedImage = useRef<File | null>(null);
  const uploadedImgUrl = useRef<string | "">("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { mutate, isPending } = usePostNewFeed();

  const handleAddPost = async (data: FeedReqType) => {
    try {
      setIsLoading(true);
      if (selectedImage.current) {
        const httpService = new HttpService();
        const imageService = new ImageService(httpService);
        const credentials = await imageService.getCloudinaryCredentials();

        if (
          !credentials?.signature ||
          !credentials?.timestamp ||
          !credentials?.apiKey ||
          !credentials?.cloudName
        ) {
          toast.dismiss();
          toast.error("Missing Cloudinary credentials");
          return;
        }

        // post request to cloudinary signed uploads
        const cloudinaryImgURL = await imageService.uploadImage(
          selectedImage.current,
          "stackNest",
          credentials.cloudName,
          credentials.apiKey,
          credentials.signature,
          credentials.timestamp
        );
        setValue("media", cloudinaryImgURL);
        uploadedImgUrl.current = cloudinaryImgURL;
      }
      const formattedData = {
        media: uploadedImgUrl.current,
        title: data.title,
        content: data.content,
        scheduledAt: data.scheduledAt,
      };
      mutate(formattedData);
      reset();
      selectedImage.current = null;
      navigate(-1);
    } catch (error) {
      toast.error("Error occured while uploading post");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (file: File) => {
    selectedImage.current = file;
  };

  const generateAIContent = async (fieldType: string) => {
    try {
      setIsLoading(true);

      const title = watch("title")?.trim();
      const content = watch("content")?.trim();

      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

      let prompt = "";
      let instruction = "";
      let targetField = "";

      if (fieldType === "content") {
        if (!title || title.length < 5) {
          toast.warning(
            "Please enter a meaningful title (at least 5 characters)"
          );
          return;
        }

        targetField = "content";
        instruction = instructions.content(title);
        prompt = instructions.contentPrompt(title);
      } else if (fieldType === "title") {
        if (!content || content.length < 20) {
          toast.warning(
            "Please provide enough content (at least 20 characters) to generate a title."
          );
          return;
        }

        targetField = "title";
        instruction = instructions.title;
        prompt = instructions.titlePropmt(content);
      } else {
        toast.error("Invalid AI generation type.");
        return;
      }

      const modelWithInstruction = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction: instruction,
      });

      const result = await modelWithInstruction.generateContent(prompt);
      const generatedText = result.response.text().trim();

      if (generatedText.length < 5) {
        toast.error("Generated content too short, try again..");
      }
      if (targetField == "content") {
        setValue(
          targetField,
          generatedText.replace(/\*\*/g, "").replace(/```/g, "")
        );
      }
      if (targetField == "title") {
        setValue(
          targetField,
          generatedText.replace(/\*\*/g, "").replace(/```/g, "")
        );
      }
      toast.success(`AI ${targetField} generated successfully!`);
    } catch (error: any) {
      const errorMessage =
        error.response?.promptFeedback?.blockReasonMessage ||
        error.message ||
        "Content generation failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black w-full md:-ms-72 mb-20">
      {(isLoading || isPending) && <Spinner />}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-gray-50 dark:bg-black rounded-3xl p-8">
          <button
            className="flex items-center text-gray-600 mb-6 hover:text-gray-900 dark:text-gray-500 dark:hover:text-gray-400"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>

          <h1 className="text-2xl font-semibold mb-2">Upload New Feed</h1>
          <p className="text-gray-600 mb-8">
            Share your quality thoughts with other developers, collaborate with
            them for your bright future.
          </p>

          <div className="">
            <div className="flex flex-col gap-2  h-fit px-10 mb-2 md:mb-5 md:ms-14 lg:ms-18 rounded-lg ">
              <p className="text-sm font-medium mb-2 block  text-black">
                Image / Video :
              </p>
              <ImageUploader
                isVideoAllowed={true}
                avatar=""
                defaultAvatar="https://placehold.co/1600x450"
                isEditing={true}
                onImageChange={handleImageChange}
                containerClass="border-2 md:-ms-10 border-dashed border-gray-300 hover:border-blue-500 relative w-full md:w-full h-46 rounded-lg overflow-hidden group transition duration-300 ease-in-out"
                avatarClass="w-full h-full object-cover rounded-none"
                inputClass="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                fallbackText="Media Added"
              />
            </div>
            <DetailsForm
              isEditing={true}
              errors={errors}
              submitButtonText="Post Now"
              onSubmit={handleSubmit(handleAddPost)}
              register={register}
              generateAIContent={generateAIContent}
              fields={[
                [
                  {
                    name: "title",
                    label: "Title",
                    type: "text",
                    placeholder: "Enter Title",
                    setValue,
                    enableAiRecommendation: true,
                  },
                  {
                    name: "scheduledAt",
                    label: "Schedule At",
                    type: "date",
                    placeholder: "Select Date",
                    setValue,
                  },
                ],
                [
                  {
                    name: "content",
                    label: "Content",
                    type: "textarea",
                    placeholder: "Enter Content / Generate using AI ... ",
                    setValue,
                    enableAiRecommendation: true,
                  },
                ],
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateFeed;
