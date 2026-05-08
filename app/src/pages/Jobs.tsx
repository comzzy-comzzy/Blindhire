import { useState } from "react";
import { useReadContract } from "wagmi";
import { BLINDHIRE_ABI, BLINDHIRE_ADDRESS } from "../lib/blindhire";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import JobCard from "../components/JobCard";
import { Search } from "lucide-react";

const CATEGORIES = ["All", "Engineering", "Design", "AI / ML", "Marketing", "Content", "Operations"];
const JOB_TYPES = ["All", "Full-time", "Part-time", "Contract"];

export default function Jobs() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [jobType, setJobType] = useState("All");

  const { data: jobCount } = useReadContract({
    address: BLINDHIRE_ADDRESS,
    abi: BLINDHIRE_ABI,
    functionName: "jobCount",
  });

  const count = Number(jobCount || 0);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Navbar />

      <div className="pt-24 pb-10 px-4 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">Find your next role</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">{count} confidential opportunities — all budgets FHE encrypted</p>
          <div className="relative max-w-2xl">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or skill..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row gap-8">

          {/* Sidebar */}
          <aside className="w-full md:w-56 shrink-0">
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 sticky top-24">
              <div className="mb-6">
                <h4 className="text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-3">Category</h4>
                <div className="space-y-1">
                  {CATEGORIES.map((cat) => (
                    <button key={cat} onClick={() => setCategory(cat)}
                      className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${category === cat ? "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 font-medium" : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"}`}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-3">Job Type</h4>
                <div className="space-y-1">
                  {JOB_TYPES.map((type) => (
                    <button key={type} onClick={() => setJobType(type)}
                      className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${jobType === type ? "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 font-medium" : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"}`}>
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Job grid */}
          <div className="flex-1">
            {count === 0 ? (
              <div className="text-center py-20 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
                <p className="text-gray-400 dark:text-gray-500 text-sm mb-4">No jobs posted yet</p>
                <a href="/post-job" className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors inline-block">Post the first job</a>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {Array.from({ length: count }, (_, i) => (
                  <JobCard key={i} jobId={count - 1 - i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
