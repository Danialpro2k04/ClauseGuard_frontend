import { ClauseGuardDashboard } from "@/components/ClauseGuardDashboard";

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen bg-stone-50">
      <div className="flex-1">
        <ClauseGuardDashboard />
      </div>
      
      {/* Footer */}
      <footer className="border-t border-zinc-200/60 mt-0 py-4">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-xs text-zinc-400 font-medium">
              © 2026 ClauseGuard AI. Designed & Engineered by{" "}
              <a
                href="https://www.linkedin.com/in/danyal-wahdat-b747a928b/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-700 hover:text-blue-600 font-semibold transition-colors duration-200 underline decoration-zinc-300 underline-offset-4 hover:decoration-blue-600"
              >
                Danyal Wahdat
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}