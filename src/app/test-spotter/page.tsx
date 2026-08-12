import SpottersLensViewer from '@/components/product/SpottersLensViewer';

export default function TestSpotterPage() {
  return (
    <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center p-8 gap-8 text-white">
      <div className="text-center max-w-xl">
        <h1 className="text-3xl font-bold mb-4 uppercase tracking-wider font-mono">Spotter's Lens Preview</h1>
        <p className="text-neutral-400">
          Desktop: Hover your mouse over the image to activate and pan.<br/>
          Mobile: Tap and hold the image to activate the viewfinder.
        </p>
      </div>

      <div className="w-full max-w-3xl aspect-[4/3] rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl relative">
        <SpottersLensViewer zoomScale={2.2}>
          {/* Using a standard HTML img tag with an external URL to bypass next.config.js domain restrictions for a quick test */}
          <img
            src="https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=2000&auto=format&fit=crop"
            alt="Fighter Jet"
            className="w-full h-full object-cover pointer-events-none"
          />
        </SpottersLensViewer>
      </div>
    </div>
  );
}
