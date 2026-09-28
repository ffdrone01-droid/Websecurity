import { useState } from 'react';
import { sourceFiles, fileCategories } from '../data/sourceFiles';
import { Copy, Check, ChevronRight, Folder, FileCode, Download } from 'lucide-react';
import { downloadSingleFile } from '../utils/downloadZip';

export function SourceCodePage() {
  const [selectedFile, setSelectedFile] = useState(sourceFiles[0]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [copied, setCopied] = useState(false);

  const filteredFiles = activeCategory === 'all'
    ? sourceFiles
    : sourceFiles.filter(f => f.category === activeCategory);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(selectedFile.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = selectedFile.content;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getLanguageColor = (lang: string) => {
    switch (lang) {
      case 'python': return 'bg-yellow-900/30 text-yellow-300';
      case 'html': return 'bg-orange-900/30 text-orange-300';
      case 'css': return 'bg-blue-900/30 text-blue-300';
      case 'javascript': return 'bg-yellow-900/30 text-yellow-300';
      case 'sql': return 'bg-purple-900/30 text-purple-300';
      case 'markdown': return 'bg-gray-700/50 text-gray-300';
      case 'yaml': return 'bg-pink-900/30 text-pink-300';
      case 'dockerfile': return 'bg-cyan-900/30 text-cyan-300';
      default: return 'bg-gray-700/50 text-gray-300';
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-white">Source Code</h1>
        <p className="text-gray-400 mt-1">
          Complete Phase 2 source code — {sourceFiles.length} files
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeCategory === 'all' ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-700/50' : 'bg-gray-900 text-gray-400 hover:text-gray-200'
          }`}
        >
          All ({sourceFiles.length})
        </button>
        {fileCategories.map((cat) => {
          const count = sourceFiles.filter(f => f.category === cat.id).length;
          if (count === 0) return null;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeCategory === cat.id ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-700/50' : 'bg-gray-900 text-gray-400 hover:text-gray-200'
              }`}
            >
              {cat.icon} {cat.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-12 gap-4">
        {/* File List */}
        <div className="col-span-12 lg:col-span-4 xl:col-span-3">
          <div className="rounded-xl border border-gray-800 overflow-hidden bg-gray-900/50">
            <div className="px-3 py-2 bg-gray-900/80 border-b border-gray-800">
              <span className="text-xs text-gray-500 font-medium">Files</span>
            </div>
            <div className="max-h-[70vh] overflow-y-auto">
              {filteredFiles.map((file, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-1 px-2 py-1.5 border-b border-gray-800/30 group ${
                    selectedFile.path === file.path
                      ? 'bg-emerald-900/20'
                      : 'hover:bg-gray-800/30'
                  }`}
                >
                  <button
                    onClick={() => setSelectedFile(file)}
                    className={`flex-1 flex items-center gap-2 text-left text-sm transition-all ${
                      selectedFile.path === file.path
                        ? 'text-emerald-300'
                        : 'text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    <FileCode className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="font-mono text-xs truncate">{file.path}</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadSingleFile(file);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-gray-700 transition-all"
                    title="Download file ini"
                  >
                    <Download className="w-3 h-3 text-gray-400" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Code Viewer */}
        <div className="col-span-12 lg:col-span-8 xl:col-span-9">
          <div className="rounded-xl border border-gray-800 overflow-hidden">
            {/* File Header */}
            <div className="px-4 py-3 bg-gray-900/80 border-b border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Folder className="w-4 h-4 text-yellow-400" />
                <span className="font-mono text-sm text-gray-200">{selectedFile.path}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${getLanguageColor(selectedFile.language)}`}>
                  {selectedFile.language}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => downloadSingleFile(selectedFile)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-emerald-100 text-xs transition-colors"
                  title="Download file ini"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download
                </button>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="px-4 py-2 bg-gray-900/40 border-b border-gray-800/50">
              <span className="text-xs text-gray-500">{selectedFile.description}</span>
            </div>

            {/* Code Content */}
            <div className="bg-gray-950 p-4 overflow-x-auto max-h-[60vh] overflow-y-auto">
              <pre className="text-sm font-mono leading-relaxed">
                <code className="text-gray-300">{selectedFile.content}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* File Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl bg-gray-900/50 border border-gray-800 text-center">
          <div className="text-xl font-bold text-white">{sourceFiles.length}</div>
          <div className="text-xs text-gray-500">Total Files</div>
        </div>
        <div className="p-3 rounded-xl bg-gray-900/50 border border-gray-800 text-center">
          <div className="text-xl font-bold text-yellow-300">{sourceFiles.filter(f => f.language === 'python').length}</div>
          <div className="text-xs text-gray-500">Python Files</div>
        </div>
        <div className="p-3 rounded-xl bg-gray-900/50 border border-gray-800 text-center">
          <div className="text-xl font-bold text-orange-300">{sourceFiles.filter(f => f.language === 'html').length}</div>
          <div className="text-xs text-gray-500">HTML Templates</div>
        </div>
        <div className="p-3 rounded-xl bg-gray-900/50 border border-gray-800 text-center">
          <div className="text-xl font-bold text-blue-300">{sourceFiles.filter(f => f.category === 'tests').length}</div>
          <div className="text-xs text-gray-500">Test Files</div>
        </div>
      </div>
    </div>
  );
}
