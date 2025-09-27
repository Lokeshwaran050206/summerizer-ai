import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Search, FileText, Clock, User, X } from 'lucide-react';

const HistorySidebar = ({ history, onItemClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('all');


  const filteredHistory = history.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = !selectedDate || new Date(item.timestamp).toDateString() === new Date(selectedDate).toDateString();
    const matchesAvatar = selectedAvatar === 'all' || item.avatar?.toLowerCase() === selectedAvatar;
    
    return matchesSearch && matchesDate && matchesAvatar;
  });

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type) => {
    if (type.includes('pdf')) return '📄';
    if (type.includes('word') || type.includes('document')) return '📝';
    if (type.includes('text')) return '📄';
    return '📁';
  };

  const getAvatarIcon = (avatarName) => {
    switch (avatarName?.toLowerCase()) {
      case 'professor':
        return '🎓';
      case 'journalist':
        return '📰';
      case 'narrator':
        return '📖';
      default:
        return '🤖';
    }
  };

  const getAvatarColor = (avatarName) => {
    switch (avatarName?.toLowerCase()) {
      case 'professor':
        return 'professor';
      case 'journalist':
        return 'journalist';
      case 'narrator':
        return 'narrator';
      default:
        return 'primary';
    }
  };

  const sidebarVariants = {
    hidden: { 
      opacity: 0, 
      x: 300,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      x: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: {
      opacity: 0,
      x: 300,
      scale: 0.95,
      transition: {
        duration: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    },
    hover: {
      x: 5,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }
  };

  return (
    <motion.div
      variants={sidebarVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="sidebar w-full lg:w-80 h-full overflow-hidden"
    >
      <div className="p-6 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              History
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {filteredHistory.length} of {history.length} documents
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4 mb-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {/* Date Filter */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {/* Avatar Filter */}
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select
              value={selectedAvatar}
              onChange={(e) => setSelectedAvatar(e.target.value)}
              className="input-field pl-10"
            >
              <option value="all">All Avatars</option>
              <option value="professor">Professor</option>
              <option value="journalist">Journalist</option>
              <option value="narrator">Narrator</option>
            </select>
          </div>
        </div>

        {/* Clear Filters */}
        {(searchTerm || selectedDate || selectedAvatar !== 'all') && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => {
              setSearchTerm('');
              setSelectedDate('');
              setSelectedAvatar('all');
            }}
            className="btn-secondary mb-4 flex items-center space-x-2"
          >
            <X className="w-4 h-4" />
            <span>Clear Filters</span>
          </motion.button>
        )}

        {/* History List */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <AnimatePresence>
            {filteredHistory.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12"
              >
                <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  No documents found
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Try adjusting your search or filters
                </p>
              </motion.div>
            ) : (
              <div className="space-y-3">
                {filteredHistory.map((item, index) => {
                  const avatarColor = getAvatarColor(item.avatar);
                  
                  return (
                    <motion.div
                      key={item.id}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      whileHover="hover"
                      transition={{ delay: index * 0.05 }}
                      className="glass-card-inset rounded-xl p-4 cursor-pointer group"
                      onClick={() => onItemClick(item)}
                    >
                      <div className="space-y-3">
                        {/* File Info */}
                        <div className="flex items-start space-x-3">
                          <div className="text-2xl">{getFileIcon(item.type)}</div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-slate-900 dark:text-slate-100 truncate">
                              {item.name}
                            </h3>
                            <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
                              <span>{formatFileSize(item.size)}</span>
                              <span>•</span>
                              <span>{item.type.split('/')[1]?.toUpperCase()}</span>
                            </div>
                          </div>
                        </div>

                        {/* Timestamp */}
                        <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
                          <Clock className="w-3 h-3" />
                          <span>{formatDate(item.timestamp)}</span>
                          <span>•</span>
                          <span>{formatTime(item.timestamp)}</span>
                        </div>

                        {/* Avatar Status */}
                        {item.avatar && (
                          <div className="flex items-center space-x-2">
                            <div className={`w-6 h-6 bg-gradient-to-br from-${avatarColor}-500 to-${avatarColor}-700 rounded-lg flex items-center justify-center`}>
                              <span className="text-xs">{getAvatarIcon(item.avatar)}</span>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full bg-${avatarColor}-100 dark:bg-${avatarColor}-900 text-${avatarColor}-700 dark:text-${avatarColor}-300`}>
                              {item.avatar}
                            </span>
                            {item.summary && (
                              <span className="text-xs text-green-600 dark:text-green-400">
                                ✓ Summarized
                              </span>
                            )}
                          </div>
                        )}

                        {/* Hover Actions */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex justify-end space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              onItemClick(item);
                            }}
                            className="p-1 rounded bg-primary-100 dark:bg-primary-900 hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors"
                            aria-label="Open document"
                          >
                            <FileText className="w-3 h-3 text-primary-600 dark:text-primary-400" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700"
        >
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {history.length}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400">
                Total Documents
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {history.filter(item => item.summary).length}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400">
                Summarized
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default HistorySidebar;
