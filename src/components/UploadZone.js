import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, File, FileImage, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const UploadZone = ({ onDocumentUpload }) => {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const fileInputRef = useRef(null);

  const acceptedTypes = {
    'application/pdf': '.pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
    'text/plain': '.txt',
    'text/markdown': '.md'
  };

  const validateFile = (file) => {
    if (!acceptedTypes[file.type]) {
      return `File type ${file.type} is not supported. Please upload PDF, DOCX, TXT, or MD files.`;
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      return 'File size must be less than 10MB.';
    }
    
    return null;
  };

  const handleFileUpload = useCallback(async (file) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setUploading(false);
          setUploadedFile(file);
          onDocumentUpload({
            id: Date.now(),
            name: file.name,
            type: file.type,
            size: file.size,
            file: file
          });
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);
  }, [onDocumentUpload, validateFile]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleFileInput = useCallback((e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  const handlePasteText = () => {
    const text = prompt('Paste your text content:');
    if (text && text.trim()) {
      const blob = new Blob([text], { type: 'text/plain' });
      const file = new File([blob], 'pasted-text.txt', { type: 'text/plain' });
      handleFileUpload(file);
    }
  };

  const resetUpload = () => {
    setUploadedFile(null);
    setError(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFileIcon = (type) => {
    if (type.includes('pdf')) return <File className="w-8 h-8 text-red-500" />;
    if (type.includes('word') || type.includes('document')) return <FileText className="w-8 h-8 text-blue-500" />;
    if (type.includes('text')) return <FileText className="w-8 h-8 text-green-500" />;
    return <FileImage className="w-8 h-8 text-gray-500" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
          Upload Your Document
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Drag and drop your file or click to browse. Supports PDF, DOCX, TXT, and MD files.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className={`upload-zone ${dragOver ? 'drag-over' : ''} ${uploadedFile ? 'border-green-500 bg-green-50/50 dark:bg-green-900/20' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !uploadedFile && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.txt,.md"
          onChange={handleFileInput}
          className="hidden"
          aria-label="File upload input"
        />

        <AnimatePresence mode="wait">
          {uploadedFile ? (
            <motion.div
              key="uploaded"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center space-y-4 p-8"
            >
              <div className="flex items-center space-x-3">
                {getFileIcon(uploadedFile.type)}
                <div className="text-left">
                  <p className="font-medium text-slate-900 dark:text-slate-100">
                    {uploadedFile.name}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {formatFileSize(uploadedFile.size)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <span className="text-green-600 dark:text-green-400 font-medium">
                  Upload Complete
                </span>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  resetUpload();
                }}
                className="btn-secondary flex items-center space-x-2"
              >
                <X className="w-4 h-4" />
                <span>Remove</span>
              </motion.button>
            </motion.div>
          ) : uploading ? (
            <motion.div
              key="uploading"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center space-y-4 p-8"
            >
              <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
              <div className="text-center">
                <p className="font-medium text-slate-900 dark:text-slate-100 mb-2">
                  Uploading...
                </p>
                <div className="w-64 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <motion.div
                    className="bg-primary-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  {Math.round(uploadProgress)}%
                </p>
              </div>
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center space-y-4 p-8"
            >
              <AlertCircle className="w-12 h-12 text-red-500" />
              <div className="text-center">
                <p className="font-medium text-red-600 dark:text-red-400 mb-2">
                  Upload Failed
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  {error}
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setError(null);
                  }}
                  className="btn-primary"
                >
                  Try Again
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="default"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center space-y-6 p-8"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-2xl flex items-center justify-center"
              >
                <Upload className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              </motion.div>
              
              <div className="text-center">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  Drop your file here
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  or click to browse files
                </p>
                <div className="flex flex-wrap justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded">PDF</span>
                  <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded">DOCX</span>
                  <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded">TXT</span>
                  <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded">MD</span>
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handlePasteText();
                }}
                className="btn-secondary flex items-center space-x-2"
              >
                <FileText className="w-4 h-4" />
                <span>Paste Text Instead</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default UploadZone;
