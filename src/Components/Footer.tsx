import logo from "../assets/video.png";

export default function Footer() {
  return (
    <footer className="bg-black text-gray-400 py-12 px-6">
      <div className="max-w-7xl mx-auto grid sm:grid-cols-2 md:grid-cols-4 gap-10">
        
        
        <div>
          <div className="flex items-center mb-3">
            <img src={logo} alt="Video Meet Logo" className="w-8 h-8" />
            <h4 className="text-white font-bold text-lg ml-2">Video Meet</h4>
          </div>
          <p className="text-sm leading-relaxed">
            Professional video conferencing for modern teams. Connect, collaborate, and share ideas seamlessly.
          </p>
        </div>

        
        <div>
          <h4 className="text-white font-semibold mb-3">Product</h4>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white cursor-pointer">Features</li>
            <li className="hover:text-white cursor-pointer">Pricing</li>
            <li className="hover:text-white cursor-pointer">Security</li>
          </ul>
        </div>

       
        <div>
          <h4 className="text-white font-semibold mb-3">Company</h4>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white cursor-pointer">About</li>
            <li className="hover:text-white cursor-pointer">Blog</li>
            <li className="hover:text-white cursor-pointer">Careers</li>
          </ul>
        </div>

        
        <div>
          <h4 className="text-white font-semibold mb-3">Legal</h4>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white cursor-pointer">Privacy</li>
            <li className="hover:text-white cursor-pointer">Terms</li>
            <li className="hover:text-white cursor-pointer">Contact</li>
          </ul>
        </div>
      </div>

     
      <div className="border-t border-gray-800 mt-10 pt-5 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} <span className="text-white font-medium">Video Meet</span>. All rights reserved.
      </div>
    </footer>
  );
}
