# Interactive Avatar Document Summarizer

A high-fidelity UI/UX React web application that provides AI-powered document summarization with voice synthesis through three distinct avatar personas.

## 🎯 Features

### Multi-Format Document Upload
- **Drag & Drop Interface**: Intuitive file upload with visual feedback
- **Supported Formats**: PDF, DOCX, TXT, and Markdown files
- **Text Paste Option**: Direct text input for quick summarization
- **Progress Tracking**: Real-time upload progress with error handling
- **File Validation**: Size limits and format checking

### Three AI Avatar Personas

#### 🎓 Professor
- **Style**: Academic and scholarly analysis
- **Features**: Detailed analysis, educational citations, calm delivery
- **Visual**: Smooth waveform bars in professor accent colors
- **Activation**: Glowing outline with academic styling

#### 📰 Journalist  
- **Style**: Crisp news-reporter presentation
- **Features**: Breaking news style, key facts first, engaging narrative
- **Visual**: Angular high-contrast waveform panel
- **Activation**: Pulsing outline with news-style UI

#### 📖 Narrator
- **Style**: Playful storyteller approach
- **Features**: Creative language, storytelling approach, expressive delivery
- **Visual**: Curvy colorful waveform bubbles
- **Activation**: Pop-in animation with playful styling

### Voice Control System
- **Floating Voice Panels**: Contextual controls that appear when avatars are selected
- **Real-time Waveforms**: Animated visualizations synced to speech
- **Playback Controls**: Play/pause, skip, restart functionality
- **Volume & Speed**: Adjustable audio settings with visual sliders
- **Progress Tracking**: Visual progress bar with time display

### Recent Summaries Panel
- **Quick Access**: List of last 10 summaries with timestamps
- **Avatar Identification**: Visual indicators showing which avatar created each summary
- **Action Buttons**: Play, download, share, and delete options
- **Duration Display**: Shows summary length and creation time

### History Sidebar
- **Chronological Records**: Complete history of uploaded documents and summaries
- **Advanced Filtering**: Filter by date, avatar, or search terms
- **Document Details**: File size, type, and processing status
- **Quick Actions**: Easy access to previous documents and summaries

### Settings Modal
- **Voice Settings**: Speech speed, auto-play preferences
- **Appearance**: Light/dark theme, waveform styles
- **Avatar Preferences**: Default avatar selection
- **Storage Management**: Storage limits and data management
- **Advanced Options**: Export settings, clear data

## 🎨 Design System

### Glassmorphism Aesthetics
- **Modern Overlays**: Translucent cards with backdrop blur effects
- **Layered Shadows**: Soft, strategic shadow placement
- **Rounded Corners**: Generous border radius for friendly appearance
- **Strategic White Space**: Clean, uncluttered layouts

### Animation System (Framer Motion)
- **Spring Physics**: Natural, bouncy animations
- **Staggered Loading**: Sequential component animations
- **Hover Effects**: Subtle scale and color transitions
- **State Transitions**: Smooth changes between different states
- **Loading States**: Engaging progress indicators

### Responsive Design
- **Desktop**: Three-column layout with full sidebar
- **Tablet**: Two-column layout with collapsible sidebar
- **Mobile**: Single-column with docked panels

## 🛠️ Technology Stack

- **React 18**: Modern React with hooks and functional components
- **Framer Motion**: Advanced animation library for smooth transitions
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **Lucide React**: Beautiful, customizable icons
- **Local Storage**: Persistent settings and data storage

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd interactive-avatar-document-summarizer

# Install dependencies
npm install

# Start development server
npm start
```

### Available Scripts
- `npm start`: Start development server
- `npm build`: Build for production
- `npm test`: Run test suite
- `npm eject`: Eject from Create React App

## 🎭 Avatar Personas

### Professor (Academic)
- **Color Scheme**: Blue-gray tones
- **Personality**: Calm, analytical, educational
- **Use Case**: Research papers, academic documents, detailed analysis
- **Voice Style**: Measured, scholarly, informative

### Journalist (News)
- **Color Scheme**: Red tones
- **Personality**: Direct, factual, engaging
- **Use Case**: News articles, reports, breaking information
- **Voice Style**: Crisp, authoritative, engaging

### Narrator (Storytelling)
- **Color Scheme**: Purple tones
- **Personality**: Creative, engaging, expressive
- **Use Case**: Stories, creative content, engaging presentations
- **Voice Style**: Expressive, dynamic, storytelling

## 🎨 Customization

### Theme System
- **Light Theme**: Clean, bright interface
- **Dark Theme**: Modern, eye-friendly dark mode
- **Automatic Switching**: Respects system preferences

### Waveform Styles
- **Smooth Bars**: Classic audio visualization
- **Angular Bars**: Sharp, modern appearance
- **Curvy Bars**: Playful, organic shapes
- **Dots**: Minimalist dot-based visualization

## 📱 Accessibility Features

- **Keyboard Navigation**: Full keyboard support for all interactions
- **Screen Reader Support**: ARIA labels and semantic HTML
- **Focus Management**: Clear focus indicators and logical tab order
- **Color Contrast**: WCAG compliant color combinations
- **Responsive Text**: Scalable typography for readability

## 🔧 Configuration

### Settings Storage
All settings are automatically saved to localStorage and persist across sessions:
- Voice preferences (speed, auto-play)
- Theme selection
- Default avatar
- Storage limits
- Notification preferences

### Data Management
- **Local Storage**: Settings and recent summaries
- **Session Storage**: Temporary data during session
- **Export/Import**: Settings can be exported and imported
- **Clear Data**: Option to reset all stored data

## 🎯 Future Enhancements

- **Real AI Integration**: Connect to actual AI summarization services
- **Voice Synthesis**: Implement actual text-to-speech functionality
- **Cloud Storage**: Sync data across devices
- **Collaboration**: Share summaries with team members
- **Advanced Analytics**: Usage statistics and insights
- **Plugin System**: Extensible avatar and feature system

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

**Built with ❤️ using React, Framer Motion, and Tailwind CSS**
