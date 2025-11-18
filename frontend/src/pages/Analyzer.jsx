// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheckIcon, SparklesIcon, ClockIcon, ChartBarIcon, ExclamationTriangleIcon, ArrowPathIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth'; // Import useAuth
import { Link, useLocation } from 'react-router-dom';

// Components
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ToxicityMeter from '../components/charts/ToxicityMeter';
import AIAnalysisLoader from '../components/common/AIAnalysisLoader';
import AnalysisComplete from '../components/common/AnalysisComplete';

// Services
import api from '../services/api'; // Use the central api instance

const Analyzer = () => {
    const location = useLocation();
    const [text, setText] = useState(location.state?.initialText || '');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [results, setResults] = useState(null);
    const [analysisTime, setAnalysisTime] = useState(0);
    const [stats, setStats] = useState({ total: 0, toxic: 0 });
    const [isLoadingExample, setIsLoadingExample] = useState(false);
    const { isAuthenticated, freeTrialsUsed, incrementFreeTrials, getRemainingTrials, canAnalyze } = useAuth();
    const { user } = useAuth();


    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/predict/stats');
                setStats({
                    total: data.totalAnalyzed,
                    toxic: data.toxicDetected
                });
            } catch (error) {
                console.error("Failed to fetch stats:", error);
            }
        };
        fetchStats();
    }, []);
    const handleKeyDown = (e) => {
    // Check if Enter key is pressed AND Shift key is NOT pressed
    if (e.key === 'Enter' && !e.shiftKey) {
      // 1. Prevent the default behavior (don't add a new line)
      e.preventDefault();

      // 2. Check if we're in a state to analyze
      if (!isAnalyzing && text.trim() && canAnalyze()) {
        // 3. Run the analysis
        handleAnalyze();
      }
    }
  };

    const handleAnalyze = async () => {
        if (!text.trim()) {
            toast.error('Please enter some text to analyze');
            return;
        }

        if (!canAnalyze()) {
            toast.error('Free trial limit reached. Please login to continue analyzing.');
            return;
        }

        setIsAnalyzing(true);
        const startTime = Date.now();

        try {
            const payload = { text };
            const { data: analysisResults } = await api.post('/predict', payload);

            const endTime = Date.now();

            setResults(analysisResults);
            setAnalysisTime(((endTime - startTime) / 1000).toFixed(2));

            // Increment free trials if user is not logged in
            if (!isAuthenticated) {
                const newCount = incrementFreeTrials();
                if (newCount >= 2) {
                    toast.success('Analysis completed! You have used all free trials. Please login to continue.');
                } else {
                    toast.success(`Analysis completed! You have ${2 - newCount} free trial${2 - newCount === 1 ? '' : 's'} remaining.`);
                }
            } else {
                toast.success('Analysis completed successfully!');
            }

            // If a user is logged in, their analysis was saved, so we should refresh the stats.
            if (isAuthenticated) {
                const { data } = await api.get('/predict/stats');
                setStats({ total: data.totalAnalyzed, toxic: data.toxicDetected });
            }

        } catch (error) {
            toast.error(error?.response?.data?.message || 'Analysis failed. Please try again.');
            console.error('Analysis error:', error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleClear = () => {
        setText('');
        setResults(null);
        setAnalysisTime(0);
    };

    const loadExample = async () => {
        setIsLoadingExample(true);
        try {
            const { data } = await api.get('/predict/example');
            setText(data.comment_text);
            setResults(null); // Clear previous results
        } catch (error) {
            toast.error('Could not load example. Please try again.');
            console.error("Failed to load example:", error);
        } finally {
            setIsLoadingExample(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const remainingTrials = getRemainingTrials();

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            {/* Hero Section */}
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="text-center mb-12"
            >
                <motion.div variants={itemVariants} className="flex justify-center items-center mb-6">
                    <div className="relative">
                        <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center animate-float">
                            <ShieldCheckIcon className="w-10 h-10 text-white" />
                        </div>
                        <div className="absolute inset-0 w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse opacity-70"></div>
                    </div>
                </motion.div>

                <motion.h1 variants={itemVariants} className="text-5xl md:text-6xl font-bold text-white mb-4">
                    ToxiGuard{' '}
                    <span className="text-yellow-400 animate-pulse">AI</span>
                </motion.h1>

                <motion.p variants={itemVariants} className="text-xl text-white/90 mb-2">
                    Advanced AI-powered toxic speech detection system
                </motion.p>

                <motion.p variants={itemVariants} className="text-sm text-white/70 uppercase tracking-wider font-medium">
                    Smart Content Moderation
                </motion.p>

                {/* Free Trial Counter */}
                {!isAuthenticated && (
                    <motion.div variants={itemVariants} className="mt-4">
                        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                            <LockClosedIcon className="w-4 h-4 text-yellow-400" />
                            <span className="text-white text-sm">
                                Free Trials: {remainingTrials}/2 remaining
                            </span>
                        </div>
                        {remainingTrials === 0 && (
                            <div className="mt-2">
                                <Link
                                    to="/login"
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Login to Continue
                                </Link>
                            </div>
                        )}
                    </motion.div>
                )}
            </motion.div>

            {/* Main Analyzer Card */}
            <motion.div
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className="mb-8"
            >
                <div className="glass-card p-8 rounded-2xl">
                    <div className="mb-6">
                        <label className="block text-lg font-semibold text-white mb-4">
                            <SparklesIcon className="w-6 h-6 inline-block mr-2 text-blue-400" />
                            Enter text to analyze for toxicity
                        </label>

                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="w-full h-40 p-4 border-2 border-white/20 rounded-lg focus:border-blue-400 focus:ring-4 focus:ring-blue-400/20 transition-all duration-300 resize-none text-white placeholder-white/60 bg-white/10 backdrop-blur-sm"
                            placeholder="Type or paste your text here to check for toxic content... (Supports English, Hindi, and Hinglish)"
                            disabled={isAnalyzing || !canAnalyze()}
                        />

                        <div className="flex justify-between items-center mt-2">
                            <span className="text-sm text-white/70">
                                {text.length} characters
                            </span>
                            {text.length > 500 && (
                                <span className="text-sm text-orange-400">
                                    Long texts may take more time to analyze
                                </span>
                            )}
                        </div>

                        {/* Language Support Info */}
                        {/* <div className="mt-2 text-xs text-white/60">
              💡 Supports: English, Hindi, Hinglish (mixed language)
            </div> */}
                    </div>

                    <div className="flex flex-wrap gap-3 mb-6">
                        <Button
                            onClick={handleAnalyze}
                            disabled={isAnalyzing || !text.trim() || !canAnalyze()}
                            className="flex-1 sm:flex-none"
                            variant="primary"
                        >
                            {isAnalyzing ? (
                                <LoadingSpinner className="w-4 h-4 mr-2" />
                            ) : (
                                <ShieldCheckIcon className="w-4 h-4 mr-2" />
                            )}
                            {isAnalyzing ? 'Analyzing...' : 'Analyze Text'}
                        </Button>

                        <Button
                            onClick={handleClear}
                            variant="secondary"
                            disabled={isAnalyzing || isLoadingExample}
                        >
                            Clear
                        </Button>

                        <Button
                            onClick={loadExample}
                            variant="outline"
                            disabled={isAnalyzing || isLoadingExample}
                        >
                            {isLoadingExample ? (
                                <LoadingSpinner className="w-4 h-4 mr-2" />
                            ) : (
                                <ArrowPathIcon className="w-4 h-4 mr-2" />
                            )}
                            {isLoadingExample ? 'Loading...' : 'Load Example'}
                        </Button>
                    </div>

                    {/* Trial Limit Warning */}
                    {!isAuthenticated && remainingTrials === 0 && (
                        <div className="mb-4 p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                            <div className="flex items-center space-x-2 text-yellow-400">
                                <LockClosedIcon className="w-5 h-5" />
                                <span className="font-medium">Free trial limit reached</span>
                            </div>
                            <p className="text-yellow-300 text-sm mt-1">
                                You've used all 2 free analyses. Please login or register to continue using the service.
                            </p>
                            <div className="mt-3 flex space-x-3">
                                <Link
                                    to="/login"
                                    className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                                >
                                    Register
                                </Link>
                            </div>
                        </div>
                    )}

                    {isAnalyzing && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <AIAnalysisLoader />
                        </motion.div>
                    )}
                    {results && !isAnalyzing && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="space-y-6"
                        >
                            {/* Analysis Complete Screen */}
                            <AnalysisComplete
                                text={text}
                                categories={results.categories}
                                overallScore={results.overallScore}
                                processingTime={analysisTime}
                                wordCount={text.split(' ').length}
                            />

                            {/* Detailed Results */}
                            <div className="glass-card rounded-lg p-6 border border-white/20">
                                <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                                    <h3 className="text-xl font-semibold text-white flex items-center">
                                        <ShieldCheckIcon className="w-6 h-6 mr-2 text-blue-400" />
                                        Detailed Analysis Results
                                    </h3>

                                    <div className="flex items-center text-sm text-white/70">
                                        <ClockIcon className="w-4 h-4 mr-1" />
                                        {analysisTime}s processing time
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <ToxicityMeter score={results.overallScore / 100} />
                                </div>

                                {/* Simple text display */}
                                <div className="glass-card p-4 mb-6 border border-white/20">
                                    <h4 className="font-medium text-white mb-2">Analyzed Text:</h4>
                                    <p className="text-white/80 italic">
                                        "{text.length > 200 ? `${text.substring(0, 200)}...` : text}"
                                    </p>
                                </div>

                                <div>
                                    <h4 className="font-medium text-white mb-4">Category Breakdown:</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {Object.entries(results.categories).map(([category, score]) => {
                                            const percentage = Math.round(score);

                                            let colorClass = 'text-green-400 bg-green-400/20';
                                            if (percentage > 75) {
                                                colorClass = 'text-red-400 bg-red-400/20';
                                            } else if (percentage > 40) {
                                                colorClass = 'text-yellow-400 bg-yellow-400/20';
                                            }

                                            return (
                                                <div key={category} className="bg-slate-800 p-4 text-center border border-white/20 rounded-lg">
                                                    {/* --- ALSO IMPROVED THIS LINE FOR BETTER VISIBILITY --- */}
                                                    <div className="font-bold text-gray-100 mb-3 capitalize">
                                                        {category.replace(/_/g, ' ')}
                                                    </div>
                                                    <div className={`text-2xl font-bold ${colorClass} rounded-full w-16 h-16 flex items-center justify-center mx-auto`}>
                                                        {percentage}%
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </motion.div>

            <motion.div
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
                <div className="glass-card text-center p-6 border border-white/20">
                    <ChartBarIcon className="w-8 h-8 mx-auto text-blue-400 mb-2" />
                    <div className="text-3xl font-bold text-blue-400 mb-2">{stats.total.toLocaleString()}</div>
                    <div className="text-white/70">Total Analyses by All Users</div>
                </div>

                <div className="glass-card text-center p-6 border border-white/20">
                    <ExclamationTriangleIcon className="w-8 h-8 mx-auto text-red-400 mb-2" />
                    <div className="text-3xl font-bold text-red-400 mb-2">{stats.toxic.toLocaleString()}</div>
                    <div className="text-white/70">Toxic Texts Detected</div>
                </div>
            </motion.div>
        </div>
    );
};

export default Analyzer;