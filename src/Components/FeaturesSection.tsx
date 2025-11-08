import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

type Feature = {
  title: string;
  desc: string;
};

const features: Feature[] = [
  { title: "Crystal Clear Video", desc: "High-definition video with adaptive bitrate streaming" },
  { title: "Real-Time Transcripts", desc: "Automatic speech-to-text transcription during meetings" },
  { title: "AI Summaries", desc: "Get intelligent summaries of meeting key points and action items" },
  { title: "Meeting History", desc: "Access past meetings, transcripts, and recordings anytime" },
  { title: "Team Analytics", desc: "Track meeting duration, participants, and engagement metrics" },
  { title: "Secure & Encrypted", desc: "End-to-end encryption for all your meetings and data" },
];

const FeaturesSection: React.FC = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000, 
      once: true, 
      easing: "ease-in-out",
    });
  }, []);

  return (
    <section id="features"  className="bg-primary/10 text-gray-800 py-20 px-6">
      <h2
        className="text-4xl font-bold text-center mb-12 text-black"
        data-aos="fade-up"
      >
        Powerful Features
      </h2>

      <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-8 max-w-7xl mx-auto">
        {features.map((f, i) => (
          <div
            key={i}
            className="card bg-base-100 border border-gray-200 shadow-md hover:shadow-xl transition transform hover:-translate-y-1"
            data-aos="zoom-in"
            data-aos-delay={i * 100} 
          >
            <div className="card-body">
              <h3 className="card-title text-lg font-semibold text-black mb-3">
                {f.title}
              </h3>
              <p className="text-gray-600">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
