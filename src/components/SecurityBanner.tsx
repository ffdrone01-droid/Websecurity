import { useState } from 'react';
import { ShieldAlert, X } from 'lucide-react';

export function SecurityBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-red-900/90 border-b border-red-700 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 text-red-300 flex-shrink-0" />
          <div className="text-sm">
            <span className="font-bold text-red-200">⚠ WARNING</span>
            <span className="text-red-300 ml-2">
              This application intentionally contains vulnerable components for security education.
              Run only in an isolated laboratory environment. Do not expose to the public Internet.
            </span>
          </div>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-red-300 hover:text-red-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
