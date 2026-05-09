import { Search } from 'lucide-react';

export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative w-full max-w-md">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-white/40" />
      </div>
      <input
        type="text"
        placeholder="Search cards by bank or name..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl leading-5 text-white placeholder-white/40 focus:outline-none focus:bg-white/10 focus:ring-1 focus:ring-purple-500/50 focus:border-purple-500/50 sm:text-sm transition-all"
      />
    </div>
  );
}
