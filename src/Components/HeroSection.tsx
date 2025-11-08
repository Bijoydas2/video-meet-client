export default function HeroSection() {
  return (
    <section
      className="relative h-[80vh] flex items-center md:mt-16 mt-10 px-6"
      style={{
        backgroundImage: "url('https://i.ibb.co.com/RT6T3KBz/Screenshot-2025-11-08-195217.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      
      <div className="absolute inset-0 bg-black/60"></div>

      
      <div className="relative w-full mx-auto  text-center md:text-left text-white z-10 px-6 ">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
          Collaborate smarter <br />
          with <span className="text-blue-400">AI-powered insights</span>
        </h1>
        <p className="text-lg max-w-2xl text-gray-300 mb-8">
          Video Meet unites your team with crystal-clear calls, real-time transcripts,
          and AI summaries to boost productivity.
        </p>
        <div className="flex gap-4">
          <button className="btn btn-primary">Start Free Trial</button>
          <button className="btn btn-outline text-white hover:text-black">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
}
