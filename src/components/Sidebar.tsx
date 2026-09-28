import {
  Home,
  Network,
  Database,
  Route,
  GitBranch,
  FolderTree,
  Layers,
  ChevronLeft,
  ChevronRight,
  Shield,
} from 'lucide-react';

type Page = 'home' | 'architecture' | 'database' | 'routes' | 'dataflow' | 'structure' | 'techstack';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const navItems: { id: Page; label: string; icon: React.ReactNode; section?: string }[] = [
  { id: 'home', label: 'Overview', icon: <Home className="w-4 h-4" />, section: 'PHASE 1' },
  { id: 'architecture', label: 'Architecture', icon: <Network className="w-4 h-4" /> },
  { id: 'structure', label: 'Project Structure', icon: <FolderTree className="w-4 h-4" /> },
  { id: 'database', label: 'Database Schema', icon: <Database className="w-4 h-4" />, section: 'DATA LAYER' },
  { id: 'routes', label: 'Route Map', icon: <Route className="w-4 h-4" /> },
  { id: 'dataflow', label: 'Data Flow', icon: <GitBranch className="w-4 h-4" /> },
  { id: 'techstack', label: 'Technology Stack', icon: <Layers className="w-4 h-4" />, section: 'TECHNOLOGY' },
];

export function Sidebar({ currentPage, onNavigate, isOpen, onToggle }: SidebarProps) {
  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-gray-900 border-r border-gray-800 transition-all duration-300 z-40 flex flex-col ${
        isOpen ? 'w-64' : 'w-16'
      }`}
      style={{ paddingTop: '48px' }}
    >
      {/* Logo */}
      <div className="p-4 border-b border-gray-800 flex items-center gap-3">
        <Shield className="w-6 h-6 text-emerald-400 flex-shrink-0" />
        {isOpen && (
          <div className="overflow-hidden">
            <h1 className="text-sm font-bold text-emerald-400 whitespace-nowrap">Web Security Lab</h1>
            <p className="text-[10px] text-gray-500 whitespace-nowrap">Phase 1 — Architecture</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {navItems.map((item) => (
          <div key={item.id}>
            {item.section && (
              <div className={`px-4 pt-4 pb-1 ${isOpen ? '' : 'hidden'}`}>
                <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">
                  {item.section}
                </span>
              </div>
            )}
            <button
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all ${
                currentPage === item.id
                  ? 'bg-emerald-900/30 text-emerald-400 border-r-2 border-emerald-400'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
              }`}
              title={!isOpen ? item.label : undefined}
            >
              {item.icon}
              {isOpen && <span className="whitespace-nowrap">{item.label}</span>}
            </button>
          </div>
        ))}
      </nav>

      {/* Toggle */}
      <div className="p-3 border-t border-gray-800">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
        >
          {isOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
}
