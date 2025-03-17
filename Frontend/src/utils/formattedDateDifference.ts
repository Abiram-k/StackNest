export const formattedDateDifference = (from: Date, to: Date) => {
  const fromString = new Date(from);
  const toString = new Date(to);

  const durationMs = fromString.getTime() - toString.getTime();

  const second = Math.floor((durationMs / 1000) % 60);
  const minutes = Math.floor((durationMs / (1000 * 60)) % 60);
  const hours = Math.floor((durationMs / (1000 * 60 * 60)) % 24);

  
  return `${hours}:${minutes}:${second}`;
};