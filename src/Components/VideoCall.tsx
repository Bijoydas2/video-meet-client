import { useState, useEffect } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import type { ILocalAudioTrack, ILocalVideoTrack, IAgoraRTCRemoteUser, IAgoraRTCClient } from "agora-rtc-sdk-ng";
import { Mic, MicOff, Video, VideoOff, Link2, Phone, Volume2, VolumeX } from "lucide-react";
import LocalVideo from "./LocalVideo";
import RemoteVideo from "./RemoteVideo";
export type IRemoteUser = IAgoraRTCRemoteUser;
const APP_ID = import.meta.env.VITE_AGORA_APP_ID;
const DEFAULT_CHANNEL = import.meta.env.VITE_DEFAULT_CHANNEL;
const client: IAgoraRTCClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

const getChannelFromUrl = (): string => {
  const params = new URLSearchParams(window.location.search);
  return params.get("channel") || DEFAULT_CHANNEL;
};


const generateUid = () => Math.floor(Math.random() * 100000) + 1;


function VideoCall() {
  const [joined, setJoined] = useState(false);
  const [localTracks, setLocalTracks] = useState<(ILocalAudioTrack | ILocalVideoTrack)[]>([]);
  const [remoteUsers, setRemoteUsers] = useState<IRemoteUser[]>([]);
  

  const [uid] = useState(generateUid()); 
  
  const [token, setToken] = useState("");
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [mics, setMics] = useState<MediaDeviceInfo[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string | null>(null);
  const [selectedMic, setSelectedMic] = useState<string | null>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);

  const currentChannel = getChannelFromUrl();



  const fetchToken = async () => {
   
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/agora-token?channel=${currentChannel}&uid=${uid}`);
    const data = await res.json();
    setToken(data.token);
    return data.token;
  };

  const loadDevices = async () => {
    const devices = await AgoraRTC.getDevices();
    const videoInputs = devices.filter(d => d.kind === "videoinput");
    const audioInputs = devices.filter(d => d.kind === "audioinput");
    setCameras(videoInputs);
    setMics(audioInputs);

    if (!selectedCamera && videoInputs.length > 0) setSelectedCamera(videoInputs[0].deviceId);
    if (!selectedMic && audioInputs.length > 0) setSelectedMic(audioInputs[0].deviceId);
  };

  useEffect(() => {
    loadDevices();
  }, []);
  


  const startRecording = (audioTrack: ILocalAudioTrack) => {
    try {

      const stream = audioTrack.getMediaStreamTrack();
      if (!stream) {
        console.error("Local audio track stream not found.");
        return;
      }

      const mediaStream = new MediaStream([stream]);
      const newRecorder = new MediaRecorder(mediaStream, { mimeType: 'audio/webm' }); 
      
      const chunks: Blob[] = [];

      newRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      newRecorder.onstop = async () => {
        const finalBlob = new Blob(chunks, { type: 'audio/webm' });
        await uploadRecording(finalBlob);
      };

      newRecorder.start();
      setRecorder(newRecorder);
      setIsRecording(true);
      console.log("✅ Audio recording started.");

    } catch (err) {
      console.error("❌ Failed to start recording:", err);
    }
  };
  
   const uploadRecording = async (blob: Blob) => {
    if (blob.size === 0) {
      console.warn("Recording blob is empty. Skipping upload.");
      return;
    }
    
    const file = new File([blob], "meeting_recording.webm", { type: blob.type });

    const formData = new FormData();
    formData.append("file", file);

    console.log("Uploading file to backend...");


    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/upload/upload-recording`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed with status: ${response.status}`); 
      }
 
    } catch (err) {
      console.error("❌ Upload to backend failed:", err); 
      alert("Recording upload and processing failed. Check console for details.");
    }
    finally {
      setRecorder(null);
      setIsRecording(false);
    }
  };


  const handleJoin = async () => {
    let authToken = token;
    if (!authToken) {
      authToken = await fetchToken();
    }

    await client.join(APP_ID, currentChannel, authToken || null, uid); 

    const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks(
      { microphoneId: selectedMic || undefined },
      { cameraId: selectedCamera || undefined }
    );

    setLocalTracks([audioTrack, videoTrack]);
    
    
    await client.publish([audioTrack, videoTrack]);
    setJoined(true);
    startRecording(audioTrack as ILocalAudioTrack);
  };

  
  const handleLeave = async () => {
    
    if (recorder && isRecording) {
      recorder.stop();
      console.log("Recording stopped. Waiting for upload...");
    }


    localTracks.forEach(track => track.close());
    await client.leave();
   
    setLocalTracks([]);
    setRemoteUsers([]);
    setJoined(false);
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
  const switchCamera = async (deviceId: string) => {
    if (!joined) return setSelectedCamera(deviceId);
    
    const newVideoTrack = await AgoraRTC.createCameraVideoTrack({ cameraId: deviceId });
    const oldTrack = localTracks[1] as ILocalVideoTrack;
    
    await client.unpublish([oldTrack]);
    oldTrack.close();
    
    await client.publish([newVideoTrack]);
    setLocalTracks([localTracks[0], newVideoTrack]);
    setSelectedCamera(deviceId);
  };

  const switchMic = async (deviceId: string) => {
    if (!joined) return setSelectedMic(deviceId);
    
    const newAudioTrack = await AgoraRTC.createMicrophoneAudioTrack({ microphoneId: deviceId });
    const oldTrack = localTracks[0] as ILocalAudioTrack;
    
    const wasRecording = isRecording;
    if (wasRecording && recorder) recorder.stop(); 

    await client.unpublish([oldTrack]);
    oldTrack.close();
    
    await client.publish([newAudioTrack]);
    setLocalTracks([newAudioTrack, localTracks[1]]);
    setSelectedMic(deviceId);
    
    if (wasRecording) startRecording(newAudioTrack); 
  };

 
  const copyInviteLink = () => {
    const inviteLink = `${window.location.origin}${window.location.pathname}?channel=${currentChannel}`;
    navigator.clipboard.writeText(inviteLink)
      .then(() => alert("Invite link copied to clipboard!"))
      .catch(err => console.error("Failed to copy invite link:", err));
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white relative">


      <div className="absolute top-6 left-6 flex gap-2 z-10">
        <select
          value={selectedCamera || ""}
          onChange={(e) => switchCamera(e.target.value)}
          className="bg-gray-800 text-white p-2 rounded text-sm"
          disabled={!cameras.length}
        >
          {cameras.map(cam => <option key={cam.deviceId} value={cam.deviceId}>{cam.label || `Camera ${cam.deviceId}`}</option>)}
        </select>
        <select
          value={selectedMic || ""}
          onChange={(e) => switchMic(e.target.value)}
          className="bg-gray-800 text-white p-2 rounded text-sm"
          disabled={!mics.length}
        >
          {mics.map(m => <option key={m.deviceId} value={m.deviceId}>{m.label || `Mic ${m.deviceId}`}</option>)}
        </select>
      </div>
      

      {isRecording && (
          <div className="absolute top-6 right-6 flex items-center gap-2 text-red-500 z-10 p-2 bg-gray-800 rounded-full shadow-lg">
            <span className="h-3 w-3 bg-red-500 rounded-full animate-pulse"></span>
            <span>REC</span>
          </div>
        )}


      <div className="flex-1 flex flex-wrap p-4 gap-4 overflow-auto justify-center items-center">
     
        {joined && (
          <div className="flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 aspect-video bg-gray-700 rounded-lg overflow-hidden relative shadow-xl">
            <LocalVideo tracks={localTracks} isVideoOff={isVideoOff} />
            <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-xs">You (Local) - UID: {uid}</div>
          </div>
        )}
        

        {remoteUsers.map(user => (
          <div key={user.uid} className="flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 aspect-video bg-gray-700 rounded-lg overflow-hidden relative shadow-xl">
            <RemoteVideo user={user} />
            <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-xs">User {user.uid}</div>

            <div className="absolute top-2 right-2 bg-black/50 p-1 rounded-full">

{user.audioTrack && !((user.audioTrack as any).enabled) ? <VolumeX size={16} className="text-red-400" /> : <Volume2 size={16} className="text-green-400" />}
            </div>
          </div>
        ))}
        
   
        {!joined && (
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-4">Ready to Join?</h1>
              <p className="text-gray-400">Channel: **{currentChannel}**</p>
              <button 
                  onClick={handleJoin} 
                  className="mt-6 bg-green-600 hover:bg-green-700 p-4 rounded-full transition duration-300 transform hover:scale-105 shadow-2xl"
              >
                <Phone size={28} />
              </button>
            </div>
        )}
      </div>

  
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center justify-center gap-6 bg-gray-800 bg-opacity-80 backdrop-blur-sm px-8 py-3 rounded-full shadow-2xl">
        {!joined ? (
            <button onClick={handleJoin} className="hidden"></button>
        ) : (
          <>
    
            <button onClick={toggleAudio} className={`p-3 rounded-full transition duration-150 ${isAudioMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 hover:bg-gray-700'}`}>
              {isAudioMuted ? <MicOff size={24} /> : <Mic size={24} />}
            </button>
            
       
            <button onClick={toggleVideo} className={`p-3 rounded-full transition duration-150 ${isVideoOff ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 hover:bg-gray-700'}`}>
              {isVideoOff ? <VideoOff size={24} /> : <Video size={24} />}
            </button>
            
  
            <button onClick={handleLeave} className="bg-red-700 hover:bg-red-800 p-4 rounded-full transition duration-150 transform hover:scale-105">
              <Phone size={24} className="rotate-[135deg]" /> 
            </button>
       
            <button onClick={copyInviteLink} className="bg-blue-600 hover:bg-blue-700 p-3 rounded-full transition duration-150">
              <Link2 size={24} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default VideoCall;