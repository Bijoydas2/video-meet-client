import { createContext, useState, useEffect, ReactNode } from "react";
import AgoraRTC, {
  IAgoraRTCClient,
  ILocalAudioTrack,
  ILocalVideoTrack,
} from "agora-rtc-sdk-ng";

interface IRemoteUser {
  uid: string | number;
  audioTrack?: ILocalAudioTrack;
  videoTrack?: ILocalVideoTrack;
}

interface MeetingContextType {
  client: IAgoraRTCClient;
  localTracks: (ILocalAudioTrack | ILocalVideoTrack)[];
  remoteUsers: IRemoteUser[];
  joined: boolean;
  joinMeeting: (channel: string) => Promise<void>;
  leaveMeeting: () => void;
}

export const MeetingContext = createContext<MeetingContextType | undefined>(
  undefined
);

const APP_ID = "YOUR_AGORA_APP_ID";
const TOKEN = "YOUR_AGORA_TOKEN";

export const MeetingProvider = ({ children }: { children: ReactNode }) => {
  const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
  const [joined, setJoined] = useState(false);
  const [localTracks, setLocalTracks] = useState<
    (ILocalAudioTrack | ILocalVideoTrack)[]
  >([]);
  const [remoteUsers, setRemoteUsers] = useState<IRemoteUser[]>([]);

  useEffect(() => {
    const handleUserPublished = async (user: IRemoteUser, mediaType: "audio" | "video") => {
      await client.subscribe(user, mediaType);
      if (mediaType === "video") setRemoteUsers((prev) => [...prev, user]);
      if (mediaType === "audio" && user.audioTrack) user.audioTrack.play();
    };

    const handleUserUnpublished = (user: IRemoteUser) => {
      setRemoteUsers((prev) => prev.filter((u) => u.uid !== user.uid));
    };

    client.on("user-published", handleUserPublished);
    client.on("user-unpublished", handleUserUnpublished);

    return () => {
      client.off("user-published", handleUserPublished);
      client.off("user-unpublished", handleUserUnpublished);
    };
  }, []);

  const joinMeeting = async (channel: string) => {
    await client.join(APP_ID, channel, TOKEN, undefined);
    setJoined(true);
    const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
    setLocalTracks([audioTrack, videoTrack]);
    await client.publish([audioTrack, videoTrack]);
  };

  const leaveMeeting = async () => {
    localTracks.forEach((track) => track.close());
    await client.leave();
    setJoined(false);
    setLocalTracks([]);
    setRemoteUsers([]);
  };

  return (
    <MeetingContext.Provider
      value={{ client, localTracks, remoteUsers, joined, joinMeeting, leaveMeeting }}
    >
      {children}
    </MeetingContext.Provider>
  );
};
