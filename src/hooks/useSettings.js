import { useState, useEffect } from 'react';

const defaultSettings = {
  voiceSpeed: 1.0,
  theme: 'light',
  defaultAvatar: 'professor',
  storageLimit: 100, // MB
  autoPlay: true,
  notifications: true,
  waveformStyle: 'smooth'
};

export const useSettings = () => {
  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem('appSettings');
    return savedSettings ? { ...defaultSettings, ...JSON.parse(savedSettings) } : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem('appSettings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return { settings, updateSettings };
};
