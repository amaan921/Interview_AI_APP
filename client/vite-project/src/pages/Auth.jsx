import React, { useState, useEffect } from "react";
import { RiRobot2Fill } from "react-icons/ri";
import { IoSparkles, IoClose } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { motion, AnimatePresence } from "motion/react";
import { auth, provider } from "../utils/firebase";
import { signInWithPopup } from "firebase/auth";
import { ServerURL } from "../App";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "../redux/userSlice";
import HexagonBackground from "../components/HexagonBackground";
import { TbRobotFace } from "react-icons/tb";
import { CiMicrophoneOn } from "react-icons/ci";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { BsGraphUpArrow } from "react-icons/bs";
import { MdOutlineTimer } from "react-icons/md";
import { PiExam } from "react-icons/pi";

function Auth() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showSignIn, setShowSignIn] = useState(false);

  // Auto-show sign-in popup after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSignIn(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      icon: <TbRobotFace size={28} />,
      title: "AI-Powered Questions",
      description: "Smart questions tailored to your role, experience level, and uploaded resume.",
      color: "from-cyan-400 to-blue-500",
    },
    {
      icon: <CiMicrophoneOn size={28} />,
      title: "Voice-Based Interview",
      description: "Speak your answers naturally — just like a real interview with dynamic follow-ups.",
      color: "from-violet-400 to-purple-500",
    },
    {
      icon: <HiOutlineDocumentReport size={28} />,
      title: "Detailed PDF Report",
      description: "Get a downloadable report with scores, strengths, weaknesses, and tips.",
      color: "from-emerald-400 to-green-500",
    },
    {
      icon: <BsGraphUpArrow size={28} />,
      title: "Track Your Progress",
      description: "View history, compare past scores, and watch yourself improve over time.",
      color: "from-amber-400 to-orange-500",
    },
    {
      icon: <MdOutlineTimer size={28} />,
      title: "Timed Simulation",
      description: "Real interview pressure with timer-based sessions to build confidence.",
      color: "from-pink-400 to-rose-500",
    },
    {
      icon: <PiExam size={28} />,
      title: "Multi-Domain Support",
      description: "Practice for Frontend, Backend, Full Stack, Data Science, DevOps and more.",
      color: "from-teal-400 to-cyan-500",
    },
  ];

  const stats = [
    { value: "10K+", label: "Interviews Taken" },
    { value: "95%", label: "User Satisfaction" },
    { value: "50+", label: "Job Roles Supported" },
    { value: "24/7", label: "Available Anytime" },
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
        dispatch(
          setCurrentUser({
            name: displayName,
            email: email,
            credits: data.credits || 100,
          })
        );
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
      <div className="w-full min-h-screen overflow-y-auto">
        {/* ── Top Navigation ── */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            background: "rgba(10, 10, 10, 0.6)",
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
          className="sticky top-0 z-50 px-6 py-4"
        >
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-white text-black p-2 rounded-lg">
                <RiRobot2Fill size={20} />
              </div>
              <h1 className="text-xl font-bold text-white tracking-tight">
                InterviewIQ<span className="text-cyan-400">.AI</span>
              </h1>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSignIn(true)}
              className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-100 transition shadow-lg shadow-white/10"
            >
              <FcGoogle size={18} />
              Sign In
            </motion.button>
          </div>
        </motion.nav>

        {/* ── Hero Section ── */}
        <div className="max-w-7xl mx-auto px-6 pt-20 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-sm font-medium px-4 py-1.5 rounded-full mb-6"
            >
              <IoSparkles size={14} />
              AI-Powered Mock Interview Platform
            </motion.div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight mb-6">
              Crack Your Next Interview{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #22d3ee, #a78bfa, #34d399)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                with AI
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-400 leading-relaxed mb-10 max-w-2xl mx-auto">
              Practice with an AI interviewer that adapts to your role, asks smart follow-ups,
              evaluates your answers in real-time, and gives you a detailed performance report —
              all through voice.
            </p>

            <div className="flex gap-4 justify-center flex-wrap">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSignIn(true)}
                className="bg-white text-black px-8 py-3.5 rounded-full font-bold text-base hover:bg-gray-100 transition shadow-xl shadow-white/10 flex items-center gap-2"
              >
                <IoSparkles size={16} />
                Get Started — It's Free
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="border border-gray-600 text-gray-300 px-8 py-3.5 rounded-full font-semibold text-base hover:border-gray-400 hover:text-white transition"
              >
                See How It Works
              </motion.button>
            </div>
          </motion.div>

          {/* ── Stats Strip ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
          >
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl md:text-4xl font-extrabold text-white mb-1">{stat.value}</p>
                <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── Features Section ── */}
        <div id="features" className="max-w-7xl mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Everything You Need to{" "}
              <span className="text-cyan-400">Ace Your Interview</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Our AI doesn't just ask questions — it listens, adapts, and helps you
              improve with every session.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="p-6 rounded-2xl border border-gray-800 hover:border-gray-600 transition-all duration-300"
                style={{
                  background: "rgba(20, 20, 20, 0.6)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-4`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── How It Works ── */}
        <div className="max-w-7xl mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              How It <span className="text-cyan-400">Works</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Three simple steps to transform your interview preparation.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: "01",
                title: "Choose Your Role",
                desc: "Select your target job role, experience level, and upload your resume for personalized questions.",
              },
              {
                step: "02",
                title: "Start the Interview",
                desc: "Speak your answers naturally. The AI listens, asks smart follow-ups, and adapts difficulty in real-time.",
              },
              {
                step: "03",
                title: "Get Your Report",
                desc: "Receive a detailed PDF report with scores, feedback on each answer, and actionable improvement tips.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="text-center"
              >
                <div className="text-6xl font-black text-cyan-500/15 mb-2">{item.step}</div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── CTA Section ── */}
        <div className="max-w-7xl mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="text-center rounded-3xl p-12 border border-gray-800"
            style={{
              background:
                "linear-gradient(135deg, rgba(34,211,238,0.05) 0%, rgba(167,139,250,0.05) 50%, rgba(52,211,153,0.05) 100%)",
            }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Ace Your Next Interview?
            </h2>
            <p className="text-gray-400 mb-8 max-w-lg mx-auto">
              Join thousands of candidates who are leveling up their interview skills with AI.
              Start for free — no credit card required.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSignIn(true)}
              className="bg-white text-black px-8 py-3.5 rounded-full font-bold text-base hover:bg-gray-100 transition shadow-xl shadow-white/10 flex items-center gap-2 mx-auto"
            >
              <FcGoogle size={20} />
              Sign In with Google
            </motion.button>
          </motion.div>
        </div>

        {/* ── Footer ── */}
        <div className="border-t border-gray-800 mt-10">
          <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <RiRobot2Fill size={16} />
              <span>InterviewIQ.AI — Built with ❤️ for job seekers</span>
            </div>
            <p className="text-gray-600 text-sm">© 2026 InterviewIQ.AI. All rights reserved.</p>
          </div>
        </div>
      </div>

      {/* ── Sign In Slide-in Panel ── */}
      <AnimatePresence>
        {showSignIn && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSignIn(false)}
              className="fixed inset-0 z-[60]"
              style={{ background: "rgba(0,0,0,0.5)" }}
            />

            {/* Panel */}
            <motion.div
              key="panel"
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-full max-w-md z-[70] flex items-center p-6"
            >
              <div
                className="w-full rounded-3xl p-8 border border-gray-700 shadow-2xl relative"
                style={{
                  background: "rgba(15, 15, 15, 0.95)",
                  backdropFilter: "blur(20px)",
                }}
              >
                {/* Close */}
                <button
                  onClick={() => setShowSignIn(false)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-white transition p-1 rounded-full hover:bg-gray-800"
                >
                  <IoClose size={20} />
                </button>

                {/* Logo */}
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className="bg-white text-black p-2 rounded-lg">
                    <RiRobot2Fill size={18} />
                  </div>
                  <h2 className="font-bold text-lg text-white">
                    InterviewIQ<span className="text-cyan-400">.AI</span>
                  </h2>
                </div>

                {/* Title */}
                <h3 className="text-2xl md:text-3xl font-bold text-center text-white leading-snug mb-3">
                  Get Started with{" "}
                  <span className="inline-flex items-center gap-1.5 bg-cyan-500/15 text-cyan-400 px-3 py-1 rounded-full text-lg">
                    <IoSparkles size={14} />
                    AI Interview
                  </span>
                </h3>

                <p className="text-center text-gray-400 mb-8 text-sm leading-relaxed">
                  Sign in with your Google account to start practicing interviews
                  and unlock the full power of AI-driven preparation.
                </p>

                {/* Google Sign In */}
                <motion.button
                  onClick={handleGoogleAuth}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full bg-white text-black py-3.5 rounded-xl font-semibold hover:bg-gray-100 transition flex items-center justify-center gap-2 shadow-lg"
                >
                  <FcGoogle size={22} />
                  Continue with Google
                </motion.button>

                {/* Divider */}
                <div className="flex items-center gap-3 my-6">
                  <div className="flex-1 h-px bg-gray-800" />
                  <span className="text-xs text-gray-600 uppercase tracking-wider">What you get</span>
                  <div className="flex-1 h-px bg-gray-800" />
                </div>

                {/* Mini features */}
                <div className="space-y-3">
                  {[
                    "100 free credits to start",
                    "AI-powered voice interviews",
                    "Detailed PDF performance reports",
                    "Track progress over time",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-cyan-500/15 flex items-center justify-center flex-shrink-0">
                        <IoSparkles size={10} className="text-cyan-400" />
                      </div>
                      <span className="text-sm text-gray-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </HexagonBackground>
  );
}

export default Auth;