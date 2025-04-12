import { HttpService } from "@/api/httpService"
import { UserProfileService } from "@/api/user/userProfileService";
import { useQuery } from "@tanstack/react-query"

export const useGetUserInspect = (userName:string) => {
    const httpService = new HttpService();
    const userProfileService =new UserProfileService(httpService);
    return useQuery({
        queryKey:["user-details"],
        queryFn:()=>userProfileService.getInspectData(userName)
    })
}