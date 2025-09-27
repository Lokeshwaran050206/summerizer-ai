import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, Palette, User, HardDrive, Zap } from 'lucide-react';

const SettingsModal = ({ settings, onUpdateSettings, onClose }) => {
  const handleSettingChange = (key, value) => {
    onUpdateSettings({ [key]: value });
  };

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.9,
      y: 20
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: 20,
      transition: {
        duration: 0.2
      }
    }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="modal-overlay"
        onClick={onClose}
      >
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="modal-content max-w-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Settings
            </h2>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close settings"
            >
              <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </motion.button>
          </div>

          <div className="space-y-8">
            {/* Voice Settings */}
            <motion.div
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.1 }}
              className="space-y-4"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-xl flex items-center justify-center">
                  <Volume2 className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Voice Settings
                </h3>
              </div>
              
              <div className="space-y-4 pl-13">
                {/* Voice Speed */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Speech Speed
                  </label>
                  <div className="flex items-center space-x-4">
                    <span className="text-xs text-slate-500 dark:text-slate-400">0.5x</span>
                    <input
                      type="range"
                      min="0.5"
                      max="2.0"
                      step="0.25"
                      value={settings.voiceSpeed}
                      onChange={(e) => handleSettingChange('voiceSpeed', parseFloat(e.target.value))}
                      className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #0ea5e9 0%, #0ea5e9 ${((settings.voiceSpeed - 0.5) / 1.5) * 100}%, #e2e8f0 ${((settings.voiceSpeed - 0.5) / 1.5) * 100}%, #e2e8f0 100%)`
                      }}
                    />
                    <span className="text-xs text-slate-500 dark:text-slate-400">2x</span>
                    <span className="text-sm font-medium text-slate-900 dark:text-slate-100 min-w-[3rem]">
                      {settings.voiceSpeed}x
                    </span>
                  </div>
                </div>

                {/* Auto Play */}
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Auto Play Summaries
                    </label>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Automatically start playing when summary is ready
                    </p>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSettingChange('autoPlay', !settings.autoPlay)}
                    className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                      settings.autoPlay ? 'bg-primary-500' : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                    aria-label={`${settings.autoPlay ? 'Disable' : 'Enable'} auto play`}
                  >
                    <motion.div
                      animate={{ x: settings.autoPlay ? 24 : 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm"
                    />
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Appearance Settings */}
            <motion.div
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center">
                  <Palette className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Appearance
                </h3>
              </div>
              
              <div className="space-y-4 pl-13">
                {/* Theme Selection */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Theme
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: 'light', label: 'Light', icon: '☀️' },
                      { value: 'dark', label: 'Dark', icon: '🌙' }
                    ].map((theme) => (
                      <motion.button
                        key={theme.value}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSettingChange('theme', theme.value)}
                        className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                          settings.theme === theme.value
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-2xl mb-1">{theme.icon}</div>
                          <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                            {theme.label}
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Waveform Style */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Waveform Style
                  </label>
                  <select
                    value={settings.waveformStyle}
                    onChange={(e) => handleSettingChange('waveformStyle', e.target.value)}
                    className="input-field"
                  >
                    <option value="smooth">Smooth Bars</option>
                    <option value="angular">Angular Bars</option>
                    <option value="curvy">Curvy Bars</option>
                    <option value="dots">Dots</option>
                  </select>
                </div>
              </div>
            </motion.div>

            {/* Avatar Settings */}
            <motion.div
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center">
                  <User className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Avatar Preferences
                </h3>
              </div>
              
              <div className="space-y-4 pl-13">
                {/* Default Avatar */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Default Avatar
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'professor', label: 'Professor', icon: '🎓', color: 'professor' },
                      { value: 'journalist', label: 'Journalist', icon: '📰', color: 'journalist' },
                      { value: 'narrator', label: 'Narrator', icon: '📖', color: 'narrator' }
                    ].map((avatar) => (
                      <motion.button
                        key={avatar.value}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSettingChange('defaultAvatar', avatar.value)}
                        className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                          settings.defaultAvatar === avatar.value
                            ? `border-${avatar.color}-500 bg-${avatar.color}-50 dark:bg-${avatar.color}-900/20`
                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-2xl mb-1">{avatar.icon}</div>
                          <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                            {avatar.label}
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Storage Settings */}
            <motion.div
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-xl flex items-center justify-center">
                  <HardDrive className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Storage & Performance
                </h3>
              </div>
              
              <div className="space-y-4 pl-13">
                {/* Storage Limit */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Storage Limit (MB)
                  </label>
                  <div className="flex items-center space-x-4">
                    <span className="text-xs text-slate-500 dark:text-slate-400">50MB</span>
                    <input
                      type="range"
                      min="50"
                      max="500"
                      step="50"
                      value={settings.storageLimit}
                      onChange={(e) => handleSettingChange('storageLimit', parseInt(e.target.value))}
                      className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #f59e0b 0%, #f59e0b ${((settings.storageLimit - 50) / 450) * 100}%, #e2e8f0 ${((settings.storageLimit - 50) / 450) * 100}%, #e2e8f0 100%)`
                      }}
                    />
                    <span className="text-xs text-slate-500 dark:text-slate-400">500MB</span>
                    <span className="text-sm font-medium text-slate-900 dark:text-slate-100 min-w-[4rem]">
                      {settings.storageLimit}MB
                    </span>
                  </div>
                </div>

                {/* Notifications */}
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Notifications
                    </label>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Show notifications for completed summaries
                    </p>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSettingChange('notifications', !settings.notifications)}
                    className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                      settings.notifications ? 'bg-primary-500' : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                    aria-label={`${settings.notifications ? 'Disable' : 'Enable'} notifications`}
                  >
                    <motion.div
                      animate={{ x: settings.notifications ? 24 : 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm"
                    />
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Advanced Settings */}
            <motion.div
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.5 }}
              className="space-y-4"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-xl flex items-center justify-center">
                  <Zap className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Advanced
                </h3>
              </div>
              
              <div className="space-y-4 pl-13">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    localStorage.clear();
                    window.location.reload();
                  }}
                  className="btn-secondary w-full flex items-center justify-center space-x-2"
                >
                  <HardDrive className="w-4 h-4" />
                  <span>Clear All Data</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    const settingsBackup = JSON.stringify(settings, null, 2);
                    const blob = new Blob([settingsBackup], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'avatar-summarizer-settings.json';
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="btn-secondary w-full flex items-center justify-center space-x-2"
                >
                  <HardDrive className="w-4 h-4" />
                  <span>Export Settings</span>
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex justify-end space-x-3 mt-8 pt-6 border-t border-slate-200 dark:border-slate-700"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="btn-primary"
            >
              Save Settings
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SettingsModal;
