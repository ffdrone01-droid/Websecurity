import { useState } from 'react';
import { SecurityBanner } from './components/SecurityBanner';
import { Phase2Sidebar } from './components/Phase2Sidebar';
import { Phase2Overview } from './pages/Phase2Overview';
import { SourceCodePage } from './pages/SourceCodePage';
import { DocumentationPage } from './pages/DocumentationPage';
import { InteractiveDemo } from './pages/InteractiveDemo';
import { ValidationChecklist } from './pages/ValidationChecklist';

export type Page = 'overview' | 'source' | 'docs' | 'demo' | 'validation';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const renderPage = () => {
    switch (currentPage) {
      case 'overview': return <Phase2Overview onNavigate={setCurrentPage} />;
      case 'source': return <SourceCodePage />;
      case 'docs': return <DocumentationPage />;
      case 'demo': return <InteractiveDemo />;
      case 'validation': return <ValidationChecklist />;
      default: return <Phase2Overview onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <SecurityBanner />
      <div className="flex flex-1">
        <Phase2Sidebar
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
          <div className="p-6 lg:p-8 max-w-7xl mx-auto">
            {renderPage()}
          </div>
        </main>
      </div>
    </div>
  );
}
