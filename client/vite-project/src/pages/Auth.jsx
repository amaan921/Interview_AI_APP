import React from "react";
import { RiRobot2Fill } from "react-icons/ri";
import { IoSparkles } from "react-icons/io5";
import { motion } from "motion/react";
import { FcGoogle } from "react-icons/fc";
import { auth, provider } from "../utils/firebase";
import { signInWithPopup } from "firebase/auth";
import { ServerURL } from "../App";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "../redux/userSlice";
import HexagonBackground from "../components/HexagonBackground";

function Auth() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const services = [
    {
      icon: "🎤",
      title: "Smart Voice Interview",
      description: "Dynamic follow-up questions based on your answers"
    },
    {
      icon: "📊",
      title: "Real-time Analysis",
      description: "Instant feedback on communication and technical accuracy"
    },
    {
      icon: "📄",
      title: "Resume Integration",
      description: "Project-specific questions based on your background"
    },
    {
      icon: "📈",
      title: "Performance Tracking",
      description: "Detailed analytics and improvement insights"
    }
  ];

  const handleGoogleAuth = async () => {
    try {
      const response = await signInWithPopup(auth, provider);
      let user = response.user;
      const { displayName, email } = user;
      const res = await axios.post(
        ServerURL + "/api/auth/google",
        { name: displayName, email },
        { withCredentials: true }
      );
      const data = res.data;
      if (res.status === 200) {
        dispatch(setCurrentUser({
          name: displayName,
          email: email,
          credits: data.credits || 100
        }));
        navigate("/");
      } else {
        console.error("Authentication failed:", data);
      }
    } catch (error) {
      console.error("Google Sign-In Error:", error);
    }
  };

  return (
    <HexagonBackground>
      <div className="w-full min-h-screen flex items-center justify-center px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.05, ease: "easeOut" }}
          className="w-full max-w-md p-8 rounded-3xl bg-white shadow-2xl border border-gray-200 transition-all duration-300"
        >

          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="bg-black text-white p-2 rounded-lg">
              <RiRobot2Fill size={15} />
            </div>
            <h2 className="font-semibold text-lg">InterviewIQ.AI</h2>
          </div>


          <h1 className="text-2xl md:text-3xl font-bold text-center leading-snug mb-4">
            Continue with{" "}
            <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full inline-flex items-center gap-2">
              <IoSparkles size={16} />
              AI Smart Interview
            </span>
          </h1>


          <p className="text-center text-gray-500 mb-8 md:text-base leading-relaxed">
            Sign in with your Google account to continue and unlock the power of AI
            for your interview preparation.
          </p>


          <motion.button
            onClick={handleGoogleAuth}
            whileHover={{ opacity: 0.9, scale: 1.03 }}
            whileTap={{ opacity: 1, scale: 0.98 }}
            className="w-full bg-black text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition flex items-center justify-center gap-2">
            <FcGoogle size={20} />
            Continue with Google
          </motion.button>
        </motion.div>
      </div>
    </HexagonBackground>
  );
}

export default Auth;