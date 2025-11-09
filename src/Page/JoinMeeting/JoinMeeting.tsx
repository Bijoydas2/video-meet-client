import { useEffect } from "react";
import { Play, Download, Trash2, Users, Clock, Video } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function JoinMeeting() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const meetings = [
    { title: "Q1 Planning Meeting", date: "11/7/2025 at 2:00 PM", participants: 8, duration: "1h 30m" },
    { title: "Design Review", date: "11/6/2025 at 10:30 AM", participants: 5, duration: "45m" },
    { title: "Team Standup", date: "11/5/2025 at 9:00 AM", participants: 12, duration: "30m" },
    { title: "Client Presentation", date: "11/4/2025 at 3:00 PM", participants: 6, duration: "1h" },
    { title: "Engineering Sync", date: "11/3/2025 at 1:00 PM", participants: 10, duration: "55m" },
  ];

  return (
    <div className="min-h-screen bg-black text-white pt-28 px-6 md:px-20" data-aos="fade-up">
      {/* Header Buttons */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10">
        <button className="btn btn-primary w-full md:w-auto">+ Start New Meeting</button>
        <button className="btn btn-outline w-full md:w-auto">📅 Schedule Meeting</button>
      </div>

      {/* Stats Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
      <div className="card bg-neutral text-gray-200 shadow-lg p-6 flex items-center gap-4 hover:scale-105 transition-all duration-300">
        <div className="bg-blue-500/20 p-4 rounded-full">
          <Video className="text-blue-400 w-8 h-8" />
        </div>
        <div className="text-center">
          <p className="text-gray-400 text-sm">Total Meetings</p>
          <h2 className="text-2xl font-bold text-white">24</h2>
        </div>
      </div>

    
      <div className="card bg-neutral text-gray-200 shadow-lg p-6 flex items-center gap-4 hover:scale-105 transition-all duration-300">
        <div className="bg-red-500/20 p-4 rounded-full">
          <Clock className="text-red-400 w-8 h-8" />
        </div>
        <div className="text-center">
          <p className="text-gray-400 text-sm">Total Duration</p>
          <h2 className="text-2xl font-bold text-white">48h 30m</h2>
        </div>
      </div>

 
      <div className="card bg-neutral text-gray-200 shadow-lg p-6 flex items-center gap-4 hover:scale-105 transition-all duration-300">
        <div className="bg-purple-500/20 p-4 rounded-full">
          <Users className="text-purple-400 w-8 h-8" />
        </div>
        <div className="text-cen">
          <p className="text-gray-400 text-sm">Participants</p>
          <h2 className="text-2xl font-bold text-white">156</h2>
        </div>
      </div>
    </div>

      {/* Meeting History */}
      <h2 className="text-3xl font-bold mb-2">Meeting History</h2>
      <p className="text-gray-400 mb-6">Access your past meetings, recordings, and transcripts</p>

      <div className="space-y-4">
        {meetings.map((meeting, index) => (
          <div key={index} className="card bg-neutral hover:bg-gray-800 transition p-5 flex flex-col md:flex-row md:items-center justify-between" data-aos="fade-up" data-aos-delay={index * 100}>
            <div>
              <h3 className="font-semibold text-lg">{meeting.title}</h3>
              <p className="text-sm text-gray-400">{meeting.date}</p>
              <p className="text-sm text-gray-400 flex items-center gap-3 mt-1">
                <Users size={14} /> {meeting.participants} participants
                <Clock size={14} /> {meeting.duration}
              </p>
            </div>
            <div className="flex gap-3 mt-4 md:mt-0">
              <button className="btn btn-sm btn-outline">▶ Replay</button>
              <button className="btn btn-sm btn-outline">⬇ Download</button>
              <button className="btn btn-sm btn-error text-white">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
