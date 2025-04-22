import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { useGetFriendSuggestion } from "@/hooks/user/userProfile/useGetFriendSuggestion";
import { useNavigate } from "react-router-dom";
import { useSendConnectionRequest } from "@/hooks/user/connection/useSendConnectionRequest";
import { Spinner } from "../ui/spinner";
import { useGetConnectionRequests } from "@/hooks/user/connection/useGetConnectionRequests";
import { useTranslation } from "react-i18next";
import { CheckCircle2 } from "lucide-react";

const FreindsSection = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { data: userList } = useGetFriendSuggestion();
  const { mutate: sendRequestMutate, isPending: sendingRequest } =
    useSendConnectionRequest();
  const handleSendConnectionRequest = (recieverName: string) => {
    sendRequestMutate(recieverName);
  };
  const { data: sendedRequests, isPending: fetchingSendedRequests } =
    useGetConnectionRequests();
  return (
    <section className="container mx-auto px-4 py-12">
      {(sendingRequest || fetchingSendedRequests) && <Spinner />}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{t("Suggested Friends")}</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 ">
        {userList?.usersData?.map((item, index) => (
          <Card
            key={index}
            className="group relative p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 dark:bg-gray-800"
          >
            <div className="flex flex-col h-full">
              <div className="mx-auto mb-4 w-24 h-24 relative">
                <div className="rounded-full border-2 border-primary-500 p-1">
                  <img
                    src={
                      item.avatar ||
                      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                    }
                    alt={`${item.userName}'s profile`}
                    className="w-full h-full rounded-full object-cover aspect-square"
                  />
                </div>
              </div>

              <div className="text-center mb-4 flex-1">
                <div className="flex items-center justify-center gap-2">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-1">
                    {item.firstName || item.userName || "Anonymous User"}
                  </h3>
                  {item.isVerified && (
                    <span>
                      <CheckCircle2 className="w-5 h-5 text-blue-600 bg-white rounded-full" />
                    </span>
                  )}
                </div>
                {item.userName && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    @{item.userName}
                  </p>
                )}

                {item.description && (
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                    {item.description}
                  </p>
                )}
              </div>

              <div className="flex gap-3 mt-auto">
                <Button
                  variant="outline"
                  className="w-full text-sm px-4 py-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                  onClick={() => navigate(`/user/${item.userName}/view`)}
                >
                  View Profile
                </Button>
                <Button
                  className="w-full text-sm px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white dark:bg-primary-600 dark:hover:bg-primary-700 transition-colors dark:text-white"
                  onClick={() => handleSendConnectionRequest(item.userName)}
                  disabled={sendedRequests?.requests.includes(item.userName)}
                >
                  Connect
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
      <div className="text-center mt-8">
        <Button
          variant="link"
          className="dark:text-primary-600 text-primary-500"
          onClick={() => navigate("/user/highlights")}
        >
          {t("Explore")} →
        </Button>
      </div>
    </section>
  );
};

export default FreindsSection;
