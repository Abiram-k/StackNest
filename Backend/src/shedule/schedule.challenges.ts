import { ChallengeRespository } from "../repositories/challenge.repository";
import { ChallengeSubmissionRepository } from "../repositories/challengeSubmission.repository";
import { UserBaseRepository } from "../repositories/user.repository";
import { ChallengeService } from "../services/challenge.service";
import cron from "node-cron";

const challengeRepo = new ChallengeRespository();
const userBaseRepo = new UserBaseRepository();
const challengeSubmissionRepo = new ChallengeSubmissionRepository();
const challengeService = new ChallengeService(
  challengeRepo,
  userBaseRepo,
  challengeSubmissionRepo
);

cron.schedule("0 0 * * *", async () => {
  try {
    const challenges = await challengeService.getAllChallenges();
    if (!challenges || challenges.length < 4) {
      console.log(" Adequite challenges not there in cron");
      return;
    }
    const shuffled = challenges.sort(() => 0.5 - Math.random());

    const selectedChallenges = shuffled
      .slice(0, 4)
      .map((challenge) => challenge._id);

    await challengeService.sheduleChallenge(selectedChallenges);
  } catch (error) {
    console.log(error);
    throw error;
  }
});
