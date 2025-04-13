import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useTranslation } from "react-i18next";

const MyAccordion = () => {
  const { t } = useTranslation();
  return (
    <div className="mx-auto  max-w-full p-4 md:p-6 lg:p-8">
      <Accordion type="single" collapsible className="space-y-4">
        <AccordionItem
          value="item-1"
          className="rounded-lg  bg-card shadow-sm px-4"
        >
          <AccordionTrigger className="text-left text-lg font-medium hover:no-underline md:text-xl md:px-4">
            <span className="w-full text-balance">
              {t("How do I create a room in Stack Nest?")}
            </span>
          </AccordionTrigger>
          <AccordionContent className="overflow-hidden px-4 text-base leading-relaxed text-muted-foreground md:text-lg">
            <div className="space-y-3">
              <p>{t("To create a room")}:</p>
              <ol className="list-decimal pl-6 space-y-2">
                <li>
                  {t("Click on the Create Room button in the dashboard.")}
                </li>
                <li>{t("Set a name and description for your room.")}</li>
                <li>{t("Choose the room type (public or private).")}</li>
                <li>
                  {t("Invite other developers by sharing the room link.")}
                </li>
              </ol>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="item-2"
          className="rounded-lg  bg-card shadow-sm px-4"
        >
          <AccordionTrigger className="text-left text-lg font-medium hover:no-underline md:text-xl md:px-4">
            <span className="w-full text-balance">
              {t("How can I connect with other developers?")}
            </span>
          </AccordionTrigger>
          <AccordionContent className="overflow-hidden px-4 text-base leading-relaxed text-muted-foreground md:text-lg">
            <div className="space-y-3">
              <p>
                {t("Stack Nest makes it easy to connect with other developers")}
                :
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t("Join public rooms to collaborate on projects")}</li>
                <li>{t("Send connection requests to other users")}</li>
                <li>
                  {t(
                    "Participate in group challenges to network with like-minded developers"
                  )}
                </li>
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="item-3"
          className="rounded-lg  bg-card shadow-sm px-4"
        >
          <AccordionTrigger className="text-left text-lg font-medium hover:no-underline md:text-xl md:px-4">
            <span className="w-full text-balance">
              {t("What are challenges, and how do I participate")}?
            </span>
          </AccordionTrigger>
          <AccordionContent className="overflow-hidden px-4 text-base leading-relaxed text-muted-foreground md:text-lg">
            <div className="space-y-3">
              <p>
                {t(
                  "Challenges are coding tasks or projects designed to improve your skills:"
                )}
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  {t("Browse available challenges in the Challenges section")}
                </li>
                <li>{t("Join a challenge by clicking Participate")}</li>
                <li>
                  {t(
                    "Submit your solution before the deadline to earn rewards"
                  )}
                </li>
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="item-4"
          className="rounded-lg  bg-card shadow-sm px-4"
        >
          <AccordionTrigger className="text-left text-lg font-medium hover:no-underline md:text-xl md:px-4">
            <span className="w-full text-balance">
              {t("Can I upload files to Stack Nest?")}
            </span>
          </AccordionTrigger>
          <AccordionContent className="overflow-hidden px-4 text-base leading-relaxed text-muted-foreground md:text-lg">
            <div className="space-y-3">
              <p>{t("Yes! Stack Nest allows you to upload files")}:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  {t("Upload code snippets, project files, or documentation")}
                </li>
                <li>
                  {t(
                    "Share files with your room members or challenge participants"
                  )}
                </li>
                <li>
                  {t(
                    "Use the Upload button in the room or challenge dashboard"
                  )}
                </li>
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="item-5"
          className="rounded-lg  bg-card shadow-sm px-4"
        >
          <AccordionTrigger className="text-left text-lg font-medium hover:no-underline md:text-xl md:px-4">
            <span className="w-full text-balance">
              {t("What are streaks, and how do they work")}?
            </span>
          </AccordionTrigger>
          <AccordionContent className="overflow-hidden px-4 text-base leading-relaxed text-muted-foreground md:text-lg">
            <div className="space-y-3">
              <p>{t("Streaks are a way to track your consistency")}:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  {t(
                    "Complete daily tasks or challenges to maintain your streak"
                  )}
                </li>
                <li>{t("Check your streak progress in the Profilesection")}</li>
                <li>{t("Longer streaks unlock exclusive rewards and badges")}</li>
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default MyAccordion;
