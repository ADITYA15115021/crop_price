import { useEffect, useMemo, useState } from "react";
import { getPriceSummary } from "../api";

const formatPrice = (value) => value == null ? "-" : new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(value);

function HomePage() {
  const [summary, setSummary] = useState([]);

  useEffect(() => {
    getPriceSummary({ stateIds: [], cropIds: [], years: [] })
      .then(setSummary)
      .catch((error) => console.error("Failed to load market snapshot:", error));
  }, []);

  const leadingMarkets = useMemo(() => [...summary]
    .filter((item) => item.average_price != null)
    .sort((a, b) => b.average_price - a.average_price)
    .slice(0, 4), [summary]);
  const highestPrice = leadingMarkets[0]?.average_price ?? 0;
  const marketCount = new Set(summary.map((item) => item.state)).size;

  return (
    <main>
      <section className="overflow-hidden bg-emerald-950 text-white">
        <div className="relative mx-auto grid min-h-[530px] max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.05fr_.95fr] lg:py-24">
          <div className="absolute -right-32 -top-24 h-96 w-96 rounded-full bg-lime-300/10 blur-3xl" />
          <div className="relative">
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.22em] text-lime-300">Agricultural market intelligence</p>
            <h1 className="max-w-3xl text-5xl font-semibold tracking-tight sm:text-6xl">See the signals behind every harvest.</h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-emerald-50/75">AgriScope turns price records into a clear view of crop markets across states, seasons, and time.</p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a href="#/explore" className="rounded-xl bg-lime-300 px-5 py-3 text-sm font-bold text-emerald-950 shadow-lg shadow-lime-300/10 transition hover:bg-lime-200">Explore Prices <span aria-hidden="true">&rarr;</span></a>
              <a href="#market-snapshot" className="px-2 py-3 text-sm font-semibold text-white/85 hover:text-white">View market snapshot</a>
            </div>
          </div>
          <div className="relative grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur-sm sm:translate-y-8">
              <p className="text-sm text-emerald-100/70">Markets tracked</p>
              <p className="mt-2 text-4xl font-semibold">{marketCount || "..."}</p>
              <p className="mt-4 text-sm text-lime-200">State-level visibility</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white p-6 text-emerald-950 shadow-2xl">
              <p className="text-sm text-slate-500">Market combinations</p>
              <p className="mt-2 text-2xl font-semibold">{summary.length || "..."}</p>
              <div className="mt-6 flex h-14 items-end gap-1.5">
                {[32, 48, 38, 65, 53, 83, 70, 92].map((height, index) => <span key={index} style={{ height: `${height}%` }} className="w-full rounded-t bg-emerald-700/85" />)}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">Built for clear decisions</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-emerald-950 sm:text-4xl">From raw records to a market view you can act on.</h2>
          </div>
          <p className="max-w-2xl text-lg leading-8 text-slate-600">Compare average crop prices between regions, inspect historical movement, and focus on the seasons that matter to your planning.</p>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {[['01', 'Compare markets', 'View crops side by side across states.'], ['02', 'Follow trends', 'Understand how prices evolve through time.'], ['03', 'Focus your search', 'Filter the full dataset to your exact question.']].map(([number, title, description]) => <article key={number} className="rounded-2xl border border-emerald-950/10 bg-white p-6 shadow-sm"><span className="text-sm font-bold text-lime-700">{number}</span><h3 className="mt-8 text-xl font-semibold text-emerald-950">{title}</h3><p className="mt-2 leading-7 text-slate-600">{description}</p></article>)}
        </div>
      </section>

      <section id="market-snapshot" className="border-y border-emerald-950/10 bg-emerald-50/60">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">Illustrative live snapshot</p><h2 className="mt-3 text-3xl font-semibold tracking-tight text-emerald-950">Leading average prices</h2></div><a href="#/explore" className="text-sm font-bold text-emerald-800 hover:text-emerald-600">Analyze the full data &rarr;</a></div>
          <div className="mt-9 rounded-2xl border border-emerald-950/10 bg-white p-5 sm:p-7">
            {leadingMarkets.length > 0 ? <div className="space-y-6">{leadingMarkets.map((item) => <div key={`${item.state}-${item.crop}`} className="grid gap-2 sm:grid-cols-[180px_1fr_110px]"><div><p className="font-semibold text-emerald-950">{item.crop}</p><p className="text-sm text-slate-500">{item.state}</p></div><div className="flex items-center"><div className="h-3 w-full overflow-hidden rounded-full bg-emerald-100"><div className="h-full rounded-full bg-gradient-to-r from-emerald-700 to-lime-500" style={{ width: `${Math.max(12, (item.average_price / highestPrice) * 100)}%` }} /></div></div><p className="text-left font-semibold tabular-nums text-emerald-950 sm:text-right">INR {formatPrice(item.average_price)}</p></div>)}</div> : <p className="py-8 text-center text-slate-500">Market data will appear here when the API is available.</p>}
          </div>
        </div>
      </section>
    </main>
  );
}

export default HomePage;
