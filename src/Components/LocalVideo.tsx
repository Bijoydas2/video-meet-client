import { useEffect, useRef } from 'react';
import type { ILocalAudioTrack, ILocalVideoTrack } from 'agora-rtc-sdk-ng';
import { User } from 'lucide-react';

interface Props {
  tracks: (ILocalAudioTrack | ILocalVideoTrack)[];
  isVideoOff: boolean;
}

export default function LocalVideo({ tracks, isVideoOff }: Props) {
  const videoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const videoTrack = tracks[1] as ILocalVideoTrack;
    if (videoTrack && videoRef.current) {
      if (!isVideoOff) {
        videoTrack.play(videoRef.current);
      } else {
        videoTrack.stop();
      }
    }

    return () => {
      if (videoTrack) videoTrack.stop();
    };
  }, [tracks, isVideoOff]);

  return (
    <div
      ref={videoRef}
      className="relative w-full aspect-video bg-black rounded-md shadow-md overflow-hidden flex items-center justify-center"
    >
      {isVideoOff && (
        <div className="flex flex-col items-center justify-center text-gray-400">
          <User size={48} />
          <span className="mt-2 text-sm">You</span>
        </div>
      )}
    </div>
  );
}
