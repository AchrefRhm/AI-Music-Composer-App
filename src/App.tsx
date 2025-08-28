import React, { useState } from 'react';
import Header from './components/Header';
import ComposeView from './components/ComposeView';
import CollaborateView from './components/CollaborateView';
import LyricsView from './components/LyricsView';
import ExportView from './components/ExportView';

function App() {
  const [currentView, setCurrentView] = useState('compose');

  const renderCurrentView = () => {
    switch (currentView) {
      case 'compose':
        return <ComposeView />;
      case 'collaborate':
        return <CollaborateView />;
      case 'lyrics':
        return <LyricsView />;
      case 'export':
        return <ExportView />;
      default:
        return <ComposeView />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Header currentView={currentView} onViewChange={setCurrentView} />
      <main className="pb-8">
        {renderCurrentView()}
      </main>
    </div>
  );
}

export default App;