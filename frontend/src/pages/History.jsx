// // import React, { useState, useEffect } from 'react'
// // import { FiSearch, FiFilter, FiDownload, FiTrash2, FiEye } from 'react-icons/fi'
// // import Card from '../components/ui/Card'
// // import Button from '../components/ui/Button'
// // import Badge from '../components/ui/Badge'
// // import { formatDate, getToxicityColor, truncateText } from '../utils/helpers'

// // const History = () => {
// //   const [historyItems, setHistoryItems] = useState([])
// //   const [searchTerm, setSearchTerm] = useState('')
// //   const [filterStatus, setFilterStatus] = useState('all')
// //   const [loading, setLoading] = useState(true)

// //   // Mock data - replace with actual API call
// //   useEffect(() => {
// //     const mockHistory = [
// //       {
// //         id: 1,
// //         text: "This is a sample text that was analyzed for toxic content detection...",
// //         toxicityScore: 0.12,
// //         status: 'clean',
// //         timestamp: '2024-01-15T14:30:22Z',
// //         categories: {
// //           toxic: 0.12,
// //           severe_toxic: 0.05,
// //           obscene: 0.08,
// //           threat: 0.02,
// //           insult: 0.06,
// //           identity_hate: 0.03
// //         }
// //       },
// //       {
// //         id: 2,
// //         text: "Another example of analyzed content that was flagged by our system...",
// //         toxicityScore: 0.78,
// //         status: 'toxic',
// //         timestamp: '2024-01-15T13:45:10Z',
// //         categories: {
// //           toxic: 0.78,
// //           severe_toxic: 0.23,
// //           obscene: 0.45,
// //           threat: 0.12,
// //           insult: 0.56,
// //           identity_hate: 0.34
// //         }
// //       },
// //       {
// //         id: 3,
// //         text: "Safe content example for demonstration purposes in our application...",
// //         toxicityScore: 0.05,
// //         status: 'clean',
// //         timestamp: '2024-01-15T12:20:35Z',
// //         categories: {
// //           toxic: 0.05,
// //           severe_toxic: 0.01,
// //           obscene: 0.02,
// //           threat: 0.00,
// //           insult: 0.01,
// //           identity_hate: 0.00
// //         }
// //       }
// //     ]
    
// //     setTimeout(() => {
// //       setHistoryItems(mockHistory)
// //       setLoading(false)
// //     }, 1000)
// //   }, [])

// //   const filteredItems = historyItems.filter(item => {
// //     const matchesSearch = item.text.toLowerCase().includes(searchTerm.toLowerCase())
// //     const matchesFilter = filterStatus === 'all' || item.status === filterStatus
// //     return matchesSearch && matchesFilter
// //   })

// //   const handleExport = () => {
// //     // Implement export functionality
// //     console.log('Exporting history...')
// //   }

// //   const handleDelete = (id) => {
// //     setHistoryItems(items => items.filter(item => item.id !== id))
// //   }

// //   if (loading) {
// //     return (
// //       <div className="min-h-screen lg:ml-64 pt-8 pb-16 px-4 sm:px-6 lg:px-8">
// //         <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[50vh]">
// //           <div className="text-center">
// //             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
// //             <p className="text-white/70">Loading history...</p>
// //           </div>
// //         </div>
// //       </div>
// //     )
// //   }

// //   return (
// //     <div className="min-h-screen lg:ml-64 pt-8 pb-16 px-4 sm:px-6 lg:px-8">
// //       <div className="max-w-7xl mx-auto">
// //         <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
// //           <div>
// //             <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
// //               Analysis History
// //             </h1>
// //             <p className="text-white/70 text-lg">
// //               Review your past content analysis results
// //             </p>
// //           </div>
// //           <Button 
// //             onClick={handleExport}
// //             className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center space-x-2 mt-4 md:mt-0"
// //           >
// //             <FiDownload className="w-4 h-4" />
// //             <span>Export History</span>
// //           </Button>
// //         </div>

