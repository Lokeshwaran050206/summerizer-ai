import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, X, RotateCcw, SkipForward, SkipBack } from 'lucide-react';

const VoicePanel = ({ avatar, isProcessing, onVoiceControl, onClose, summaryContent, originalContent }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [speed, setSpeed] = useState(1.0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(180); // 3 minutes default
  const [isMuted, setIsMuted] = useState(false);
  const waveformRef = useRef(null);

  // Generate waveform data
  const generateWaveformData = () => {
    const bars = 50;
    const data = [];
    for (let i = 0; i < bars; i++) {
      data.push(Math.random() * 100);
    }
    return data;
  };

  const [waveformData, setWaveformData] = useState(generateWaveformData());

  // Animate waveform when playing
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setWaveformData(generateWaveformData());
        setCurrentTime(prev => {
          const newTime = prev + 0.1;
          if (newTime >= duration) {
            setIsPlaying(false);
            return 0;
          }
          return newTime;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  // Cleanup speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
      }
    };
  }, []);

  const handlePlayPause = () => {
    if (!isPlaying) {
      // Start speaking
      speakText();
    } else {
      // Stop speaking
      stopSpeaking();
    }
    setIsPlaying(!isPlaying);
    onVoiceControl({ action: isPlaying ? 'pause' : 'play' });
  };

  const speakText = () => {
    // Use the original uploaded content instead of the generated summary
    let textToSpeak = '';
    
    if (originalContent) {
      // Use the actual uploaded document content
      textToSpeak = originalContent;
    } else if (summaryContent) {
      // Fallback to summary if original content not available
      textToSpeak = summaryContent;
    } else {
      textToSpeak = `This is a ${avatar.name.toLowerCase()} summary of the document. The ${avatar.name.toLowerCase()} provides ${avatar.description.toLowerCase()}.`;
    }
    
    // Create speech synthesis
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    
    // Set voice properties based on avatar
    utterance.rate = speed;
    utterance.volume = volume;
    utterance.pitch = 1.0;
    
    // Try to select appropriate voice for avatar
    const voices = speechSynthesis.getVoices();
    let selectedVoice = voices.find(voice => 
      voice.name.includes('Google') || voice.name.includes('Microsoft')
    );
    
    if (avatar.id === 'professor') {
      selectedVoice = voices.find(voice => 
        voice.name.includes('Male') || voice.name.includes('David')
      ) || selectedVoice;
    } else if (avatar.id === 'journalist') {
      selectedVoice = voices.find(voice => 
        voice.name.includes('Female') || voice.name.includes('Zira')
      ) || selectedVoice;
    } else if (avatar.id === 'narrator') {
      selectedVoice = voices.find(voice => 
        voice.name.includes('Female') || voice.name.includes('Susan')
      ) || selectedVoice;
    }
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    
    // Event handlers
    utterance.onstart = () => {
      setIsPlaying(true);
    };
    
    utterance.onend = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };
    
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event.error);
      setIsPlaying(false);
    };
    
    // Store utterance for control
    window.currentUtterance = utterance;
    
    // Start speaking
    speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    
    // Update current utterance if speaking
    if (window.currentUtterance && speechSynthesis.speaking) {
      window.currentUtterance.volume = newVolume;
    }
    
    onVoiceControl({ action: 'volume', value: newVolume });
  };

  const handleSpeedChange = (newSpeed) => {
    setSpeed(newSpeed);
    
    // Update current utterance if speaking
    if (window.currentUtterance && speechSynthesis.speaking) {
      window.currentUtterance.rate = newSpeed;
    }
    
    onVoiceControl({ action: 'speed', value: newSpeed });
  };

  const handleSeek = (newTime) => {
    setCurrentTime(newTime);
    onVoiceControl({ action: 'seek', value: newTime });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getAvatarStyles = () => {
    switch (avatar.id) {
      case 'professor':
        return {
          bgGradient: 'from-professor-500 to-professor-700',
          accentColor: 'professor-500',
          waveformClass: 'professor',
          glowColor: 'professor-500'
        };
      case 'journalist':
        return {
          bgGradient: 'from-journalist-500 to-journalist-700',
          accentColor: 'journalist-500',
          waveformClass: 'journalist',
          glowColor: 'journalist-500'
        };
      case 'narrator':
        return {
          bgGradient: 'from-narrator-500 to-narrator-700',
          accentColor: 'narrator-500',
          waveformClass: 'narrator',
          glowColor: 'narrator-500'
        };
      default:
        return {
          bgGradient: 'from-primary-500 to-primary-700',
          accentColor: 'primary-500',
          waveformClass: 'primary',
          glowColor: 'primary-500'
        };
    }
  };

  const styles = getAvatarStyles();

  const panelVariants = {
    hidden: { 
      opacity: 0, 
      y: 100,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: {
      opacity: 0,
      y: 100,
      scale: 0.9,
      transition: {
        duration: 0.3
      }
    }
  };

  const waveformVariants = {
    idle: { scaleY: 1 },
    active: { 
      scaleY: [1, 1.5, 1],
      transition: {
        duration: 0.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div
      variants={panelVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed bottom-6 right-6 z-50 voice-panel max-w-md w-full mx-4"
    >
      <div className="glass-card rounded-2xl p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <motion.div
              animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
              transition={{ duration: 2, repeat: isPlaying ? Infinity : 0, ease: "linear" }}
              className={`w-12 h-12 bg-gradient-to-br ${styles.bgGradient} rounded-xl flex items-center justify-center`}
            >
              <avatar.icon className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                {avatar.name}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {isPlaying ? 'Speaking...' : 'Ready to speak'}
              </p>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close voice panel"
          >
            <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </motion.button>
        </div>

        {/* Waveform Visualization */}
        <div className="mb-6">
          <div 
            ref={waveformRef}
            className="flex items-end justify-center space-x-1 h-16 bg-slate-100 dark:bg-slate-800 rounded-lg p-4"
          >
            {waveformData.map((height, index) => (
              <motion.div
                key={index}
                variants={waveformVariants}
                animate={isPlaying ? "active" : "idle"}
                style={{ 
                  animationDelay: `${index * 0.05}s`,
                  height: `${height}%` 
                }}
                className={`w-1 waveform-bar ${styles.waveformClass}`}
              />
            ))}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 mb-2">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          <div 
            className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 cursor-pointer"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const newTime = (clickX / rect.width) * duration;
              handleSeek(newTime);
            }}
          >
            <motion.div
              className={`bg-${styles.accentColor} h-2 rounded-full`}
              style={{ width: `${(currentTime / duration) * 100}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-4">
          {/* Playback Controls */}
          <div className="flex items-center justify-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleSeek(Math.max(0, currentTime - 10))}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              aria-label="Skip back 10 seconds"
            >
              <SkipBack className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handlePlayPause}
              className={`p-4 rounded-full bg-gradient-to-br ${styles.bgGradient} shadow-lg`}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 text-white" />
              ) : (
                <Play className="w-6 h-6 text-white ml-1" />
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleSeek(Math.min(duration, currentTime + 10))}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              aria-label="Skip forward 10 seconds"
            >
              <SkipForward className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                setCurrentTime(0);
                setIsPlaying(false);
              }}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              aria-label="Restart"
            >
              <RotateCcw className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </motion.button>
          </div>

          {/* Volume and Speed Controls */}
          <div className="grid grid-cols-2 gap-4">
            {/* Volume Control */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    const newVolume = isMuted ? 0.8 : 0;
                    handleVolumeChange(newVolume);
                  }}
                  className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  )}
                </button>
                <span className="text-sm text-slate-600 dark:text-slate-400">Volume</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #${styles.accentColor.replace('-', '')} 0%, #${styles.accentColor.replace('-', '')} ${volume * 100}%, #e2e8f0 ${volume * 100}%, #e2e8f0 100%)`
                }}
              />
            </div>

            {/* Speed Control */}
            <div className="space-y-2">
              <span className="text-sm text-slate-600 dark:text-slate-400">Speed</span>
              <select
                value={speed}
                onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
                className="w-full px-3 py-2 bg-white/50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              >
                <option value={0.5}>0.5x</option>
                <option value={0.75}>0.75x</option>
                <option value={1.0}>1x</option>
                <option value={1.25}>1.25x</option>
                <option value={1.5}>1.5x</option>
                <option value={2.0}>2x</option>
              </select>
            </div>
          </div>
        </div>

        {/* Status Indicator */}
        <motion.div
          animate={isPlaying ? { opacity: [0.5, 1, 0.5] } : { opacity: 0.5 }}
          transition={{ duration: 1, repeat: isPlaying ? Infinity : 0 }}
          className={`mt-4 text-center text-sm text-${styles.accentColor} font-medium`}
        >
          {isPlaying ? `${avatar.name} is speaking` : 'Ready to play'}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default VoicePanel;
