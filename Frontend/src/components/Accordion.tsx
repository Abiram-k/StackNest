import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const MyAccordion = () => {
  return (
    <div className="mx-auto  max-w-full p-4 md:p-6 lg:p-8">
      <Accordion type="single" collapsible className="space-y-4">
        <AccordionItem
          value="item-1"
          className="rounded-lg border bg-card shadow-sm px-4"
        >
          <AccordionTrigger className="text-left text-lg font-medium hover:no-underline md:text-xl md:px-4">
            <span className="w-full text-balance">
              How do I create a room in Stack Nest?
            </span>
          </AccordionTrigger>
          <AccordionContent className="overflow-hidden px-4 text-base leading-relaxed text-muted-foreground md:text-lg">
            <div className="space-y-3">
              <p>To create a room:</p>
              <ol className="list-decimal pl-6 space-y-2">
                <li>
                  Click on the{" "}
                  <strong className="text-primary">"Create Room"</strong> button
                  in the dashboard.
                </li>
                <li>Set a name and description for your room.</li>
                <li>Choose the room type (public or private).</li>
                <li>Invite other developers by sharing the room link.</li>
              </ol>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="item-2"
          className="rounded-lg border bg-card shadow-sm px-4"
        >
          <AccordionTrigger className="text-left text-lg font-medium hover:no-underline md:text-xl md:px-4">
            <span className="w-full text-balance">
              How can I connect with other developers?
            </span>
          </AccordionTrigger>
          <AccordionContent className="overflow-hidden px-4 text-base leading-relaxed text-muted-foreground md:text-lg">
            <div className="space-y-3">
              <p>Stack Nest makes it easy to connect with other developers:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Join public rooms to collaborate on projects</li>
                <li>Send connection requests to other users</li>
                <li>
                  Participate in group challenges to network with like-minded
                  developers
                </li>
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="item-3"
          className="rounded-lg border bg-card shadow-sm px-4"
        >
          <AccordionTrigger className="text-left text-lg font-medium hover:no-underline md:text-xl md:px-4">
            <span className="w-full text-balance">
              What are challenges, and how do I participate?
            </span>
          </AccordionTrigger>
          <AccordionContent className="overflow-hidden px-4 text-base leading-relaxed text-muted-foreground md:text-lg">
            <div className="space-y-3">
              <p>
                Challenges are coding tasks or projects designed to improve your
                skills:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Browse available challenges in the{" "}
                  <strong className="text-primary">"Challenges"</strong> section
                </li>
                <li>
                  Join a challenge by clicking{" "}
                  <strong className="text-primary">"Participate"</strong>
                </li>
                <li>
                  Submit your solution before the deadline to earn rewards
                </li>
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="item-4"
          className="rounded-lg border bg-card shadow-sm px-4"
        >
          <AccordionTrigger className="text-left text-lg font-medium hover:no-underline md:text-xl md:px-4">
            <span className="w-full text-balance">
              Can I upload files to Stack Nest?
            </span>
          </AccordionTrigger>
          <AccordionContent className="overflow-hidden px-4 text-base leading-relaxed text-muted-foreground md:text-lg">
            <div className="space-y-3">
              <p>Yes! Stack Nest allows you to upload files:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Upload code snippets, project files, or documentation</li>
                <li>
                  Share files with your room members or challenge participants
                </li>
                <li>
                  Use the <strong className="text-primary">"Upload"</strong>{" "}
                  button in the room or challenge dashboard
                </li>
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="item-5"
          className="rounded-lg border bg-card shadow-sm px-4"
        >
          <AccordionTrigger className="text-left text-lg font-medium hover:no-underline md:text-xl md:px-4">
            <span className="w-full text-balance">
              What are streaks, and how do they work?
            </span>
          </AccordionTrigger>
          <AccordionContent className="overflow-hidden px-4 text-base leading-relaxed text-muted-foreground md:text-lg">
            <div className="space-y-3">
              <p>Streaks are a way to track your consistency:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Complete daily tasks or challenges to maintain your streak
                </li>
                <li>
                  Check your streak progress in the{" "}
                  <strong className="text-primary">"Profile"</strong> section
                </li>
                <li>Longer streaks unlock exclusive rewards and badges</li>
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default MyAccordion;
