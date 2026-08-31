import { useState } from "react";

import Filters from "../components/filters";
import PriceChart from "../components/priceChart";

import { getPrices, getPriceSummary, getPriceTrends } from "../api";

const formatPrice = (value) => value == null ? "-" : new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(value);

function ExplorePage() {
  const [filters, setFilters] = useState(null);
  const [prices, setPrices] = useState([]);
  const [summary, setSummary] = useState([]);
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [view, setView] = useState("chart");

  async function handleApply(selectedFilters) {
    setFilters(selectedFilters);
    setLoading(true);
    setError(null);
    try {
      const [pricesData, summaryData, trendsData] = await Promise.all([getPrices(selectedFilters), getPriceSummary(selectedFilters), getPriceTrends(selectedFilters)]);
      setPrices(pricesData);
      setSummary(summaryData);
      setTrends(trendsData);
    } catch (requestError) {
      console.error(requestError);
      setError("Failed to load price data. Please try again.");
    } finally { setLoading(false); }
  }

  return <main className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
    <div className="max-w-3xl"><p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">Market explorer</p><h1 className="mt-3 text-4xl font-semibold tracking-tight text-emerald-950 sm:text-5xl">Find the price patterns that matter.</h1><p className="mt-4 text-lg leading-8 text-slate-600">Narrow the market data by crop, state, and year, then compare the results visually or record by record.</p></div>
    <section className="mt-10"><Filters onApply={handleApply} /></section>
    {loading && <p className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">Loading selected market data...</p>}
    {error && <p className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
    {!loading && !error && filters && <section className="mt-10">
      <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">Selected results</p><h2 className="mt-2 text-2xl font-semibold text-emerald-950">{prices.length ? `${prices.length} price records` : "No matching records"}</h2></div>{prices.length > 0 && <div className="rounded-lg bg-emerald-100 p-1"><button onClick={() => setView("chart")} className={`rounded-md px-3 py-2 text-sm font-semibold ${view === "chart" ? "bg-white text-emerald-950 shadow-sm" : "text-emerald-800"}`}>Chart</button><button onClick={() => setView("records")} className={`rounded-md px-3 py-2 text-sm font-semibold ${view === "records" ? "bg-white text-emerald-950 shadow-sm" : "text-emerald-800"}`}>Records</button></div>}</div>
      {prices.length > 0 && <div className="mt-6">{view === "chart" ? <><div className="grid gap-4 sm:grid-cols-3">{summary.slice(0, 3).map((item) => <div key={`${item.state}-${item.crop}`} className="rounded-xl border border-emerald-950/10 bg-white p-4"><p className="text-sm text-slate-500">{item.crop} / {item.state}</p><p className="mt-2 text-xl font-semibold text-emerald-950">INR {formatPrice(item.average_price)}</p><p className="mt-1 text-xs text-slate-500">Average price</p></div>)}</div>{trends.length > 0 && <PriceChart data={trends} />}</> : <RecordsTable prices={prices} />}</div>}
      {prices.length === 0 && <p className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">Try broadening one or more filters to find price records.</p>}
    </section>}
  </main>;
}

function RecordsTable({ prices }) { return <div className="overflow-hidden rounded-2xl border border-emerald-950/10 bg-white shadow-sm"><div className="overflow-x-auto"><table className="w-full min-w-[660px] text-left text-sm"><thead className="bg-emerald-50 text-xs uppercase tracking-wider text-emerald-900"><tr><th className="px-5 py-4">Date</th><th className="px-5 py-4">State</th><th className="px-5 py-4">Crop</th><th className="px-5 py-4 text-right">Average Price</th></tr></thead><tbody className="divide-y divide-emerald-950/8">{prices.map((record, index) => <tr key={`${record.record_date}-${record.state}-${record.crop}-${index}`} className="hover:bg-emerald-50/40"><td className="px-5 py-4 text-slate-600">{record.record_date}</td><td className="px-5 py-4 font-medium text-slate-800">{record.state}</td><td className="px-5 py-4 text-slate-700">{record.crop}</td><td className="px-5 py-4 text-right font-semibold tabular-nums text-emerald-950">INR {formatPrice(record.avg_price)}</td></tr>)}</tbody></table></div></div>; }

export default ExplorePage;