// //         {/* Filters */}
// //         <Card className="p-6 mb-8">
// //           <div className="flex flex-col md:flex-row gap-4">
// //             <div className="flex-1 relative">
// //               <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
// //               <input
// //                 type="text"
// //                 placeholder="Search history..."
// //                 value={searchTerm}
// //                 onChange={(e) => setSearchTerm(e.target.value)}
// //                 className="w-full bg-white/5 border border-white/20 rounded-xl pl-10 pr-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
// //               />
// //             </div>
// //             <div className="flex gap-2">
// //               <select
// //                 value={filterStatus}
// //                 onChange={(e) => setFilterStatus(e.target.value)}
// //                 className="bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
// //               >
// //                 <option value="all">All Status</option>
// //                 <option value="clean">Clean</option>
// //                 <option value="toxic">Toxic</option>
// //               </select>
// //               <Button variant="outline" className="border border-white/30 text-white hover:bg-white/10 px-4 py-3 rounded-xl flex items-center space-x-2">
// //                 <FiFilter className="w-4 h-4" />
// //                 <span>Filter</span>
// //               </Button>
// //             </div>
// //           </div>
// //         </Card>

// //         {/* History Items */}
// //         <div className="space-y-4">
// //           {filteredItems.length === 0 ? (
// //             <Card className="text-center p-12">
// //               <p className="text-white/70">No history items found</p>
// //             </Card>
// //           ) : (
// //             filteredItems.map((item) => (
// //               <Card key={item.id} className="p-6 hover:bg-white/20 transition-all">
// //                 <div className="flex items-start justify-between mb-4">
// //                   <div className="flex-1">
// //                     <p className="text-white mb-3 leading-relaxed">
// //                       {truncateText(item.text, 150)}
// //                     </p>
// //                     <div className="flex flex-wrap items-center gap-4">
// //                       <Badge variant={item.status === 'clean' ? 'success' : 'error'}>
// //                         {item.status === 'clean' ? 'Clean' : 'Toxic'}
// //                       </Badge>
// //                       <span className={`text-sm font-medium ${getToxicityColor(item.toxicityScore)}`}>
// //                         Score: {(item.toxicityScore * 100).toFixed(1)}%
// //                       </span>
// //                       <span className="text-white/60 text-sm">
// //                         {formatDate(item.timestamp)}
// //                       </span>
// //                     </div>
// //                   </div>
// //                   <div className="flex items-center space-x-2 ml-4">
// //                     <Button
// //                       variant="ghost"
// //                       size="sm"
// //                       className="text-white/70 hover:text-white"
// //                     >
// //                       <FiEye className="w-4 h-4" />
// //                     </Button>
// //                     <Button
// //                       variant="ghost"
// //                       size="sm"
// //                       onClick={() => handleDelete(item.id)}
// //                       className="text-red-400 hover:text-red-300"
// //                     >
// //                       <FiTrash2 className="w-4 h-4" />
// //                     </Button>
// //                   </div>
// //                 </div>
                
// //                 {/* Category Breakdown */}
// //                 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mt-4">
// //                   {Object.entries(item.categories).map(([category, score]) => (
// //                     <div key={category} className="bg-white/5 rounded-lg p-2">
// //                       <p className="text-xs text-white/60 capitalize">
// //                         {category.replace('_', ' ')}
// //                       </p>
// //                       <p className={`text-sm font-medium ${getToxicityColor(score)}`}>
// //                         {(score * 100).toFixed(1)}%
// //                       </p>
// //                     </div>
// //                   ))}
// //                 </div>
// //               </Card>
// //             ))
// //           )}
// //         </div>

// //         {/* Pagination could go here */}
// //         {filteredItems.length > 0 && (
// //           <div className="flex justify-center mt-8">
// //             <div className="flex items-center space-x-2">
// //               <Button variant="outline" size="sm">Previous</Button>
// //               <span className="text-white/70 px-4">Page 1 of 1</span>
// //               <Button variant="outline" size="sm">Next</Button>
// //             </div>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   )
// // }

// // export default History // This is the crucial default export



