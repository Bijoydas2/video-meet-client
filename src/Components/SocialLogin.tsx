import React, { useContext } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { AuthContext } from "../Context/AuthProvider";

interface SocialLoginProps {
  from?: string;
}

const SocialLogin: React.FC<SocialLoginProps> = ({ from = "/" }) => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  if (!authContext) {
    throw new Error("SocialLogin must be used within AuthProvider");
  }

  const { googleLogin } = authContext;

  const handleGoogleLogin = async () => {
    try {
      const user = await googleLogin(); 

      if (!user?.email) {
        toast.error("Google login failed. Email not found.");
        return;
      }

      const userInfo = {
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        created_at: new Date().toISOString(),
        last_log_in: new Date().toISOString(),
      };

      // Save user to DB
      await fetch(`${import.meta.env.VITE_API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userInfo),
      });

      toast.success("Account created successfully!");
      navigate(from, { replace: true });
    } catch (error: any) {
      console.error("Google login or user save failed:", error);
      toast.error("Login failed: " + (error.message || error));
    }
  };

  return (
    <div className="mt-4 text-center">
      <p className="text-sm text-gray-600">Or login with</p>
      <button
        onClick={handleGoogleLogin}
        className="btn w-full mt-2 bg-white text-black border-[#e5e5e5] flex items-center justify-center gap-2"
      >
        <svg
          aria-label="Google logo"
          width="16"
          height="16"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <g>
            <path d="M0 0H512V512H0" fill="#fff"></path>
            <path
              fill="#34a853"
              d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
            ></path>
            <path
              fill="#4285f4"
              d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
            ></path>
            <path
              fill="#fbbc02"
              d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"
            ></path>
            <path
              fill="#ea4335"
              d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
            ></path>
          </g>
        </svg>
        Login with Google
      </button>
    </div>
  );
};

export default SocialLogin;
