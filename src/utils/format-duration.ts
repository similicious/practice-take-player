export function formatDuration(length: number) {
  const minutes = String(Math.floor(length / 60)).padStart(2, "0");
  const seconds = String(Math.floor(length % 60)).padStart(2, "0");
  return `${minutes}:${seconds}`;
}