// import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { 
//   ClockIcon, 
//   TrashIcon, 
//   EyeIcon, 
//   MagnifyingGlassIcon,
//   FunnelIcon,
//   DocumentArrowDownIcon
// } from '@heroicons/react/24/outline';
// import toast from 'react-hot-toast';

// // Components
// import Card from '../components/ui/Card';
// import Button from '../components/ui/Button';
// import LoadingSpinner from '../components/common/LoadingSpinner';

// // Utils
// import { formatTimestamp, getToxicityLevel, getToxicityColor, truncateText } from '../utils/helpers';

// const History = () => {
//   const [history, setHistory] = useState([]);
//   const [filteredHistory, setFilteredHistory] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterLevel, setFilterLevel] = useState('all');
//   const [sortOrder, setSortOrder] = useState('newest');
//   const [selectedItem, setSelectedItem] = useState(null);

//   useEffect(() => {
//     fetchHistory();
//   }, []);

//   useEffect(() => {
//     filterAndSortHistory();
//   }, [history, searchTerm, filterLevel, sortOrder]);

//   const fetchHistory = async () => {
//     setIsLoading(true);
//     try {
//       // Mock data for development
//       const mockHistory = generateMockHistory();
//       await new Promise(resolve => setTimeout(resolve, 1000));
//       setHistory(mockHistory);
//     } catch (error) {
//       toast.error('Failed to fetch history');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const filterAndSortHistory = () => {
//     let filtered = history.filter(item => {
//       const matchesSearch = item.text.toLowerCase().includes(searchTerm.toLowerCase());
//       const matchesFilter = filterLevel === 'all' || getToxicityLevel(item.overallScore) === filterLevel;
//       return matchesSearch && matchesFilter;
//     });

//     // Sort
//     filtered.sort((a, b) => {
//       if (sortOrder === 'newest') {
//         return new Date(b.timestamp) - new Date(a.timestamp);
//       } else {
//         return new Date(a.timestamp) - new Date(b.timestamp);
//       }
//     });

//     setFilteredHistory(filtered);
//   };

//   const deleteItem = (id) => {
//     setHistory(prev => prev.filter(item => item.id !== id));
//     toast.success('Item deleted successfully');
//   };

//   const exportHistory = () => {
//     const csvData = [
//       ['Timestamp', 'Text', 'Overall Score', 'Toxic', 'Severe Toxic', 'Obscene', 'Threat', 'Insult', 'Identity Hate'],
//       ...filteredHistory.map(item => [
//         item.timestamp,
//         `"${item.text.replace(/"/g, '""')}"`,
//         item.overallScore.toFixed(3),
//         item.categories.toxic.toFixed(3),
//         item.categories.severe_toxic.toFixed(3),
//         item.categories.obscene.toFixed(3),
//         item.categories.threat.toFixed(3),
//         item.categories.insult.toFixed(3),
//         item.categories.identity_hate.toFixed(3)
//       ])
//     ].map(row => row.join(',')).join('\n');

//     const blob = new Blob([csvData], { type: 'text/csv' });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `toxicity_history_${new Date().toISOString().split('T')[0]}.csv`;
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     window.URL.revokeObjectURL(url);
    
//     toast.success('History exported successfully');
//   };

//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: { staggerChildren: 0.1 }
//     }
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: { opacity: 1, y: 0 }
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center text-white">
//           <LoadingSpinner className="w-12 h-12 mx-auto mb-4" color="white" />
//           <p className="text-lg">Loading analysis history...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8 max-w-7xl">
//       {/* Header */}
//       <motion.div
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="text-center mb-8"
//       >
//         <h1 className="text-4xl font-bold text-white mb-4">
//           <ClockIcon className="w-10 h-10 inline-block mr-3" />
//           Analysis History
//         </h1>
//         <p className="text-white/80 text-lg">
//           Review and manage your past toxicity analyses
//         </p>
//       </motion.div>

//       {/* Controls */}
//       <Card className="p-6 mb-8">
//         <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
//           {/* Search */}
//           <div className="relative flex-1 max-w-md">
//             <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search in history..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             />
//           </div>

