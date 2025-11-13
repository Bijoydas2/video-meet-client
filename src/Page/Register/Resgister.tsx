import React, { useState, type ChangeEvent, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";
import { AuthContext } from "../../Context/AuthProvider";
import SocialLogin from "../../Components/SocialLogin";
import registerLottie from "../../assets/Lotties/Register.json";
import Lottie from "lottie-react";

interface FormData {
  name: string;
  email: string;
  password: string;
}

const Register: React.FC = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) throw new Error("AuthContext is undefined"); 
  const { signup, updateUserProfile } = authContext;

  const location = useLocation();
  const navigate = useNavigate();
  const from = (location.state as any)?.from?.pathname || "/";

  const {
    register: formRegister,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const [profilePic, setProfilePic] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const image = e.target.files?.[0];
    if (!image) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("image", image);

    try {
      const imageUploadUrl = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`;
      const res = await axios.post(imageUploadUrl, formData);
      setProfilePic(res.data.data.url);
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("Image upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const { name, email, password } = data;

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
    if (!passwordRegex.test(password)) {
      toast.error(
        "Password must be at least 6 characters and include one uppercase and one lowercase letter."
      );
      return;
    }

    if (!profilePic) {
      toast.error("Please upload your profile picture.");
      return;
    }

    try {
      const user = await signup(email, password);
      if (!user) throw new Error("User creation failed.");

      await updateUserProfile({
        displayName: name,
        photoURL: profilePic,
      });

      await axios.post(`${import.meta.env.VITE_API_URL}/users`, {
        email,
        name,
        photoURL: profilePic,
        created_at: new Date().toISOString(),
        last_log_in: new Date().toISOString(),
      }
  
    );

      toast.success("Account created successfully!");
      reset();
      navigate(from, { replace: true });
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(`Registration failed: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center px-6 py-16 mt-16 bg-primary/10">
      <title>Register</title>
      <div className="w-full max-w-sm md:max-w-md">
        <Lottie animationData={registerLottie} loop />
      </div>

      <div className="bg-white shadow-2xl rounded-xl p-8 w-full max-w-xl md:ml-10">
        <h2 className="text-3xl font-extrabold text-center text-primary mb-4">
          Create an Account for <span className="text-secondary font-bold">Video Meet</span>
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Connect, collaborate, and communicate smarter with Video Meet.
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Full Name */}
          <div className="mb-4">
            <label className="block text-sm text-gray-700 font-medium mb-1">Full Name</label>
            <input
              type="text"
              {...formRegister("name", { required: "Name is required" })}
              placeholder="Enter Your Name"
              className="w-full px-4 py-2 border text-gray-700 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm text-gray-700 font-medium mb-1">Email</label>
            <input
              type="email"
              {...formRegister("email", { required: "Email is required" })}
              placeholder="Enter Your Email"
              className="w-full px-4 py-2 border text-gray-700 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-sm text-gray-700 font-medium mb-1">Password</label>
            <input
              type="password"
              {...formRegister("password", { required: "Password is required" })}
              placeholder="Password"
              className="w-full px-4 py-2 border text-gray-700 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-xs text-gray-500 mt-1">Min 6 chars, 1 uppercase, 1 lowercase</p>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          {/* Profile Picture */}
          <div className="mb-6">
            <label className="block text-sm text-gray-700 font-medium mb-1">Profile Picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full px-4 py-2 border text-gray-700 border-gray-300 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0A7EA4]"
              disabled={uploading}
            />
            {uploading && <p className="text-sm text-blue-600 mt-1">Uploading image...</p>}
            {profilePic && (
              <img
                src={profilePic}
                alt="Profile Preview"
                className="mt-2 w-24 h-24 object-cover rounded-full border"
              />
            )}
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="btn bg-primary w-full text-white hover:bg-white hover:text-primary border-2 border-primary px-6 py-3 rounded-lg transition duration-300 text-center"
          >
            Register
          </button>
        </form>

        <SocialLogin />

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
