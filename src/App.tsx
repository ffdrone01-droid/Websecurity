import { useState } from 'react';
import { SecurityBanner } from './components/SecurityBanner';
import { Sidebar } from './components/Sidebar';
import { HomePage } from './pages/HomePage';
import { ArchitecturePage } from './pages/ArchitecturePage';
import { DatabaseSchemaPage } from './pages/DatabaseSchemaPage';
import { RouteMapPage } from './pages/RouteMapPage';
import { DataFlowPage } from './pages/DataFlowPage';
import { ProjectStructurePage } from './pages/ProjectStructurePage';
import { TechStackPage } from './pages/TechStackPage';

type Page = 'home' | 'architecture' | 'database' | 'routes' | 'dataflow' | 'structure' | 'techstack';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <HomePage onNavigate={setCurrentPage} />;
      case 'architecture': return <ArchitecturePage />;
      case 'database': return <DatabaseSchemaPage />;
      case 'routes': return <RouteMapPage />;
      case 'dataflow': return <DataFlowPage />;
      case 'structure': return <ProjectStructurePage />;
      case 'techstack': return <TechStackPage />;
      default: return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <SecurityBanner />
      <div className="flex flex-1">
        <Sidebar
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
