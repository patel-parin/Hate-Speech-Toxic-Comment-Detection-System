
// src/pages/HomePage.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  ShieldCheckIcon,
  SparklesIcon,
  ChartBarIcon,
  ArrowRightIcon,
  CpuChipIcon,
  GlobeAltIcon,
  CodeBracketIcon,
  UserGroupIcon,
  ChatBubbleBottomCenterTextIcon,
} from "@heroicons/react/24/outline";
import Button from "../components/ui/Button";
import { useAuth } from "../hooks/useAuth";

// Animation variants  
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      duration: 0.5,
    },
  },
};

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const [quickText, setQuickText] = useState("");
  const navigate = useNavigate();

  const handleQuickAnalyze = () => {
    navigate("/analyzer", { state: { initialText: quickText } });
  };

  return (
    <div className="container mx-auto px-5 py-20 max-w-7xl text-white select-none">

      {/* ===================== HERO SECTION ===================== */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="text-center relative"
      >

        {/* Glow behind logo */}
        <div className="absolute inset-0 flex justify-center pointer-events-none">
          <div className="w-64 h-64 bg-blue-500/20 blur-3xl rounded-full animate-pulse-glow pointer-events-none"></div>
        </div>

        <motion.div
          variants={fadeUp}
          className="mx-auto w-28 h-28 mb-8 rounded-full 
                     bg-gradient-to-r from-blue-500 to-purple-600 
                     flex items-center justify-center shadow-xl
                     animate-float-slow"
        >
          <ShieldCheckIcon className="w-14 h-14 text-white" />
        </motion.div>

        <motion.h1
          variants={fadeUp}
          className="text-6xl md:text-7xl font-extrabold leading-tight"
        >
          Protect Your Community with
          <br />
          <span className="text-transparent bg-clip-text 
                           bg-gradient-to-r from-blue-400 to-purple-500">
            ToxiGuard AI
          </span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="text-xl text-white/80 max-w-3xl mx-auto mt-6"
        >
          AI-powered moderation that detects toxicity, hate speech, and insults — in real-time and across multiple languages.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={fadeUp}
          className="mt-10 flex flex-col sm:flex-row justify-center gap-4"
        >
          <Button
            variant="primary"
            size="lg"
            className="text-lg px-8 py-4 shadow-[0_0_25px_rgba(100,80,255,0.5)]"
          >
            <Link to={isAuthenticated ? "/analyzer" : "/register"}>
              <div className="flex items-center gap-2">
                {isAuthenticated ? "Go to Analyzer" : "Get Started Free"}
                <ArrowRightIcon className="w-5 h-5" />
              </div>
            </Link>
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={() =>
              document
                .getElementById("quick-analyzer")
                .scrollIntoView({ behavior: "smooth" })
            }
            className="text-lg px-8 py-4"
          >
            Try it Now ↓
          </Button>
        </motion.div>
      </motion.div>

      {/* ===================== 3 STEPS ===================== */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ amount: 0.3 }}
        className="mt-40"
      >
        <h2 className="text-4xl font-bold text-center mb-14">
          Get Started in <span className="text-blue-400">3 Simple Steps</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            {
              num: "1",
              icon: ChatBubbleBottomCenterTextIcon,
              title: "Paste Your Text",
              desc: "Enter any comment or message you want to analyze.",
            },
            {
              num: "2",
              icon: SparklesIcon,
              title: "Run the AI Analysis",
              desc: "Our model checks 6+ categories of toxic behavior.",
            },
            {
              num: "3",
              icon: ShieldCheckIcon,
              title: "Take Action",
              desc: "Use the results to moderate and stay safe.",
            },
          ].map((step, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="
                p-8 rounded-xl glass-card border border-white/10
                transition-all duration-300
                hover:scale-[1.04]
                card-hover-neon card-shine card-glow
              "
            >
              <div className="text-5xl font-bold text-blue-400 mb-4 text-center">
                {step.num}
              </div>
              <step.icon className="w-14 h-14 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-center">{step.title}</h3>
              <p className="text-white/70 text-center mt-2">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ===================== USE CASES ===================== */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ amount: 0.3 }}
        className="mt-40"
      >
        <h2 className="text-4xl font-bold text-center mb-12">
          A Moderation <span className="text-purple-400">Co-pilot</span> for Everyone
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div
            className="
              glass-card p-10 rounded-xl border border-white/10
              hover:scale-[1.04] transition-all duration-300
              card-hover-neon card-shine card-glow
            "
          >
            <UserGroupIcon className="w-12 h-12 text-purple-300 mb-4" />
            <h3 className="text-2xl font-semibold mb-2">For Community Managers</h3>
            <p className="text-white/70">
              Approve, reject, and review with clarity. Track trends & repeat offenders easily.
            </p>
          </div>

          <div
            className="
              glass-card p-10 rounded-xl border border-white/10
              hover:scale-[1.04] transition-all duration-300
              card-hover-neon card-shine card-glow
            "
          >
            <CodeBracketIcon className="w-12 h-12 text-blue-300 mb-4" />
            <h3 className="text-2xl font-semibold mb-2">For Developers</h3>
            <p className="text-white/70">
              Integrate ToxiGuard into your systems. API coming soon for instant moderation.
            </p>
          </div>
        </div>
      </motion.div>

      {/* ===================== QUICK ANALYZER ===================== */}
      <motion.div
        id="quick-analyzer"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ amount: 0.4 }}
        className="mt-40"
      >
        <div
          className="
            glass-card p-12 rounded-2xl border border-white/10
            transition-all duration-300 card-hover-neon card-shine card-glow
          "
        >
          <h2 className="text-4xl font-bold text-center mb-6">See It In Action</h2>
          <p className="text-center text-lg text-white/70 max-w-2xl mx-auto mb-8">
            Try any message below. This demo uses the same enterprise model.
          </p>

          <textarea
            value={quickText}
            onChange={(e) => setQuickText(e.target.value)}
            className="w-full h-36 p-4 rounded-lg bg-white/10 border border-white/20 
                       text-white resize-none focus:ring-4 ring-blue-500/30"
            placeholder="Try something like: 'You are the best!'"
          />

          <Button
            onClick={handleQuickAnalyze}
            disabled={!quickText.trim()}
            variant="primary"
            size="lg"
            className="mt-6 text-lg px-10"
          >
            Analyze Text
            <ArrowRightIcon className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </motion.div>

      {/* ===================== FEATURES ===================== */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ amount: 0.3 }}
        className="mt-40"
      >
        <h2 className="text-4xl font-bold text-center mb-12">
          Why Choose <span className="text-yellow-400">ToxiGuard?</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: CpuChipIcon,
              title: "Powerful AI Engine",
              desc: "Built on XLM-R for contextual accuracy and multilingual detection.",
              color: "text-blue-400",
            },
            {
              icon: GlobeAltIcon,
              title: "Multi-Language Support",
              desc: "English, Hindi, Hinglish — more languages coming soon.",
              color: "text-green-400",
            },
            {
              icon: ChartBarIcon,
              title: "Detailed Breakdown",
              desc: "Scores across toxic, severe toxic, obscene, threat, insult & identity hate.",
              color: "text-yellow-400",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="
                glass-card p-8 border border-white/10 rounded-xl
                transition-all duration-300 hover:scale-[1.04]
                card-hover-neon card-shine card-glow
              "
            >
              <item.icon className={`w-12 h-12 ${item.color} mb-4`} />
              <h3 className="text-2xl font-semibold">{item.title}</h3>
              <p className="text-white/70 mt-2">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ===================== TESTIMONIALS ===================== */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ amount: 0.3 }}
        className="mt-40"
      >
        <h2 className="text-4xl font-bold text-center mb-12">What Our Users Say</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              text: `"ToxiGuard filters out 99% of hate on our forums. Multi-language support is exactly what we needed."`,
              name: "Sarah K.",
              role: "Community Manager, TechForum",
            },
            {
              text: `"The dashboard overview is perfect. Saves us hours of manual moderation."`,
              name: "Alex J.",
              role: "Indie Developer",
            },
            {
              text: `"It catches nuanced insults our keyword filter never found."`,
              name: "David L.",
              role: "SaaS Product Lead",
            },
          ].map((t, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="
                glass-card p-10 rounded-xl border border-white/10 
                hover:scale-[1.04] transition-all duration-300
                card-hover-neon card-shine card-glow
              "
            >
              <blockquote className="italic text-white/80 mb-4">{t.text}</blockquote>
              <p className="font-semibold">{t.name}</p>
              <p className="text-blue-400 text-sm">{t.role}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ===================== CTA SECTION ===================== */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ amount: 0.4 }}
        className="mt-40"
      >
        <div
          className="
            relative p-16 text-center bg-white/5 backdrop-blur-xl 
            rounded-3xl border border-white/10 
            shadow-[0_0_40px_rgba(80,80,255,0.2)]
            card-hover-neon card-shine card-glow
            transition-all duration-300
          "
        >
          <div className="absolute -top-32 -left-32 w-80 h-80 bg-blue-600/20 blur-2xl rounded-full"></div>
          <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-purple-600/20 blur-2xl rounded-full"></div>

          <h2 className="text-5xl font-extrabold relative z-10 mb-6">
            Ready to build a safer community?
          </h2>

          <p className="text-xl text-white/70 max-w-2xl mx-auto mb-10 relative z-10">
            Start using our AI-powered moderation today — accurate, multilingual, lightning fast.
          </p>

          <Link to={isAuthenticated ? "/analyzer" : "/register"}>
            <Button
              variant="primary"
              size="lg"
              className="px-12 py-4 text-lg rounded-xl shadow-[0_0_30px_rgba(140,100,255,0.6)] hover:scale-110 transition"
            >
              Get Started Now
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </motion.div>

    </div>
  );
};

export default HomePage;
