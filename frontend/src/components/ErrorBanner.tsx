import { Alert } from "./ui/alert";

export function ErrorBanner({ message }: { message: string }) {
  if (!message) return null;
  return <Alert>{message}</Alert>;
}
