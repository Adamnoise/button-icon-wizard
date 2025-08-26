import React from 'react';
import { FileText, UploadCloud, Lightbulb } from 'lucide-react';

interface SidebarProps {
  showToast: (message: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ showToast }) => {
  const handlePreviewAttach = () => {
    showToast('Előnézet megnyitása (demo)');
  };

  const handleUseAttach = () => {
    showToast('Csatolt fájl beállítva referenciának');
  };

  return (
    <aside className="space-y-6">
      {/* Attached Files */}
      <div className="rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold tracking-tight">Csatolt fájlok</h3>
          <span className="text-xs text-white/60">1 fájl</span>
        </div>
        <div className="mt-4 space-y-3">
          <div className="group rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center">
                  <FileText className="w-4.5 h-4.5 text-white/90" strokeWidth={1.5} />
                </div>
                <div>
                  <div className="text-sm">HXVLWB2.html</div>
                  <div className="text-xs text-white/60">41.9 KB • HTML</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={handlePreviewAttach}
                  className="text-xs rounded-lg px-2.5 py-1.5 bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 transition"
                >
                  Előnézet
                </button>
                <button 
                  onClick={handleUseAttach}
                  className="text-xs rounded-lg px-2.5 py-1.5 bg-emerald-500/15 border border-emerald-400/20 text-emerald-300 hover:bg-emerald-500/20 transition"
                >
                  Használ
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <div className="rounded-xl border border-dashed border-white/10 p-4 text-center">
            <div className="flex items-center justify-center gap-2 text-sm text-white/70">
              <UploadCloud className="w-4.5 h-4.5" strokeWidth={1.5} />
              Húzd ide a fájlokat vagy
              <button className="underline decoration-white/30 hover:decoration-white">válassz ki</button>
            </div>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-6">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4.5 h-4.5 text-yellow-300" strokeWidth={1.5} />
          <h3 className="text-lg font-semibold tracking-tight">Tippek a jobb eredményhez</h3>
        </div>
        <ul className="mt-4 space-y-3 text-sm text-white/70">
          <li className="flex gap-2">
            <span className="text-white/40">•</span>
            Használj Auto Layout-ot és egyértelmű layer elnevezést.
          </li>
          <li className="flex gap-2">
            <span className="text-white/40">•</span>
            Kerüld a rasterizált szöveget; a szöveg legyen Text layer.
          </li>
          <li className="flex gap-2">
            <span className="text-white/40">•</span>
            A primér színek és árnyékok segítenek a glassmorphism megőrzésében.
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;