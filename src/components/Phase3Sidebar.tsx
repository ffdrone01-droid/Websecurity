import { Home, Code2, FileText, CheckSquare, Database, Shield, Server, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Page } from '../App';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const navItems: { id: Page; label: string; icon: React.ReactNode; section?: string }[] = [
  { id: 'overview', label: 'Phase 3 Overview', icon: <Home className="w-4 h-4" />, section: 'LABORATORIES' },
  { id: 'sqli', label: 'LAB 01: SQL Injection', icon: <Database className="w-4 h-4" /> },
  { id: 'cookies', label: 'LAB 02: Cookie Security', icon: <Shield className="w-4 h-4" /> },
  { id: 'session', label: 'LAB 03: Session Security', icon: <Server className="w-4 h-4" /> },
  { id: 'comparison', label: 'Vulnerable vs Secure', icon: <AlertTriangle className="w-4 h-4" />, section: 'ANALYSIS' },
  { id: 'source', label: 'Source Code', icon: <Code2 className="w-4 h-4" /> },
  { id: 'docs', label: 'Documentation', icon: <FileText className="w-4 h-4" />, section: 'DOCUMENTATION' },
  { id: 'validation', label: 'Validation Checklist', icon: <CheckSquare className="w-4 h-4" /> },
];

export function Phase3Sidebar({ currentPage, onNavigate, isOpen, onToggle }: SidebarProps) {
  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-gray-900 border-r border-gray-800 transition-all duration-300 z-40 flex flex-col ${
        isOpen ? 'w-64' : 'w-16'
      }`}
      style={{ paddingTop: '48px' }}
    >
      <div className="p-4 border-b border-gray-800 flex items-center gap-3">
        <Shield className="w-6 h-6 text-emerald-400 flex-shrink-0" />
        {isOpen && (
          <div className="overflow-hidden">
            <h1 className="text-sm font-bold text-emerald-400 whitespace-nowrap">Web Security Lab</h1>
            <p className="text-[10px] text-gray-500 whitespace-nowrap">Phase 3 — Vulnerability Labs</p>
          </div>
        )}
      </div>

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
