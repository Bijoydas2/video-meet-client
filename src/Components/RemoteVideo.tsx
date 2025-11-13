import  { useEffect, useRef } from 'react';
import type { IRemoteUser } from 'agora-rtc-sdk-ng';
import { User } from 'lucide-react';

interface Props {
  user: IRemoteUser;
}

export default function RemoteVideo({ user }: Props) {
  const videoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user.videoTrack && videoRef.current) {
      user.videoTrack.play(videoRef.current);
    }

    return () => {
      if (user.videoTrack) user.videoTrack.stop();
    };
  }, [user.videoTrack]);

  return (
    <div className="relative w-full aspect-video bg-black rounded-md shadow-md overflow-hidden flex items-center justify-center">
      {(!user.videoTrack || user.videoTrack.isPlaying === false) && (
        <div className="flex flex-col items-center justify-center text-gray-400">
          <User size={48} />
          <span className="mt-2 text-sm">User {user.uid}</span>
        </div>
      )}
      <div ref={videoRef} className="w-full h-full absolute top-0 left-0" />
    </div>
  );
}
