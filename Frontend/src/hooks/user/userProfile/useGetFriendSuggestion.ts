import { HttpService } from "@/api/httpService"
import { UserProfileService } from "@/api/user/userProfileService";
import { useQuery } from "@tanstack/react-query"

export const useGetFriendSuggestion = () => {
    const httpService = new HttpService();
    const userProfileService = new UserProfileService(httpService);
    return useQuery ({
        queryKey:["friend-suggestion"],
        queryFn:() => userProfileService.getFriendSuggestion()
    })
}