//           {/* Filters */}
//           <div className="flex flex-wrap gap-3">
//             <select
//               value={filterLevel}
//               onChange={(e) => setFilterLevel(e.target.value)}
//               className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="all">All Levels</option>
//               <option value="low">Low Toxicity</option>
//               <option value="medium">Medium Toxicity</option>
//               <option value="high">High Toxicity</option>
//             </select>

//             <select
//               value={sortOrder}
//               onChange={(e) => setSortOrder(e.target.value)}
//               className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="newest">Newest First</option>
//               <option value="oldest">Oldest First</option>
//             </select>

//             <Button onClick={exportHistory} variant="outline" size="sm">
//               <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
//               Export CSV
//             </Button>
//           </div>
//         </div>

//         <div className="mt-4 text-sm text-gray-600">
//           Showing {filteredHistory.length} of {history.length} analyses
//         </div>
//       </Card>

//       {/* History List */}
//       <motion.div
//         variants={containerVariants}
//         initial="hidden"
//         animate="visible"
//         className="space-y-4"
//       >
//         <AnimatePresence>
//           {filteredHistory.map((item) => (
//             <motion.div
//               key={item.id}
//               variants={itemVariants}
//               layout
//               exit={{ opacity: 0, x: -100 }}
//             >
//               <Card className="p-6 hover:shadow-xl">
//                 <div className="flex items-start justify-between">
//                   <div className="flex-1 min-w-0">
//                     {/* Text Preview */}
//                     <div className="mb-3">
//                       <p className="text-gray-900 font-medium mb-2">
//                         "{truncateText(item.text, 150)}"
//                       </p>
//                       <div className="flex items-center space-x-4 text-sm text-gray-500">
//                         <span>{formatTimestamp(item.timestamp)}</span>
//                         <span>•</span>
//                         <span>{item.text.length} characters</span>
//                       </div>
//                     </div>

//                     {/* Toxicity Level */}
//                     <div className="flex items-center space-x-3">
//                       <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
//                         getToxicityColor(item.overallScore) === 'green' ? 'bg-green-100 text-green-800' :
//                         getToxicityColor(item.overallScore) === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
//                         'bg-red-100 text-red-800'
//                       }`}>
//                         {Math.round((1 - item.overallScore) * 100)}% Safe
//                       </div>
                      
//                       <div className="text-sm text-gray-600">
//                         Overall Score: {(item.overallScore * 100).toFixed(1)}%
//                       </div>
//                     </div>
//                   </div>

//                   {/* Actions */}
//                   <div className="flex items-center space-x-2 ml-4">
//                     <Button
//                       onClick={() => setSelectedItem(item)}
//                       variant="outline"
//                       size="sm"
//                     >
//                       <EyeIcon className="w-4 h-4" />
//                     </Button>
                    
//                     <Button
//                       onClick={() => deleteItem(item.id)}
//                       variant="outline"
//                       size="sm"
//                       className="text-red-600 border-red-200 hover:bg-red-50"
//                     >
//                       <TrashIcon className="w-4 h-4" />
//                     </Button>
//                   </div>
//                 </div>
//               </Card>
//             </motion.div>
//           ))}
//         </AnimatePresence>

//         {filteredHistory.length === 0 && (
//           <Card className="p-12 text-center">
//             <ClockIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//             <h3 className="text-xl font-medium text-gray-900 mb-2">No history found</h3>
//             <p className="text-gray-500">
//               {searchTerm || filterLevel !== 'all' 
//                 ? 'Try adjusting your search or filter criteria'
//                 : 'Start analyzing some text to build your history'
//               }
//             </p>
//           </Card>
//         )}
//       </motion.div>

//       {/* Detail Modal */}
//       <AnimatePresence>
//         {selectedItem && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
//             onClick={() => setSelectedItem(null)}
//           >
//             <motion.div
//               initial={{ scale: 0.9, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.9, opacity: 0 }}
//               className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
//               onClick={e => e.stopPropagation()}
//             >
//               <div className="flex items-center justify-between mb-6">
//                 <h3 className="text-xl font-bold text-gray-900">Analysis Details</h3>
//                 <button
//                   onClick={() => setSelectedItem(null)}
//                   className="text-gray-400 hover:text-gray-600"
//                 >
//                   ×
//                 </button>
//               </div>

