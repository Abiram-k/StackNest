import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Gift,
  Award,
  Percent,
  Star,
  Zap,
  Shield,
  Edit,
  Home,
  Clock,
  Heart,
  Brain,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useGetActiveReward } from "@/hooks/admin/rewardManagement/useGetActiveBenefits";
import { ResReward, RewardBenefitsT } from "@/types";
import { Spinner } from "@/components/ui/spinner";
import { useClaimReward } from "@/hooks/user/reward/useClaimReward";
import { useGetClaimedRewards } from "@/hooks/user/reward/useGetClaimedRewards";

type RewardType = "authorization" | "discount" | "bonus" | "feature" | "custom";

export default function RewardsPage({}) {
  const [selectedReward, setSelectedReward] = useState<ResReward | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const userPoints = searchParams.get("userPoints");
  const navigate = useNavigate();

  const { data: activeRewardData, isPending: fetchingRewards } =
    useGetActiveReward();
  const { mutate: claimRewardMutate, isPending: claimingReward } =
    useClaimReward();
  const { data: claimedRewards, isPending: fetchingClaimedRewardss } =
    useGetClaimedRewards();

  const handleClaimReward = async () => {
    if (!selectedReward) return;

    claimRewardMutate(selectedReward._id);
    setIsConfirmOpen(false);
    navigate(-1);
  };

  const getBenefitIcon = (key: RewardBenefitsT) => {
    switch (key) {
      case "profile_image_edit":
        return <Edit className="h-5 w-5" />;
      case "premium_room_creation":
        return <Home className="h-5 w-5" />;
      case "3d_premium_access":
        return <Star className="h-5 w-5" />;
      case "add_room_favorites":
        return <Heart className="h-5 w-5" />;
      case "fast_customer_support":
        return <Clock className="h-5 w-5" />;
      case "chat_bot_access":
        return <Brain className="h-5 w-5" />;
      default:
        return <Gift className="h-5 w-5" />;
    }
  };

  const getTypeIcon = (type: RewardType) => {
    switch (type) {
      case "authorization":
        return <Shield className="h-5 w-5" />;
      case "discount":
        return <Percent className="h-5 w-5" />;
      case "bonus":
        return <Zap className="h-5 w-5" />;
      case "feature":
        return <Star className="h-5 w-5" />;
      case "custom":
        return <Gift className="h-5 w-5" />;
      default:
        return <Gift className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: RewardType) => {
    switch (type) {
      case "authorization":
        return "bg-blue-100 text-blue-800";
      case "discount":
        return "bg-green-100 text-green-800";
      case "bonus":
        return "bg-purple-100 text-purple-800";
      case "feature":
        return "bg-amber-100 text-amber-800";
      case "custom":
        return "bg-slate-100 text-slate-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  return (
    <div className="min-h-screen flex flex-col w-full md:w-3/4 mt-10 md:-ms-32 justify-center md:justify-normal md:items-stretch items-center mb-20 px-2">
      {(fetchingRewards || claimingReward || fetchingClaimedRewardss) && (
        <Spinner />
      )}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Rewards Center</h1>
        <p className="text-muted-foreground mb-4">
          Redeem your challenge points for exclusive rewards
        </p>

        <div className="inline-flex items-center justify-center bg-slate-100 px-4 py-2 rounded-full">
          <Award className="h-5 w-5 mr-2 text-amber-500" />
          <span className="font-semibold">Your Points: </span>
          <span className="ml-1 text-lg font-bold text-amber-600">
            {userPoints}
          </span>
        </div>
      </div>

      <div className="w-full">
        {activeRewardData?.rewards.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No rewards available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeRewardData?.rewards.map((reward, index) => (
              <Card key={index} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{reward.name}</CardTitle>
                    <Badge
                      className={`${getTypeColor(
                        reward.type
                      )} flex items-center gap-1`}
                    >
                      {getTypeIcon(reward.type)}
                      <span className="capitalize">{reward.type}</span>
                    </Badge>
                  </div>
                  <CardDescription>{reward.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    {getBenefitIcon(reward.benefit_key)}
                    <span className="capitalize">
                      {reward.benefit_key.replace(/_/g, " ")}
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between items-center pt-3 border-t">
                  <div className="flex items-center">
                    <Award className="h-5 w-5 mr-1 text-amber-500" />
                    <span className="font-bold text-lg">
                      {reward.points_cost}
                    </span>
                    <span className="ml-1 text-muted-foreground">points</span>
                  </div>
                  <Dialog
                    open={isConfirmOpen && selectedReward?._id === reward._id}
                    onOpenChange={setIsConfirmOpen}
                  >
                    <DialogTrigger asChild>
                      <Button
                        className={`${
                          Number(userPoints) >= reward.points_cost &&
                          "bg-green-500 hover:bg-green-500/90"
                        }`}
                        variant={
                          Number(userPoints) >= reward.points_cost
                            ? "default"
                            : "outline"
                        }
                        disabled={
                          Number(userPoints) < reward.points_cost ||
                          claimedRewards?.rewards.includes(reward._id)
                        }
                        onClick={() => setSelectedReward(reward)}
                      >
                        {claimedRewards?.rewards.includes(reward._id)
                          ? "Claimed"
                          : Number(userPoints) >= reward.points_cost
                          ? "Claim Reward"
                          : "Not Enough Points"}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Confirm Reward Claim</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to claim this reward? This
                          action cannot be undone.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Reward:</span>
                          <span>{selectedReward?.name}</span>
                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Cost:</span>
                          <span>{selectedReward?.points_cost} points</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Remaining Points:</span>
                          <span>
                            {selectedReward
                              ? Number(userPoints) - selectedReward.points_cost
                              : userPoints}{" "}
                            points
                          </span>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setIsConfirmOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          className="bg-green-500 hover:bg-green-500/90"
                          onClick={handleClaimReward}
                          disabled={claimingReward}
                        >
                          {claimingReward ? "Processing..." : "Confirm Claim"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
