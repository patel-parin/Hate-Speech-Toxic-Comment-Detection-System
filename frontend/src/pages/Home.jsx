// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheckIcon, SparklesIcon, ClockIcon, ChartBarIcon, ExclamationTriangleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth'; // Import useAuth

// Components
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ToxicityMeter from '../components/charts/ToxicityMeter';

// Services
import api from '../services/api'; // Use the central api instance

const Home = () => {
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [analysisTime, setAnalysisTime] = useState(0);
  const [stats, setStats] = useState({ total: 0, toxic: 0 });
  const [isLoadingExample, setIsLoadingExample] = useState(false); // --- NEW: State for loading example

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


  const handleAnalyze = async () => {
    if (!text.trim()) {
      toast.error('Please enter some text to analyze');
      return;
    }

    setIsAnalyzing(true);
    const startTime = Date.now();

    try {
      const payload = { text, userId: user ? user.id : null };
      const { data: analysisResults } = await api.post('/predict', payload);
      
      const endTime = Date.now();
      
      setResults(analysisResults);
      setAnalysisTime(((endTime - startTime) / 1000).toFixed(2));
      
      toast.success('Analysis completed successfully!');

      if (user) {
         // Fetch the latest stats from the server to ensure consistency
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

  // --- UPDATED: Load example from the backend ---
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
      </motion.div>

      {/* Main Analyzer Card */}
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="mb-8"
      >
        <Card className="p-8">
          <div className="mb-6">
            <label className="block text-lg font-semibold text-gray-700 mb-4">
              <SparklesIcon className="w-6 h-6 inline-block mr-2 text-blue-500" />
              Enter text to analyze for toxicity
            </label>
            
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full h-40 p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 resize-none text-gray-700 placeholder-gray-400"
              placeholder="Type or paste your text here to check for toxic content..."
              disabled={isAnalyzing}
            />
            
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-gray-500">
                {text.length} characters
              </span>
              {text.length > 500 && (
                <span className="text-sm text-orange-500">
                  Long texts may take more time to analyze
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-6">
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !text.trim()}
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

          {isAnalyzing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <LoadingSpinner className="w-12 h-12 mx-auto mb-4" />
              <p className="text-gray-600">Analyzing text with AI model...</p>
              <p className="text-sm text-gray-500 mt-2">This may take a few seconds</p>
            </motion.div>
          )}

          {results && !isAnalyzing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border-l-4 border-blue-500"
            >
              <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                  <ShieldCheckIcon className="w-6 h-6 mr-2 text-blue-500" />
                  Analysis Results
                </h3>
                
                <div className="flex items-center text-sm text-gray-600">
                  <ClockIcon className="w-4 h-4 mr-1" />
                  {analysisTime}s processing time
                </div>
              </div>

              <div className="mb-6">
                <ToxicityMeter score={results.overallScore / 100} />
              </div>

              <div className="bg-white rounded-lg p-4 mb-6 border">
                <h4 className="font-medium text-gray-700 mb-2">Analyzed Text:</h4>
                <p className="text-gray-600 italic">
                  "{text.length > 200 ? `${text.substring(0, 200)}...` : text}"
                </p>
              </div>

              <div>
                <h4 className="font-medium text-gray-700 mb-4">Category Breakdown:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(results.categories).map(([category, score]) => {
                    const percentage = Math.round(score); 
                    
                    let colorClass = 'text-green-600 bg-green-100';
                    if (percentage > 75) {
                      colorClass = 'text-red-600 bg-red-100';
                    } else if (percentage > 40) {
                      colorClass = 'text-yellow-600 bg-yellow-100';
                    }

                    return (
                      <div key={category} className="bg-white rounded-lg p-4 text-center shadow-sm">
                        <div className="font-medium text-gray-700 mb-2 capitalize">
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
            </motion.div>
          )}
        </Card>
      </motion.div>

      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <Card className="text-center p-6">
          <ChartBarIcon className="w-8 h-8 mx-auto text-blue-500 mb-2" />
          <div className="text-3xl font-bold text-blue-600 mb-2">{stats.total.toLocaleString()}</div>
          <div className="text-gray-600">Total Analyses by All Users</div>
        </Card>
        
        <Card className="text-center p-6">
          <ExclamationTriangleIcon className="w-8 h-8 mx-auto text-red-500 mb-2" />
          <div className="text-3xl font-bold text-red-600 mb-2">{stats.toxic.toLocaleString()}</div>
          <div className="text-gray-600">Toxic Texts Detected</div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Home;