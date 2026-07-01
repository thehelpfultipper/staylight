"use client";

import { useRouter } from "next/navigation";
import { ErrorState } from "./ErrorState";

type RefreshErrorStateProps = {
  title?: string;
  message: string;
  retryLabel?: string;
};

export function RefreshErrorState({
  title,
  message,
  retryLabel,
}: RefreshErrorStateProps) {
  const router = useRouter();

  return (
    <ErrorState
      title={title}
      message={message}
      retryLabel={retryLabel}
      onRetry={() => router.refresh()}
    />
  );
}
