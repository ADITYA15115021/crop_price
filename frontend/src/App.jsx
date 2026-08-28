import { useEffect, useState } from "react";
import HomePage from "./pages/HomePage";
import ExplorePage from "./pages/ExplorePage";
import "./App.css";

function getPage() {
  return window.location.hash === "#/explore" ? "explore" : "home";
}

function App() {
  const [page, setPage] = useState(getPage);

  useEffect(() => {
    const handleHashChange = () => setPage(getPage());
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return (
    <div className="min-h-screen bg-stone-50 text-slate-900">
      <header className="border-b border-emerald-950/10 bg-stone-50/90 backdrop-blur">
        <div className="mx-auto flex h-18 w-full max-w-7xl items-center justify-between px-5 sm:px-8">
          <a href="#/" className="flex items-center gap-3" aria-label="AgriScope home">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-800 text-lg text-white">A</span>
            <span className="font-semibold tracking-tight text-emerald-950">AgriScope</span>
          </a>
          <nav className="flex items-center gap-1 text-sm font-medium">
            <a className={`rounded-lg px-3 py-2 transition ${page === "home" ? "bg-emerald-100 text-emerald-900" : "text-slate-600 hover:text-emerald-900"}`} href="#/">Overview</a>
            <a className={`rounded-lg px-3 py-2 transition ${page === "explore" ? "bg-emerald-100 text-emerald-900" : "text-slate-600 hover:text-emerald-900"}`} href="#/explore">Explore prices</a>
          </nav>
        </div>
      </header>
      {page === "explore" ? <ExplorePage /> : <HomePage />}
    </div>
  );
}

export default App;
