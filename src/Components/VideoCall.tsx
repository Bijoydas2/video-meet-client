import { useState, useEffect } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import type { ILocalAudioTrack, ILocalVideoTrack, IRemoteUser, IAgoraRTCClient } from "agora-rtc-sdk-ng";
import { Mic, MicOff, Video, VideoOff, Link2, Phone } from "lucide-react";
import LocalVideo from "./LocalVideo";
import RemoteVideo from "./RemoteVideo";

const APP_ID = "04fb09ffe58441cf912af6b2e8c52020"; 
const DEFAULT_CHANNEL = "video-meet";
const client: IAgoraRTCClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

const getChannelFromUrl = (): string => {
  const params = new URLSearchParams(window.location.search);
  return params.get("channel") || DEFAULT_CHANNEL;
};

function VideoCall() {
  const [joined, setJoined] = useState(false);
  const [localTracks, setLocalTracks] = useState<(ILocalAudioTrack | ILocalVideoTrack)[]>([]);
  const [remoteUsers, setRemoteUsers] = useState<IRemoteUser[]>([]);
  const [token, setToken] = useState("");
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  const currentChannel = getChannelFromUrl();

  const fetchToken = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/agora-token?channel=${currentChannel}`);
    const data = await res.json();
    setToken(data.token);
  };

  const handleJoin = async () => {
    if (!token) await fetchToken();
    await client.join(APP_ID, currentChannel, token || null, undefined);
    setJoined(true);

    const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
    setLocalTracks([audioTrack, videoTrack]);
    await client.publish([audioTrack, videoTrack]);
  };

  const handleLeave = () => {
    localTracks.forEach(track => track.close());
    client.leave();
    setJoined(false);
    setLocalTracks([]);
    setRemoteUsers([]);
    setIsAudioMuted(false);
    setIsVideoOff(false);
  };

  useEffect(() => {
    const handleUserPublished = async (user: IRemoteUser, mediaType: "audio" | "video") => {
      await client.subscribe(user, mediaType);
      if (mediaType === "video") setRemoteUsers(prev => [...prev.filter(u => u.uid !== user.uid), user]);
      if (mediaType === "audio" && user.audioTrack) user.audioTrack.play();
    };
    const handleUserUnpublished = (user: IRemoteUser) => setRemoteUsers(prev => prev.filter(u => u.uid !== user.uid));

    client.on("user-published", handleUserPublished);
    client.on("user-unpublished", handleUserUnpublished);

    return () => {
      client.off("user-published", handleUserPublished);
      client.off("user-unpublished", handleUserUnpublished);
    };
  }, []);

  const toggleAudio = () => {
    const audioTrack = localTracks[0] as ILocalAudioTrack;
    if (audioTrack) audioTrack.setEnabled(isAudioMuted).then(() => setIsAudioMuted(!isAudioMuted));
  };

  const toggleVideo = () => {
    const videoTrack = localTracks[1] as ILocalVideoTrack;
    if (videoTrack) videoTrack.setEnabled(isVideoOff).then(() => setIsVideoOff(!isVideoOff));
  };

  const copyInviteLink = () => {
    const inviteLink = `${window.location.origin}${window.location.pathname}?channel=${currentChannel}`;
    navigator.clipboard.writeText(inviteLink)
      .then(() => alert("Invite link copied to clipboard!"))
      .catch(err => console.error("Failed to copy invite link:", err));
  };

  return (
  <div className="flex flex-col h-screen bg-primary/10 text-white relative">

  <div className="flex-1 flex flex-wrap p-4 gap-2 overflow-auto justify-center items-center">
    {/* Local Video বড় অংশে */}
    {joined && (
      <div className={`flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 aspect-video`}>
        <LocalVideo tracks={localTracks} isVideoOff={isVideoOff} />
      </div>
    )}
    {/* Remote videos */}
    {remoteUsers.map(user => (
      <div key={user.uid} className="flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 aspect-video">
        <RemoteVideo user={user} />
      </div>
    ))}
  </div>

  {/* Floating Control Bar */}
  <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center justify-center gap-6 bg-gray-800 bg-opacity-70 backdrop-blur-md px-6 py-3 rounded-full shadow-lg">
    {!joined ? (
      <button
        onClick={handleJoin}
        className="bg-green-600 hover:bg-green-700 p-4 rounded-full flex items-center justify-center transition-transform transform hover:scale-110"
      >
        <Phone size={24} />
      </button>
    ) : (
      <>
        <button
          onClick={toggleAudio}
          className={`p-4 rounded-full flex items-center justify-center transition-transform transform hover:scale-110 ${isAudioMuted ? 'bg-yellow-400 text-black' : 'bg-gray-700'}`}
        >
          {isAudioMuted ? <MicOff size={24} /> : <Mic size={24} />}
        </button>
        <button
          onClick={toggleVideo}
          className={`p-4 rounded-full flex items-center justify-center transition-transform transform hover:scale-110 ${isVideoOff ? 'bg-yellow-400 text-black' : 'bg-gray-700'}`}
        >
          {isVideoOff ? <Video size={24} /> : <VideoOff size={24} />}
        </button>
        <button
          onClick={handleLeave}
          className="bg-red-600 hover:bg-red-700 p-4 rounded-full flex items-center justify-center transition-transform transform hover:scale-110"
        >
          <Phone size={24} />
        </button>
        <button
          onClick={copyInviteLink}
          className="bg-blue-600 hover:bg-blue-700 p-4 rounded-full flex items-center justify-center transition-transform transform hover:scale-110"
        >
          <Link2 size={24} />
        </button>
      </>
    )}
  </div>
</div>

  );

}

export default VideoCall;
