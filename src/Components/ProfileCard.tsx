import { useContext, useEffect, useState } from "react";
import { FaEnvelope, FaClock } from "react-icons/fa";
import axios from "axios";
import Loading from "./Loading";
import { AuthContext } from "../Context/AuthProvider";

interface UserProfile {
  name: string;
  email: string;
  photoURL?: string;
  last_log_in?: string;
}

const ProfileCard: React.FC = () => {
  const authContext = useContext(AuthContext);
  const authUser = authContext?.user; // safely access user
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!authUser?.email) return;

      try {
        const { data } = await axios.get<UserProfile>(
          `${import.meta.env.VITE_API_URL}/users/${encodeURIComponent(authUser.email)}`
        );
        setUser(data);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [authUser?.email]);

  if (loading) return <Loading />;

  if (!user)
    return <p className="text-center text-red-500 mt-10">Profile not found</p>;

  return (
    <div className="max-w-4xl mx-auto mt-30 py-16 bg-gradient-to-r from-blue-50 to-white shadow-xl rounded-2xl overflow-hidden">
      <div className="p-6 text-center">
        {/* Profile Picture */}
        <div className="w-32 h-32 mx-auto rounded-full border-4 border-primary overflow-hidden shadow-md">
          <img
            src={user.photoURL || "/default-avatar.png"}
            alt={user.name || "User"} 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Name */}
        <button className="mt-6 px-6 py-2 bg-primary hover:bg-primary text-white font-semibold rounded-full shadow-md transition-all">
          {user.name}
        </button>

        {/* Email */}
        <div className="mt-3 flex items-center justify-center gap-2 text-gray-600">
          <FaEnvelope className="text-primary" />
          <p className="text-sm break-words">{user.email}</p>
        </div>

        {/* Last Login */}
        <div className="mt-2 flex items-center justify-center gap-2 text-gray-600">
          <FaClock className="text-primary" />
          <p className="text-sm">
            {user.last_log_in
              ? new Date(user.last_log_in).toLocaleString("en-BD", {
                  hour12: true,
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
