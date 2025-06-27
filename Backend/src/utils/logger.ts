import fs from "fs-extra";
import morgan from "morgan";
import cron from "node-cron";
import path from "path";
import { fileURLToPath } from "url";
import moment from "moment";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const logDirectory = path.join(__dirname, '../logs');

const logDirectory = path.join(__dirname, "../logs");

async function bootstrap() {
  await fs.ensureDir(logDirectory); 
}
bootstrap();

const errorFormat = morgan.compile(
  ":method :url :status :res[content-length] - :response-time ms"
);

// Error log stream with ES6 class
class ErrorLogStream {
  write(message: any) {
    const status = message.split(" ")[2];
    if (status >= 400) {
      const date = moment().format("YYYY-MM-DD");
      const logPath = path.join(logDirectory, `errors-${date}.log`);
      fs.appendFile(logPath, message);
    }
  }
}

// Log rotation service
export const setupLogRotation = () => {
  cron.schedule("0 0 * * *", async () => {
    // Daily at midnight
    try {
      const retentionDays = 7;
      const cutoffDate = moment().subtract(retentionDays, "days");
      const files = await fs.readdir(logDirectory);

      for (const file of files) {
        if (file.startsWith("errors-")) {
          const fileDate = moment(
            file.split("-")[1].split(".")[0],
            "YYYY-MM-DD"
          );
          if (fileDate.isBefore(cutoffDate)) {
            await fs.unlink(path.join(logDirectory, file));
          }
        }
      }
    } catch (error) {
      console.error("Log rotation error:", error);
    }
  });
};

// Morgan middleware with error streaming
export const errorLogger = morgan(errorFormat, {
  stream: new ErrorLogStream(),
  skip: (req, res) => res.statusCode < 400,
});

// export default { errorLogger, setupLogRotation };
