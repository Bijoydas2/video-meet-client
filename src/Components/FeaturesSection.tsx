const features = [
  { title: "Crystal Clear Video", desc: "High-definition video with adaptive bitrate streaming" },
  { title: "Real-Time Transcripts", desc: "Automatic speech-to-text transcription during meetings" },
  { title: "AI Summaries", desc: "Get intelligent summaries of meeting key points and action items" },
  { title: "Meeting History", desc: "Access past meetings, transcripts, and recordings anytime" },
  { title: "Team Analytics", desc: "Track meeting duration, participants, and engagement metrics" },
  { title: "Secure & Encrypted", desc: "End-to-end encryption for all your meetings and data" },
];

export default function FeaturesSection() {
  return (
    <section className="bg-black/95 text-white py-20 px-6">
      <h2 className="text-4xl font-bold text-center mb-12">Powerful Features</h2>
      <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {features.map((f, i) => (
          <div key={i} className="p-6 border border-gray-800 bg-neutral rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-8">{f.title}</h3>
            <p className="text-gray-400">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
