import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Play, Download, Share2, Trash2, FileText } from 'lucide-react';

const RecentSummaries = ({ summaries, onSummaryClick }) => {
  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const summaryTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - summaryTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getAvatarIcon = (avatarName) => {
    if (!avatarName || typeof avatarName !== 'string') {
      return '🤖';
    }
    
    switch (avatarName.toLowerCase()) {
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
    if (!avatarName || typeof avatarName !== 'string') {
      return 'primary';
    }
    
    switch (avatarName.toLowerCase()) {
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    },
    hover: {
      y: -5,
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }
  };

  if (summaries.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-6"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Recent Summaries
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Your AI-generated summaries will appear here
          </p>
        </div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-card rounded-2xl p-12 text-center"
        >
          <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FileText className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
            No summaries yet
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Upload a document and select an avatar to create your first summary
          </p>
          <div className="flex justify-center space-x-2">
            <div className="w-3 h-3 bg-primary-500 rounded-full animate-pulse"></div>
            <div className="w-3 h-3 bg-primary-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-3 h-3 bg-primary-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          Recent Summaries
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Your latest AI-generated summaries and insights
        </p>
      </motion.div>

      <div className="space-y-4">
        {summaries.map((summary, index) => {
          const avatarColor = getAvatarColor(summary.avatar);
          
          return (
            <motion.div
              key={summary.id}
              variants={itemVariants}
              whileHover="hover"
              className="glass-card rounded-2xl p-6 cursor-pointer group"
              onClick={() => onSummaryClick(summary)}
            >
              <div className="flex items-start space-x-4">
                {/* Avatar Icon */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`w-12 h-12 bg-gradient-to-br from-${avatarColor}-500 to-${avatarColor}-700 rounded-xl flex items-center justify-center shadow-lg`}
                >
                  <span className="text-xl">{getAvatarIcon(summary.avatar)}</span>
                </motion.div>

                {/* Summary Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                      {summary.avatar} Summary
                    </h3>
                    <span className={`px-2 py-1 text-xs rounded-full bg-${avatarColor}-100 dark:bg-${avatarColor}-900 text-${avatarColor}-700 dark:text-${avatarColor}-300`}>
                      {summary.avatar}
                    </span>
                  </div>
                  
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-3 line-clamp-2">
                    {summary.content}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-xs text-slate-500 dark:text-slate-400">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatTimeAgo(summary.timestamp)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Play className="w-3 h-3" />
                        <span>{formatDuration(summary.duration)}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSummaryClick(summary);
                        }}
                        className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900 hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors"
                        aria-label="Play summary"
                      >
                        <Play className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle download
                        }}
                        className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        aria-label="Download summary"
                      >
                        <Download className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle share
                        }}
                        className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        aria-label="Share summary"
                      >
                        <Share2 className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle delete
                        }}
                        className="p-2 rounded-lg bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                        aria-label="Delete summary"
                      >
                        <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* View All Button */}
      {summaries.length >= 5 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-secondary"
          >
            View All Summaries
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default RecentSummaries;
