export default function HeroSection() {
  return (
    <section className="bg-black text-white text-center md:mt-16 mt-10 py-24 px-6">
      <h1 className="text-4xl md:text-6xl font-bold mb-6">
        Meet, collaborate, and connect <br /> 
        with <span className="text-blue-400">AI-powered insights</span>
      </h1>
      <p className="text-lg max-w-2xl mx-auto text-gray-400 mb-8">
        Video Meet brings your team together with crystal-clear video, real-time transcripts, 
        and AI-generated summaries to boost productivity.
      </p>
      <div className="flex justify-center gap-4">
        <button className="btn btn-primary">Start Free Trial</button>
        <button className="btn btn-outline text-white hover:text-black">Learn More</button>
      </div>
    </section>
  );
}
