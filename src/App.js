import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import UploadZone from './components/UploadZone';
import AvatarCards from './components/AvatarCards';
import VoicePanel from './components/VoicePanel';
import RecentSummaries from './components/RecentSummaries';
import HistorySidebar from './components/HistorySidebar';
import SettingsModal from './components/SettingsModal';
import Header from './components/Header';
import { useTheme } from './hooks/useTheme';
import { useSettings } from './hooks/useSettings';

function App() {
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentDocument, setCurrentDocument] = useState(null);
  const [documentContent, setDocumentContent] = useState('');
  const [recentSummaries, setRecentSummaries] = useState([]);
  const [history, setHistory] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { settings, updateSettings } = useSettings();

  // Load initial data from localStorage
  useEffect(() => {
    const savedSummaries = localStorage.getItem('recentSummaries');
    const savedHistory = localStorage.getItem('documentHistory');
    
    if (savedSummaries) {
      setRecentSummaries(JSON.parse(savedSummaries));
    }
    
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('recentSummaries', JSON.stringify(recentSummaries));
  }, [recentSummaries]);

  useEffect(() => {
    localStorage.setItem('documentHistory', JSON.stringify(history));
  }, [history]);

  const handleDocumentUpload = (document) => {
    setCurrentDocument(document);
    const newHistoryItem = {
      id: Date.now(),
      name: document.name,
      type: document.type,
      size: document.size,
      timestamp: new Date().toISOString(),
      avatar: null,
      summary: null
    };
    setHistory(prev => [newHistoryItem, ...prev]);
  };

  const extractTextFromFile = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const content = e.target.result;
        
        if (file.type === 'text/plain' || file.type === 'text/markdown') {
          resolve(content);
        } else if (file.type === 'application/pdf') {
          // For PDF, we'll simulate text extraction
          resolve(`PDF Document: ${file.name}\n\nThis is a simulated PDF content extraction. In a real implementation, you would use a PDF parsing library like pdf-parse or pdf2pic to extract actual text content from the PDF file. The document appears to contain important information that would be summarized by the selected avatar.`);
        } else if (file.type.includes('word') || file.type.includes('document')) {
          // For Word documents, simulate text extraction
          resolve(`Word Document: ${file.name}\n\nThis is a simulated Word document content extraction. In a real implementation, you would use libraries like mammoth.js or docx-parser to extract actual text content from the Word document. The document contains structured information that would be processed and summarized.`);
        } else {
          resolve(`Document: ${file.name}\n\nThis document has been uploaded and is ready for processing. The content will be analyzed and summarized according to the selected avatar's style and expertise.`);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };

  const generateAvatarSummary = (content, avatar) => {
    const documentPreview = content.substring(0, 200) + (content.length > 200 ? '...' : '');
    
    switch (avatar.id) {
      case 'professor':
        return `Academic Analysis Summary:\n\nBased on my scholarly examination of this document, I can provide the following comprehensive analysis:\n\n${documentPreview}\n\nThe document presents several key concepts that warrant further investigation. From an academic perspective, the methodology and findings suggest significant implications for the field. The theoretical framework appears sound, though additional peer review would strengthen the conclusions.\n\nKey insights include the systematic approach to data collection and the rigorous analytical methods employed. This work contributes meaningfully to the existing body of knowledge and opens avenues for future research.`;
        
      case 'journalist':
        return `Breaking News Report:\n\nIn a recent development, sources have revealed important information contained in this document:\n\n${documentPreview}\n\nAccording to the findings, several critical points emerge that could impact current events. The document contains data that suggests significant developments in the field. Our investigation reveals key facts that the public needs to know.\n\nSources indicate that this information has been verified through multiple channels. The implications are far-reaching and could influence policy decisions. We'll continue to monitor this story as more details become available.`;
        
      case 'narrator':
        return `Storytelling Summary:\n\nOnce upon a time, there was a document that held secrets waiting to be discovered...\n\n${documentPreview}\n\nOur journey through this narrative reveals a tale of discovery and insight. Like a well-crafted story, this document unfolds its mysteries chapter by chapter, drawing us deeper into its world of knowledge.\n\nThe characters in this story are the ideas and concepts, each playing their part in the grand narrative. As we follow their development, we discover connections and patterns that weave together into a compelling tale of understanding.\n\nAnd so, our story continues, with each reading revealing new layers of meaning and wonder.`;
        
      default:
        return `Document Summary:\n\n${documentPreview}\n\nThis document has been processed and summarized for your convenience.`;
    }
  };

  const handleAvatarSelect = async (avatar) => {
    setSelectedAvatar(avatar);
    setIsProcessing(true);
    
    try {
      // Extract text from uploaded file
      let extractedContent = '';
      if (currentDocument?.file) {
        extractedContent = await extractTextFromFile(currentDocument.file);
        setDocumentContent(extractedContent); // Store the original content
      } else {
        extractedContent = `Sample document content for ${currentDocument?.name || 'uploaded file'}. This is placeholder text that would be replaced with actual document content in a production environment.`;
        setDocumentContent(extractedContent);
      }
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsProcessing(false);
      
      // Generate avatar-specific summary
      const summaryContent = generateAvatarSummary(extractedContent, avatar);
      
      // Create summary
      const summary = {
        id: Date.now(),
        documentId: currentDocument?.id,
        avatar: avatar.name,
        content: summaryContent,
        timestamp: new Date().toISOString(),
        duration: Math.floor(summaryContent.length / 10) + 30 // Estimate based on content length
      };
      
      setRecentSummaries(prev => [summary, ...prev.slice(0, 9)]); // Keep only 10 most recent
      
      // Update history
      if (currentDocument) {
        setHistory(prev => 
          prev.map(item => 
            item.id === currentDocument.id 
              ? { ...item, avatar: avatar.name, summary: summary.id }
              : item
          )
        );
      }
    } catch (error) {
      console.error('Error processing document:', error);
      setIsProcessing(false);
      
      // Fallback summary
      const summary = {
        id: Date.now(),
        documentId: currentDocument?.id,
        avatar: avatar.name,
        content: `Error processing document. Please try uploading a different file format or try again.`,
        timestamp: new Date().toISOString(),
        duration: 30
      };
      
      setRecentSummaries(prev => [summary, ...prev.slice(0, 9)]);
    }
  };

  const handleVoiceControl = (action) => {
    console.log('Voice control action:', action);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900">
        <Header 
          onSettingsClick={() => setShowSettings(true)}
          onHistoryClick={() => setShowHistory(!showHistory)}
          theme={theme}
          toggleTheme={toggleTheme}
        />
        
        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <UploadZone onDocumentUpload={handleDocumentUpload} />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <AvatarCards
                  selectedAvatar={selectedAvatar}
                  onAvatarSelect={handleAvatarSelect}
                  isProcessing={isProcessing}
                  disabled={!currentDocument}
                />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <RecentSummaries 
                  summaries={recentSummaries}
                  onSummaryClick={(summary) => console.log('Summary clicked:', summary)}
                />
              </motion.div>
            </div>
            
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <AnimatePresence>
                {showHistory && (
                  <motion.div
                    initial={{ opacity: 0, x: 300 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 300 }}
                    transition={{ duration: 0.3 }}
                  >
                    <HistorySidebar 
                      history={history}
                      onItemClick={(item) => console.log('History item clicked:', item)}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </main>
        
        {/* Voice Panel */}
        <AnimatePresence>
          {selectedAvatar && (
            <VoicePanel
              avatar={selectedAvatar}
              isProcessing={isProcessing}
              onVoiceControl={handleVoiceControl}
              onClose={() => setSelectedAvatar(null)}
              summaryContent={recentSummaries[0]?.content}
              originalContent={documentContent}
            />
          )}
        </AnimatePresence>
        
        {/* Settings Modal */}
        <AnimatePresence>
          {showSettings && (
            <SettingsModal
              settings={settings}
              onUpdateSettings={updateSettings}
              onClose={() => setShowSettings(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
