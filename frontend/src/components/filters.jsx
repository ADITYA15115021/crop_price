import { useEffect, useRef, useState } from "react";
import { getStates, getCrops, getYears } from "../api";

function FilterDropdown({ label, items, selectedIds, onChange, emptyText }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);
  const matches = items.filter((item) =>
    item.label.toLowerCase().includes(search.toLowerCase())
  );

  function toggleItem(id) {
    onChange(
      selectedIds.includes(id)
        ? selectedIds.filter((selectedId) => selectedId !== id)
        : [...selectedIds, id]
    );
  }

  useEffect(() => {
    function closeOnOutsideClick(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    function closeOnEscape(event) {
      if (event.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      <label className="mb-2 block text-sm font-medium text-emerald-900">{label}</label>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="flex min-h-[42px] w-full items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-left text-sm outline-none transition hover:border-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
      >
        <span className="text-emerald-900">
          {selectedIds.length === 0
            ? `Select ${label.toLowerCase()}`
            : `${selectedIds.length} ${label.toLowerCase().replace(/s$/, "")} ${selectedIds.length > 1 ? "selected" : "selected"}`}
        </span>
        <span className="text-emerald-600">{isOpen ? "▲" : "▼"}</span>
      </button>

      {isOpen && (
        <div className="absolute z-20 mt-2 w-full rounded-lg border border-emerald-200 bg-emerald-50 p-3 shadow-lg">
          <input
            type="text"
            placeholder={`Search ${label.toLowerCase()}...`}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="mb-3 w-full rounded-md border border-emerald-200 bg-white px-3 py-2 text-sm text-emerald-950 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
          <div className="max-h-60 overflow-y-auto">
            {matches.length > 0 ? matches.map((item) => (
              <label key={item.id} className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 text-sm hover:bg-emerald-100">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(item.id)}
                  onChange={() => toggleItem(item.id)}
                  className="h-4 w-4 rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-emerald-950">{item.label}</span>
              </label>
            )) : <p className="px-2 py-3 text-sm text-gray-500">{emptyText}</p>}
          </div>
        </div>
      )}

      {selectedIds.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {selectedIds.map((id) => {
            const item = items.find((option) => option.id === id);
            return (
              <span key={id} className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800">
                {item?.label}
                <button type="button" onClick={() => toggleItem(id)} className="ml-1 text-emerald-600 hover:text-emerald-900" aria-label={`Remove ${item?.label}`}>×</button>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Filters({ onApply }) {
  const [states, setStates] = useState([]);
  const [crops, setCrops] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedStates, setSelectedStates] = useState([]);
  const [selectedCrops, setSelectedCrops] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);

  useEffect(() => {
    async function loadFilters() {
      try {
        const [statesData, cropsData, yearsData] = await Promise.all([getStates(), getCrops(), getYears()]);
        setStates(statesData);
        setCrops(cropsData);
        setYears(yearsData);
      } catch (error) {
        console.error("Failed to load filters:", error);
      }
    }
    loadFilters();
  }, []);

  function handleApply() {
    onApply({ stateIds: selectedStates, cropIds: selectedCrops, years: selectedYears });
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Explore Prices</h2>
        <p className="mt-1 text-sm text-gray-500">Select the crop, states and years to analyze.</p>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <FilterDropdown label="Crops" items={crops.map((crop) => ({ id: crop.crop_id, label: crop.name }))} selectedIds={selectedCrops} onChange={setSelectedCrops} emptyText="No crops found." />
        <FilterDropdown label="States" items={states.map((state) => ({ id: state.state_id, label: state.name }))} selectedIds={selectedStates} onChange={setSelectedStates} emptyText="No states found." />
        <FilterDropdown label="Years" items={years.map((year) => ({ id: year.year, label: String(year.year) }))} selectedIds={selectedYears} onChange={setSelectedYears} emptyText="No years found." />
      </div>
      <div className="mt-6 flex justify-end">
        <button type="button" onClick={handleApply} className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-300">Apply Filters</button>
      </div>
    </div>
  );
}

export default Filters;
