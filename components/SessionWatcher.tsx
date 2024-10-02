import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";

export default function SessionWatcher() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      const currentTime = Date.now();
      const sessionExpiryTime = new Date(session.expires).getTime();
      const timeRemaining = sessionExpiryTime - currentTime;

      if (timeRemaining > 0) {
        const timeout = setTimeout(() => {
          signOut();
        }, timeRemaining);

        return () => clearTimeout(timeout);
      } else {
        signOut();
      }
    }
  }, [session]);

  return null;
}
