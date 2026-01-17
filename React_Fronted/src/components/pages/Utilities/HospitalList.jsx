import React, { useMemo, useState } from "react";

const HOSPITALS = [
  { name: "Sunrise Multispeciality", city: "Mumbai", network: "Network", contact: "+91 98765 11223" },
  { name: "Lotus Care Hospital", city: "Pune", network: "Network", contact: "+91 98220 55667" },
  { name: "Green Leaf Medical", city: "Bengaluru", network: "Partner", contact: "+91 97400 12345" },
  { name: "City Heart Institute", city: "Delhi", network: "Network", contact: "+91 98100 77889" },
  { name: "Riverfront Health", city: "Ahmedabad", network: "Partner", contact: "+91 98790 34567" },
  { name: "Coastal Care", city: "Chennai", network: "Network", contact: "+91 98400 11223" },
  { name: "Harmony Hospitals", city: "Hyderabad", network: "Network", contact: "+91 98000 44556" },
];

function HospitalList() {
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("all");
  const [networkOnly, setNetworkOnly] = useState(false);

  const cities = useMemo(() => ["all", ...new Set(HOSPITALS.map((h) => h.city))], []);

  const filteredHospitals = useMemo(() => {
    return HOSPITALS.filter((hospital) => {
      const matchName = hospital.name.toLowerCase().includes(search.trim().toLowerCase()) ||
        hospital.city.toLowerCase().includes(search.trim().toLowerCase());
      const matchCity = city === "all" || hospital.city === city;
      const matchNetwork = !networkOnly || hospital.network === "Network";
      return matchName && matchCity && matchNetwork;
    });
  }, [search, city, networkOnly]);

  return (
    <main id="main-content" className="bg-linear-to-b from-slate-50 to-white min-h-screen py-10 px-4 sm:px-6 lg:px-10">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-700 uppercase tracking-wide">Utilities</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Hospital List</h1>
            <p className="text-slate-600 mt-1">Search, filter, and find network hospitals. The list is read-only.</p>
          </div>
        </header>

        <section className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5 space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="md:col-span-2 flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700">Search by city or hospital name</label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Start typing..."
                className="w-full rounded-lg border border-slate-200 px-4 py-3 shadow-inner focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700">Filter by city</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="rounded-lg border border-slate-200 px-4 py-3 shadow-inner bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
              >
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c === "all" ? "All cities" : c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <input
              id="network-only"
              type="checkbox"
              checked={networkOnly}
              onChange={(e) => setNetworkOnly(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="network-only" className="text-sm text-slate-700 font-semibold">Show network hospitals only</label>
          </div>
        </section>

        <section className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5">
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">Hospital</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">City</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">Network</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">Contact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredHospitals.map((hospital) => (
                  <tr key={`${hospital.name}-${hospital.city}`} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm font-semibold text-slate-900">{hospital.name}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{hospital.city}</td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          hospital.network === "Network"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {hospital.network}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">{hospital.contact}</td>
                  </tr>
                ))}
                {filteredHospitals.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-slate-500 text-sm font-semibold">
                      No hospitals match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="md:hidden space-y-3">
            {filteredHospitals.map((hospital) => (
              <div
                key={`${hospital.name}-${hospital.city}`}
                className="border border-slate-200 rounded-xl p-4 shadow-sm bg-slate-50"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{hospital.name}</h3>
                    <p className="text-sm text-slate-600">{hospital.city}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      hospital.network === "Network"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {hospital.network}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-700 font-semibold">Contact: {hospital.contact}</p>
              </div>
            ))}
            {filteredHospitals.length === 0 && (
              <p className="text-center text-slate-500 text-sm font-semibold py-4">No hospitals match your filters.</p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default HospitalList;
