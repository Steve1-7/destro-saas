import { useEffect, useRef, useState } from "react";
import { Device } from "@twilio/voice-sdk";

type CallState = "idle" | "ringing" | "connected" | "ended" | "error";

export function useTwilioVoice(userId: string | undefined) {
  const [state, setState] = useState<CallState>("idle");
  const [error, setError] = useState<string | null>(null);
  const deviceRef = useRef<Device | null>(null);
  const callRef = useRef<Awaited<ReturnType<Device["connect"]>> | null>(null);

  useEffect(() => {
    if (!userId) return;
    setError("Twilio credentials required in .env");
    setState("error");
  }, [userId]);

  const makeCall = async (_toNumber: string) => {
    setError("Configure Twilio credentials to enable calling");
  };

  const acceptCall = () => {};
  const rejectCall = () => {};
  const endCall = () => {};

  return { state, error, makeCall, acceptCall, rejectCall, endCall };
}