//               <div className="space-y-4">
//                 <div>
//                   <h4 className="font-medium text-gray-700 mb-2">Analyzed Text:</h4>
//                   <div className="bg-gray-50 rounded-lg p-4">
//                     <p className="text-gray-900">"{selectedItem.text}"</p>
//                   </div>
//                 </div>

//                 <div>
//                   <h4 className="font-medium text-gray-700 mb-3">Category Breakdown:</h4>
//                   <div className="grid grid-cols-2 gap-4">
//                     {Object.entries(selectedItem.categories).map(([category, score]) => (
//                       <div key={category} className="bg-gray-50 rounded-lg p-3">
//                         <div className="font-medium text-gray-700 capitalize mb-1">
//                           {category.replace('_', ' ')}
//                         </div>
//                         <div className="text-2xl font-bold text-gray-900">
//                           {(score * 100).toFixed(1)}%
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 <div className="text-sm text-gray-500">
//                   Analyzed on {formatTimestamp(selectedItem.timestamp)}
//                 </div>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// // Mock data generator
// const generateMockHistory = () => {
//   const mockTexts = [
//     "This is a great product, I love it!",
//     "The service was terrible and I hate it",
//     "Thank you for the excellent customer support",
//     "This is the worst thing I've ever seen",
//     "Amazing quality and fast delivery",
//     "I'm so frustrated with this experience",
//     "Wonderful job on the project",
//     "This is completely useless garbage",
//     "I appreciate your help with this issue",
//     "Terrible customer service, never again"
//   ];

//   return mockTexts.map((text, index) => ({
//     id: index + 1,
//     text,
//     timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
//     overallScore: Math.random() * 0.8,
//     categories: {
//       toxic: Math.random() * 0.3,
//       severe_toxic: Math.random() * 0.1,
//       obscene: Math.random() * 0.2,
//       threat: Math.random() * 0.05,
//       insult: Math.random() * 0.25,
//       identity_hate: Math.random() * 0.1
//     }
//   }));
// };

// export default History;



// import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { 
//   ClockIcon, 
//   TrashIcon, 
//   EyeIcon, 
//   MagnifyingGlassIcon,
//   DocumentArrowDownIcon
// } from '@heroicons/react/24/outline';
// import toast from 'react-hot-toast';
// import axios from 'axios';

// // Components
// import Card from '../components/ui/Card';
// import Button from '../components/ui/Button';
// import LoadingSpinner from '../components/common/LoadingSpinner';

// // Utils
// import { formatTimestamp, getToxicityLevel, getToxicityColor, truncateText } from '../utils/helpers';

// const History = () => {
//   const [history, setHistory] = useState([]);
//   const [filteredHistory, setFilteredHistory] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterLevel, setFilterLevel] = useState('all');
//   const [sortOrder, setSortOrder] = useState('newest');
//   const [selectedItem, setSelectedItem] = useState(null);

//   useEffect(() => {
//     fetchHistory();
//   }, []);

//   useEffect(() => {
//     filterAndSortHistory();
//   }, [history, searchTerm, filterLevel, sortOrder]);

//   const fetchHistory = async () => {
//     setIsLoading(true);
//     try {
//       const res = await axios.get('http://localhost:5000/api/predict'); // 🔹 Change to your backend endpoint
//       // Make sure backend returns array of:
//       // { id, text, timestamp, overallScore, categories: { toxic, severe_toxic, obscene, threat, insult, identity_hate } }
//       setHistory(res.data);
//     } catch (error) {
//       toast.error('Failed to fetch history');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const filterAndSortHistory = () => {
//     let filtered = history.filter(item => {
//       const matchesSearch = item.text.toLowerCase().includes(searchTerm.toLowerCase());
//       const matchesFilter = filterLevel === 'all' || getToxicityLevel(item.overallScore) === filterLevel;
//       return matchesSearch && matchesFilter;
//     });

