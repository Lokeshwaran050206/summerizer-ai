import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Newspaper, BookOpen, Loader2, Mic, MicOff } from 'lucide-react';

const AvatarCards = ({ selectedAvatar, onAvatarSelect, isProcessing, disabled }) => {
  const avatars = [
    {
      id: 'professor',
      name: 'Professor',
      description: 'Academic analysis with scholarly insights',
      icon: GraduationCap,
      color: 'professor',
      bgGradient: 'from-professor-500 to-professor-700',
      iconColor: 'text-professor-600 dark:text-professor-400',
      accentColor: 'professor-500',
      personality: 'Calm, analytical, educational',
      features: ['Detailed analysis', 'Academic citations', 'Educational tone']
    },
    {
      id: 'journalist',
      name: 'Journalist',
      description: 'Crisp news-style reporting and facts',
      icon: Newspaper,
      color: 'journalist',
      bgGradient: 'from-journalist-500 to-journalist-700',
      iconColor: 'text-journalist-600 dark:text-journalist-400',
      accentColor: 'journalist-500',
      personality: 'Direct, factual, engaging',
      features: ['Breaking news style', 'Key facts first', 'Engaging narrative']
    },
    {
      id: 'narrator',
      name: 'Narrator',
      description: 'Storytelling with creative flair',
      icon: BookOpen,
      color: 'narrator',
      bgGradient: 'from-narrator-500 to-narrator-700',
      iconColor: 'text-narrator-600 dark:text-narrator-400',
      accentColor: 'narrator-500',
      personality: 'Creative, engaging, expressive',
      features: ['Storytelling approach', 'Creative language', 'Engaging delivery']
    }
  ];

  const getAvatarState = (avatar) => {
    if (disabled) return 'disabled';
    if (isProcessing && selectedAvatar?.id === avatar.id) return 'processing';
    if (selectedAvatar?.id === avatar.id) return 'selected';
    return 'default';
  };

  const getStateStyles = (avatar, state) => {
    const baseStyles = 'avatar-card';
    
    switch (state) {
      case 'selected':
        return `${baseStyles} selected ring-2 ring-${avatar.accentColor} ring-opacity-50 shadow-2xl`;
      case 'processing':
        return `${baseStyles} selected ring-2 ring-${avatar.accentColor} ring-opacity-50 shadow-2xl animate-pulse-glow`;
      case 'disabled':
        return `${baseStyles} opacity-50 cursor-not-allowed`;
      default:
        return baseStyles;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9
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
      scale: 1.05,
      y: -10,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    },
    tap: {
      scale: 0.95,
      transition: {
        type: "spring",
        stiffness: 600,
        damping: 30
      }
    }
  };

  const iconVariants = {
    default: { 
      scale: 1,
      rotate: 0
    },
    hover: { 
      scale: 1.1,
      rotate: 5,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    },
    processing: {
      scale: [1, 1.2, 1],
      rotate: [0, 10, -10, 0],
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          Choose Your Avatar
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Select an AI persona to summarize your document with their unique style and expertise.
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {avatars.map((avatar) => {
          const state = getAvatarState(avatar);
          const IconComponent = avatar.icon;
          const isSelected = selectedAvatar?.id === avatar.id;
          const isProcessingThis = isProcessing && isSelected;

          return (
            <motion.div
              key={avatar.id}
              variants={cardVariants}
              whileHover={state !== 'disabled' ? "hover" : undefined}
              whileTap={state !== 'disabled' ? "tap" : undefined}
              className={getStateStyles(avatar, state)}
              onClick={() => state !== 'disabled' && onAvatarSelect(avatar)}
              role="button"
              tabIndex={state !== 'disabled' ? 0 : -1}
              aria-label={`Select ${avatar.name} avatar`}
              aria-pressed={isSelected}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  if (state !== 'disabled') {
                    onAvatarSelect(avatar);
                  }
                }
              }}
            >
              <div className="flex flex-col items-center space-y-4">
                {/* Avatar Icon */}
                <motion.div
                  variants={iconVariants}
                  animate={isProcessingThis ? "processing" : "default"}
                  className={`w-20 h-20 bg-gradient-to-br ${avatar.bgGradient} rounded-2xl flex items-center justify-center shadow-lg`}
                >
                  <IconComponent className={`w-10 h-10 text-white ${isProcessingThis ? 'animate-pulse' : ''}`} />
                </motion.div>

                {/* Avatar Info */}
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                    {avatar.name}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 text-balance">
                    {avatar.description}
                  </p>
                </div>

                {/* Personality Tags */}
                <div className="flex flex-wrap justify-center gap-1">
                  {avatar.features.map((feature, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className={`px-2 py-1 text-xs rounded-full bg-${avatar.color}-100 dark:bg-${avatar.color}-900 text-${avatar.color}-700 dark:text-${avatar.color}-300`}
                    >
                      {feature}
                    </motion.span>
                  ))}
                </div>

                {/* Status Indicator */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center space-x-2"
                >
                  {isProcessingThis ? (
                    <>
                      <Loader2 className="w-4 h-4 text-primary-500 animate-spin" />
                      <span className="text-sm text-primary-600 dark:text-primary-400 font-medium">
                        Processing...
                      </span>
                    </>
                  ) : isSelected ? (
                    <>
                      <Mic className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                        Ready to speak
                      </span>
                    </>
                  ) : (
                    <>
                      <MicOff className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        Click to select
                      </span>
                    </>
                  )}
                </motion.div>

                {/* Selection Indicator */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className={`w-6 h-6 bg-${avatar.accentColor} rounded-full flex items-center justify-center`}
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 }}
                      className="w-2 h-2 bg-white rounded-full"
                    />
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Processing Overlay */}
      {isProcessing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="glass-card rounded-2xl p-8 text-center max-w-md mx-4"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center mx-auto mb-4"
            >
              <Loader2 className="w-8 h-8 text-white" />
            </motion.div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
              Analyzing Document
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              {selectedAvatar?.name} is processing your document and preparing a summary...
            </p>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
              <motion.div
                className="bg-primary-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default AvatarCards;
