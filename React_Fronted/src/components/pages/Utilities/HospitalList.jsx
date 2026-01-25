import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CustomSelect from "../../common/CustomSelect";

const HOSPITALS = [
  { name: "Sunrise Multispeciality", city: "Mumbai", address: "12 Sunrise Rd, Andheri", pincode: "400053", contact: "+91 98765 11223" },
  { name: "Lotus Care Hospital", city: "Pune", address: "45 Lotus Lane, Shivaji Nagar", pincode: "411005", contact: "+91 98220 55667" },
  { name: "Green Leaf Medical", city: "Bengaluru", address: "8 Green St, Indiranagar", pincode: "560038", contact: "+91 97400 12345" },
  { name: "City Heart Institute", city: "Delhi", address: "101 Cardio Ave, Connaught Place", pincode: "110001", contact: "+91 98100 77889" },
  { name: "Riverfront Health", city: "Ahmedabad", address: "7 River Rd, Ellis Bridge", pincode: "380006", contact: "+91 98790 34567" },
  { name: "Coastal Care", city: "Chennai", address: "22 Coastal Blvd, Adyar", pincode: "600020", contact: "+91 98400 11223" },
  { name: "Harmony Hospitals", city: "Hyderabad", address: "3 Harmony Park, Banjara Hills", pincode: "500034", contact: "+91 98000 44556" },
];

function HospitalList() {
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("all");
  const logoPath = "/images/Logo-circle.png";

  const cities = useMemo(
    () => ["all", ...new Set(HOSPITALS.map((h) => h.city))],
    []
  );

  const filteredHospitals = useMemo(() => {
    const q = search.trim().toLowerCase();
    return HOSPITALS.filter((h) => {
      const matchText =
        h.name.toLowerCase().includes(q) ||
        h.city.toLowerCase().includes(q) ||
        h.address.toLowerCase().includes(q) ||
        h.pincode.includes(q);
      const matchCity = city === "all" || h.city === city;
      return matchText && matchCity;
    });
  }, [search, city]);

  return (
    <main className="min-h-screen bg-[#f8fafc] px-4 py-8 sm:px-6 lg:px-10 font-sans">
      <div className="mx-auto max-w-7xl space-y-8">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white p-8 rounded-[2rem] shadow-xl shadow-blue-900/5 border border-slate-100">
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight sm:text-4xl">
              Network Hospitals
            </h1>
            <p className="text-slate-500 font-medium max-w-lg text-sm">
              Explore our verified network of partner hospitals offering streamlined medical services and support.
            </p>
          </div>

          <button
            type="button"
            onClick={() => window.history.back()}
            className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-slate-500 border border-slate-200 hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
          >
            ← Back to Portal
          </button>
        </header>

        {/* Filter Bar */}
        <section className="bg-[#1e293b] rounded-[2rem] p-8 text-white shadow-2xl">
          <div className="grid gap-6 md:grid-cols-12 items-end">
            <div className="md:col-span-8 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                Quick Search
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Find by name, city, or pincode..."
                  className="w-full rounded-2xl border-none bg-white px-12 py-4 text-sm text-slate-900 shadow-lg focus:ring-4 focus:ring-slate-500/50 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="md:col-span-4 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                Location
              </label>
              <CustomSelect
                value={city}
                onChange={(v) => setCity(v || "all")}
                options={cities.map((c) =>
                  c === "all" ? { value: "all", label: "📍 All Cities" } : { value: c, label: `📍 ${c}` }
                )}
                className="w-full rounded-2xl text-slate-900 overflow-hidden"
              />
            </div>
          </div>
        </section>

        {/* Results Section */}
        <section className="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
              Available Listings: <span className="text-blue-600">{filteredHospitals.length} Result(s)</span>
            </p>
          </div>

          <div className="overflow-x-auto p-2">
            <table className="min-w-full border-separate border-spacing-y-3 px-4">
              <thead className="hidden md:table-header-group">
                <tr>
                  {["Facility Name", "City", "Full Address", "Contact"].map((h) => (
                    <th key={h} className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredHospitals.map((h, idx) => (
                    <motion.tr
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: idx * 0.05 }}
                      key={`${h.name}-${h.city}`}
                      className="group bg-white hover:bg-slate-50 transition-all"
                    >
                      <td className="px-6 py-5 rounded-l-2xl border-y border-l border-slate-100 group-hover:border-slate-300">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-bold group-hover:bg-slate-900 group-hover:text-white transition-colors">
                                {h.name.charAt(0)}
                            </div>
                            <div>
                                <p className="font-bold text-slate-900 leading-none mb-1">{h.name}</p>
                            </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 border-y border-slate-100 group-hover:border-slate-300">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-[11px] font-bold transition-colors">
                          🏙️ {h.city}
                        </span>
                      </td>
                      <td className="px-6 py-5 border-y border-slate-100 group-hover:border-slate-300">
                        <p className="text-xs text-slate-600 font-medium">{h.address}</p>
                        <p className="text-[10px] font-bold text-slate-400 mt-1">ZIP: {h.pincode}</p>
                      </td>
                      <td className="px-6 py-5 rounded-r-2xl border-y border-r border-slate-100 group-hover:border-slate-300">
                        <a 
                          href={`tel:${h.contact}`}
                          className="text-sm font-black text-slate-900 flex items-center gap-2 transition-colors hover:text-blue-600"
                        >
                          <span className="p-2 bg-slate-100 text-slate-500 rounded-lg group-hover:bg-slate-900 group-hover:text-white transition-all">📞</span>
                          {h.contact}
                        </a>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>

            {filteredHospitals.length === 0 && (
                <div className="py-20 text-center space-y-4">
                    <div className="text-5xl">🏥</div>
                    <p className="text-slate-400 font-bold text-lg">No facilities found.</p>
                    <button onClick={() => {setSearch(""); setCity("all");}} className="text-blue-600 font-black text-xs uppercase tracking-widest underline decoration-2 underline-offset-4">Reset Search Filters</button>
                </div>
            )}
          </div>
        </section>
      </div>

      <p className="text-center mt-12 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
        Medical Network Directory • Updated 2026
      </p>
    </main>
  );
}

export default HospitalList;