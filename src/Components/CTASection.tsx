import React from "react";

const CTASection: React.FC = () => {
  return (
    <section className="relative bg-gradient-to-r from-blue-600 via-indigo-700 to-blue-800 text-white h-[70vh] flex items-center overflow-hidden">
      
      <img
        src="https://i.ibb.co.com/tPp2JMfH/pexels-tima-miroshnichenko-5685961.jpg"
        alt="Video call illustration"
        className="absolute left-0 bottom-0 w-48 md:w-64 rounded-tr-2xl animate-fadeInUp"
      />
      <img
        src="https://i.ibb.co.com/TBfX56jD/pexels-ivan-s-4240503.jpg"
        alt="AI assistant illustration"
        className="absolute  right-0 top-0 w-48 md:w-64 rounded-bl-2xl animate-fadeInDown"
      />


      <div className="absolute inset-0 bg-black/40"></div>


      <div className="relative z-10 max-w-6xl mx-auto text-center md:text-left px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-10">
     
        <div className="max-w-xl">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Empower your team with smarter meetings
          </h2>
          <p className="text-gray-200 text-lg mb-8">
            Experience the next generation of collaboration with <span className="font-semibold text-white">Video Meet</span> — powered by AI, designed for productivity.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button className="btn bg-white text-primary font-semibold border-none hover:bg-gray-100">
              Start Free Trial
            </button>
            <button className="btn btn-outline border-white text-white hover:bg-white hover:text-primary">
              Learn More
            </button>
          </div>
        </div>

        <div className="hidden md:block">
          <img
            src="https://i.ibb.co.com/20dD5hYk/pexels-diva-plavalaguna-6147014.jpg"
            alt="Team collaboration illustration"
            className="w-80 rounded shadow-lg"
          />
        </div>
      </div>
    </section>
  );
};

export default CTASection;
