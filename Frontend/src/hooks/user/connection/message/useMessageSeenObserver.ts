import { useEffect, useRef } from "react";
import { useToggleIsRead } from "./useToggleIsRead";

type Props = {
  friendId: string;
  messageId: string;
  isRead: boolean;
  onSeen?: () => void;
};
export const useMessageSeenObserver = ({
  friendId,
  messageId,
  isRead,
  onSeen,
}: Props) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const { mutate: isReadToggleMutate } = useToggleIsRead(messageId,friendId);
  useEffect(() => {
    if (isRead) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          isReadToggleMutate(messageId);
          onSeen?.();
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [isRead, messageId]);

  return ref;
};
