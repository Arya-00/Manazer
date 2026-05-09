import { motion } from 'framer-motion';
import { AlertTriangle, Download, Trash2, Upload } from 'lucide-react';
import { useRef } from 'react';
import { useAppContext } from '../context/AppContext';

export default function SettingsPanel() {
  const { cards, clearCards, importCards, addToast } = useAppContext();
  const fileInputRef = useRef(null);

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(cards));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", "manazer_backup.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    addToast('Cards exported successfully');
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        if (Array.isArray(imported)) {
          importCards(imported);
          addToast('Cards imported successfully');
        } else {
          addToast('Invalid JSON file', 'error');
        }
      } catch (error) {
        addToast('Error reading file', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleClear = () => {
    if (window.confirm("Are you sure you want to delete all saved cards? This action cannot be undone.")) {
      clearCards();
      addToast('All cards deleted successfully');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto space-y-6"
    >
      <div className="glass p-6 rounded-2xl border-white/10 space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-white mb-2">Data Management</h2>
          <p className="text-sm text-white/60 mb-6">Backup or restore your cards. All data is stored locally in your browser.</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleExport}
            className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Download className="w-5 h-5 text-blue-400" />
              <div className="text-left">
                <div className="text-white font-medium">Export Backup</div>
                <div className="text-sm text-white/50">Download your cards as a JSON file</div>
              </div>
            </div>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Upload className="w-5 h-5 text-emerald-400" />
              <div className="text-left">
                <div className="text-white font-medium">Import Backup</div>
                <div className="text-sm text-white/50">Restore cards from a JSON file</div>
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImport}
              accept=".json"
              className="hidden"
            />
          </button>
        </div>
      </div>

      <div className="glass p-6 rounded-2xl border-red-500/20 bg-red-500/5 space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-red-400 mb-2 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Danger Zone
          </h2>
          <p className="text-sm text-white/60">Permanently delete all your stored cards.</p>
        </div>

        <button
          onClick={handleClear}
          className="flex items-center gap-2 px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl font-medium transition-colors border border-red-500/20"
        >
          <Trash2 className="w-5 h-5" />
          Clear All Data
        </button>
      </div>
    </motion.div>
  );
}