//     filtered.sort((a, b) => {
//       if (sortOrder === 'newest') {
//         return new Date(b.timestamp) - new Date(a.timestamp);
//       } else {
//         return new Date(a.timestamp) - new Date(b.timestamp);
//       }
//     });

//     setFilteredHistory(filtered);
//   };

//   const deleteItem = async (id) => {
//     try {
//       await axios.delete(`http://localhost:5000/api/prdict/history/${id}`); // 🔹 Backend delete route
//       setHistory(prev => prev.filter(item => item.id !== id));
//       toast.success('Item deleted successfully');
//     } catch {
//       toast.error('Failed to delete item');
//     }
//   };

//   const exportHistory = () => {
//     const csvData = [
//       ['Timestamp', 'Text', 'Overall Score', 'Toxic', 'Severe Toxic', 'Obscene', 'Threat', 'Insult', 'Identity Hate'],
//       ...filteredHistory.map(item => [
//         item.timestamp,
//         `"${item.text.replace(/"/g, '""')}"`,
//         item.overallScore.toFixed(3),
//         item.categories.toxic.toFixed(3),
//         item.categories.severe_toxic.toFixed(3),
//         item.categories.obscene.toFixed(3),
//         item.categories.threat.toFixed(3),
//         item.categories.insult.toFixed(3),
//         item.categories.identity_hate.toFixed(3)
//       ])
//     ].map(row => row.join(',')).join('\n');

//     const blob = new Blob([csvData], { type: 'text/csv' });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `toxicity_history_${new Date().toISOString().split('T')[0]}.csv`;
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     window.URL.revokeObjectURL(url);
    
//     toast.success('History exported successfully');
//   };

//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: { staggerChildren: 0.1 }
//     }
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: { opacity: 1, y: 0 }
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center text-white">
//           <LoadingSpinner className="w-12 h-12 mx-auto mb-4" color="white" />
//           <p className="text-lg">Loading analysis history...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8 max-w-7xl">
//       {/* ✅ Your UI Code remains the same from here */}
//       {/* ... */}
//     </div>
//   );
// };

// export default History;

