import { useState } from 'react';
import { SecurityBanner } from './components/SecurityBanner';
import { Phase3Sidebar } from './components/Phase3Sidebar';
import { Phase3Overview } from './pages/Phase3Overview';
import { SourceCodePage } from './pages/SourceCodePage';
import { LabSQLiPage } from './pages/LabSQLiPage';
import { LabCookiesPage } from './pages/LabCookiesPage';
import { LabSessionPage } from './pages/LabSessionPage';
import { ComparisonPage } from './pages/ComparisonPage';
import { DocumentationPage } from './pages/DocumentationPage';
import { ValidationChecklist } from './pages/ValidationChecklist';

export type Page = 'overview' | 'source' | 'sqli' | 'cookies' | 'session' | 'comparison' | 'docs' | 'validation';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const renderPage = () => {
    switch (currentPage) {
      case 'overview': return <Phase3Overview onNavigate={setCurrentPage} />;
      case 'source': return <SourceCodePage />;
      case 'sqli': return <LabSQLiPage />;
      case 'cookies': return <LabCookiesPage />;
      case 'session': return <LabSessionPage />;
      case 'comparison': return <ComparisonPage />;
      case 'docs': return <DocumentationPage />;
      case 'validation': return <ValidationChecklist />;
      default: return <Phase3Overview onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <SecurityBanner />
      <div className="flex flex-1">
        <Phase3Sidebar
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
