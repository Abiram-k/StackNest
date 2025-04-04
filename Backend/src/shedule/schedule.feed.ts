import cron from "node-cron";
import { Types } from "mongoose";
import { FeedRepository } from "../repositories/feed.repository";
import { sendFeedPublishedMail } from "../utils/email";

cron.schedule("* * * * *", async () => {
  const now = new Date();

  const feedRepository = new FeedRepository();
  const feeds = await feedRepository.getFeedsToPublish(now);

  for (const feed of feeds) {
    await feedRepository.publishFeed(feed._id);
    if (feed.userId instanceof Types.ObjectId || !feed.scheduledAt) {
      return;
    } else {
      await sendFeedPublishedMail(
        feed.userId.userName,
        feed._id,
        feed.userId.email,
        feed.title
      );
    }
  }
});