// src/pages/History.jsx
import React, { useState, useEffect, Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, Transition } from '@headlessui/react';
import { 
  ClockIcon, 
  EyeIcon, 
  MagnifyingGlassIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import api from '../services/api';

// Components
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ToxicityMeter from '../components/charts/ToxicityMeter';

// Utils - You can place these in src/utils/helpers.js
const formatTimestamp = (isoString) => {
  if (!isoString) return 'N/A';
  return new Date(isoString).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
};

const getToxicityLevel = (score) => {
  if (score > 75) return 'high';
  if (score > 40) return 'medium';
  return 'low';
};

const getToxicityColor = (level) => {
  if (level === 'high') return 'bg-red-500';
  if (level === 'medium') return 'bg-yellow-500';
  return 'bg-green-500';
};

const truncateText = (text, length = 100) => {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
};


const History = () => {
  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    filterAndSortHistory();
  }, [history, searchTerm, filterLevel, sortOrder]);

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get('/predict/history'); // Replace with actual user ID or auth context
      setHistory(data);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to fetch history');
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSortHistory = () => {
    let filtered = history.filter(item => {
      const textToSearch = item.inputText || '';
      const scoreToFilter = item.results?.overallScore ?? 0;
      const matchesSearch = textToSearch.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterLevel === 'all' || getToxicityLevel(scoreToFilter) === filterLevel;
      return matchesSearch && matchesFilter;
    });

    filtered.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt) : 0;
      const dateB = b.createdAt ? new Date(b.createdAt) : 0;
      if (sortOrder === 'newest') {
        return dateB - dateA;
      } else {
        return dateA - dateB;
      }
    });

    setFilteredHistory(filtered);
  };

  // --- REMOVED exportHistory function ---

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
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
            <motion.div variants={itemVariants} className="text-center mb-12">
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">Analysis History</h1>
                <p className="text-xl text-white/90">Review your past text analyses</p>
            </motion.div>

            <motion.div variants={itemVariants}>
                <Card className="p-6 mb-8">
                    {/* --- UPDATED: Grid layout for controls --- */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                        {/* Search */}
                        <div className="relative">
                            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search Text</label>
                            <MagnifyingGlassIcon className="absolute left-3 top-9 w-5 h-5 text-gray-400"/>
                            <input 
                                type="text"
                                id="search"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search in text..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        {/* Filter */}
                        <div>
                            <label htmlFor="filter" className="block text-sm font-medium text-gray-700 mb-1">Toxicity Level</label>
                            <select id="filter" value={filterLevel} onChange={(e) => setFilterLevel(e.target.value)} className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                                <option value="all">All Levels</option>
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                        {/* Sort */}
                        <div>
                            <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                            <select id="sort" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                            </select>
                        </div>
                    </div>
                </Card>
            </motion.div>
            
            {filteredHistory.length > 0 ? (
                <motion.div variants={containerVariants} className="space-y-4">
                    {filteredHistory.map(item => (
                        <motion.div key={item._id} variants={itemVariants}>
                            <Card className="p-4 hover:shadow-lg transition-shadow duration-300">
                                <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                                    <div className="flex-1 mb-4 md:mb-0 md:pr-4">
                                        <p className="text-gray-800">{truncateText(item.inputText, 150)}</p>
                                        <div className="text-sm text-gray-500 mt-2 flex items-center">
                                            <ClockIcon className="w-4 h-4 mr-1.5"/>
                                            {formatTimestamp(item.createdAt)}
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2 w-full md:w-auto">
                                        <div className={`px-3 py-1 text-sm font-medium text-white rounded-full ${getToxicityColor(getToxicityLevel(item.results.overallScore))}`}>
                                            {getToxicityLevel(item.results.overallScore)}
                                        </div>
                                        <Button size="sm" variant="icon" onClick={() => setSelectedItem(item)}>
                                            <EyeIcon className="w-5 h-5"/>
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            ) : (
                <motion.div variants={itemVariants} className="text-center py-16">
                    <Card className="p-8 inline-block">
                        <MagnifyingGlassIcon className="w-16 h-16 mx-auto text-gray-300 mb-4"/>
                        <h3 className="text-xl font-semibold text-gray-800">No History Found</h3>
                        <p className="text-gray-500 mt-2">Your analysis history will appear here.</p>
                    </Card>
                </motion.div>
            )}
        </motion.div>

        {/* Details Modal */}
        <AnimatePresence>
            {selectedItem && (
                <Transition appear show as={Fragment}>
                    <Dialog as="div" className="relative z-50" onClose={() => setSelectedItem(null)}>
                        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                            <div className="fixed inset-0 bg-black bg-opacity-50" />
                        </Transition.Child>

                        <div className="fixed inset-0 overflow-y-auto">
                            <div className="flex min-h-full items-center justify-center p-4 text-center">
                                <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                                    <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                        <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 flex justify-between items-center">
                                            Analysis Details
                                            <button onClick={() => setSelectedItem(null)} className="p-1 rounded-full hover:bg-gray-100">
                                                <XMarkIcon className="w-6 h-6 text-gray-500"/>
                                            </button>
                                        </Dialog.Title>
                                        <div className="mt-4">
                                            <div className="mb-6">
                                                <ToxicityMeter score={selectedItem.results.overallScore / 100} />
                                            </div>
                                            <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                                <h4 className="font-medium text-gray-800 mb-2">Full Text:</h4>
                                                <p className="text-gray-700 break-words max-h-40 overflow-y-auto">
                                                    {selectedItem.inputText}
                                                </p>
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-800 mb-2">Category Breakdown:</h4>
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                                    {Object.entries(selectedItem.results.categories).map(([category, score]) => (
                                                        <div key={category} className="bg-gray-100 p-3 rounded-md text-center">
                                                            <div className="text-sm text-gray-600 capitalize">{category.replace(/_/g, ' ')}</div>
                                                            <div className="text-xl font-bold text-gray-800">{Math.round(score)}%</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition>
            )}
        </AnimatePresence>
    </div>
  );
};

export default History;
