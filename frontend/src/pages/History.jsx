import React, { useState, useEffect, Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, Transition } from '@headlessui/react';
import {
  ClockIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
// Assuming correct paths
import api from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ToxicityMeter from '../components/charts/ToxicityMeter';
import Button from '../components/ui/Button'; // Make sure this path is correct

// --- UTILITY FUNCTIONS ---
const formatTimestamp = (isoString) => {
  if (!isoString) return 'N/A';
  return new Date(isoString).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
};

const getToxicityLevel = (score) => {
  if (score > 75) return { name: 'High', color: 'bg-red-500/80', textColor: 'text-red-300' };
  if (score > 40) return { name: 'Medium', color: 'bg-yellow-500/80', textColor: 'text-yellow-300' };
  return { name: 'Low', color: 'bg-green-500/80', textColor: 'text-green-300' };
};

const truncateText = (text, length = 100) => {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
};
// --- END UTILITIES ---


const History = () => {
  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      try {
        const { data } = await api.get('/predict/history');
        setHistory(Array.isArray(data) ? data : []);
      } catch (error) {
        toast.error(error?.response?.data?.message || 'Failed to fetch history');
        setHistory([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  useEffect(() => {
    if (!Array.isArray(history)) { setFilteredHistory([]); return; }

    let filtered = history.filter(item => {
      const textToSearch = item?.inputText ?? '';
      const scoreToFilter = item?.results?.overallScore ?? 0;
      const levelName = getToxicityLevel(scoreToFilter).name.toLowerCase();
      const matchesSearch = textToSearch.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterLevel === 'all' || levelName === filterLevel;
      return matchesSearch && matchesFilter;
    });

    filtered.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    setFilteredHistory(filtered);
  }, [history, searchTerm, filterLevel, sortOrder]);


  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-white">
          <LoadingSpinner className="w-12 h-12 mx-auto mb-4" />
          <p className="text-lg">Loading analysis history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <motion.div initial="hidden" animate="visible" variants={containerVariants}>
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">Analysis History</h1>
          <p className="text-xl text-white/90">Review your past text analyses</p>
        </motion.div>

        {/* Filter Controls */}
        <motion.div variants={itemVariants}>
          <div className="glass-card p-6 mb-8 border border-white/10 rounded-xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              {/* Search, Filter, Sort Controls... */}
              <div className="relative">
                <label htmlFor="search" className="block text-sm font-medium text-white/80 mb-2">Search Text</label>
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 mt-3 w-5 h-5 text-white/40 pointer-events-none" />
                <input type="text" id="search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search in text..."
                  className="w-full pl-10 pr-4 py-2 border-2 border-white/20 rounded-lg text-white placeholder-white/60 bg-white/10 backdrop-blur-sm focus:ring-blue-500/50 focus:border-blue-500 transition" />
              </div>
              <div>
                <label htmlFor="filter" className="block text-sm font-medium text-white/80 mb-2">Toxicity Level</label>
                <select
                  id="filter"
                  value={filterLevel}
                  onChange={(e) => setFilterLevel(e.target.value)}
                  className="w-full pl-3 pr-10 py-2 border-2 border-white/20 rounded-lg text-white bg-white/10 backdrop-blur-sm focus:ring-blue-500/50 focus:border-blue-500 transition appearance-none bg-no-repeat bg-right"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 0.5rem center',
                    backgroundSize: '1.5em 1.5em',
                  }}
                >
                  <option className="bg-gray-800 text-white" value="all">All Levels</option>
                  <option className="bg-gray-800 text-white" value="low">Low</option>
                  <option className="bg-gray-800 text-white" value="medium">Medium</option>
                  <option className="bg-gray-800 text-white" value="high">High</option>
                </select>
              </div>
              <div>
                <label htmlFor="sort" className="block text-sm font-medium text-white/80 mb-2">Sort By</label>
                <select id="sort" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="w-full pl-3 pr-10 py-2 border-2 border-white/20 rounded-lg text-white bg-white/10 backdrop-blur-sm focus:ring-blue-500/50 focus:border-blue-500 transition appearance-none bg-no-repeat bg-right" style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundSize: '1.5em 1.5em' }}>
                  <option className="bg-gray-800 text-white" value="newest">Newest First</option> 
                  <option className="bg-gray-800 text-white" value="oldest">Oldest First</option>
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {filteredHistory.length > 0 ? (
            <motion.div key="history-list" variants={containerVariants} initial="hidden" animate="visible" exit="hidden" className="space-y-4">
              {filteredHistory.map(item => {
                if (!item || !item.results) return null;
                const level = getToxicityLevel(item.results.overallScore);
                return (
                  <motion.div key={item._id} variants={itemVariants} layout>
                    <div className="glass-card p-5 border border-white/10 rounded-xl hover:border-white/20 hover:bg-white/[.03] transition-all duration-300">
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-white/90 break-words">{truncateText(item.inputText, 150)}</p>
                          <div className="text-sm text-white/60 mt-2 flex items-center">
                            <ClockIcon className="w-4 h-4 mr-1.5 flex-shrink-0" />
                            {formatTimestamp(item.createdAt)}
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 w-full md:w-auto flex-shrink-0">
                          <div className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${level.color} ${level.textColor}`}>
                            {level.name}
                          </div>
                          {/* Correct usage of Button */}
                          <Button size="icon" variant="icon" onClick={() => setSelectedItem(item)} aria-label="View Details">
                            <EyeIcon className="w-5 h-5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          ) : (
            <motion.div key="empty-state" variants={itemVariants} initial="hidden" animate="visible" exit="hidden" className="text-center py-16">
              <div className="glass-card p-8 inline-block border border-white/10 rounded-xl">
                <MagnifyingGlassIcon className="w-16 h-16 mx-auto text-white/30 mb-4" />
                <h3 className="text-xl font-semibold text-white">No History Found</h3>
                <p className="text-white/60 mt-2">
                  {searchTerm || filterLevel !== 'all' ? 'No results match your current filters.' : 'Your analysis history will appear here.'}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Details Modal */}
      <AnimatePresence>
        {selectedItem && (
          // --- CRASH FIX: Added the 'open' prop ---
          <Dialog open={!!selectedItem} as="div" className="relative z-50" onClose={() => setSelectedItem(null)}>
            {/* Overlay */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />
            {/* Modal Content Wrapper */}
            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -20 }} transition={{ duration: 0.3, ease: 'easeOut' }}>
                  <Dialog.Panel className="w-full max-w-5xl transform overflow-hidden rounded-2xl glass-card border border-white/20 p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-white flex justify-between items-center mb-4">
                      Analysis Details
                      <button onClick={() => setSelectedItem(null)} className="p-1 rounded-full text-white/50 hover:text-white hover:bg-white/10">
                        <XMarkIcon className="w-6 h-6" />
                      </button>
                    </Dialog.Title>
                    {selectedItem.results ? (
                      <>
                        <div className="mb-6 flex justify-center"> <ToxicityMeter score={selectedItem.results.overallScore / 100} /> </div>
                        <div className="bg-white/5 rounded-lg p-4 mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium text-white/80">Full Text:</h4>
                        {/* Check if analysisTime is available (and not null/undefined) */}
                        {selectedItem.results.analysisTime != null && (
                          <span className="text-sm text-white/70 flex items-center">
                            <ClockIcon className="w-4 h-4 mr-1.5 flex-shrink-0" />
                            Analysis Time: <strong className="text-white/90 ml-1">{selectedItem.results.analysisTime.toFixed(2)} ms</strong>
                          </span>
                        )}
                      </div>
                      <p className="text-white/90 break-words max-h-40 overflow-y-auto styled-scrollbar pr-2">{selectedItem.inputText}</p>
                    </div>
                        <div>
                          <h4 className="font-medium text-white/80 mb-2">Category Breakdown:</h4>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3"> {/* Adjusted grid cols */}
                            {selectedItem.results.categories && Object.entries(selectedItem.results.categories).map(([category, score]) => (
                              <div key={category} className="bg-white/5 p-3 rounded-md text-center">
                                <div className="text-sm text-white/70 capitalize">{category.replace(/_/g, ' ')}</div>
                                <div className="text-xl font-bold text-white">{Math.round(score)}%</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    ) : (<div className="text-center text-white/70 py-6">No details available.</div>)}
                  </Dialog.Panel>
                </motion.div>
              </div>
            </div>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
};

export default History;