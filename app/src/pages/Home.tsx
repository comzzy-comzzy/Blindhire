import { useReadContract } from "wagmi";
import { Link } from "react-router-dom";
import { BLINDHIRE_ABI, BLINDHIRE_ADDRESS } from "../lib/blindhire";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import JobCard from "../components/JobCard";

export default function Home() {
  const { data: jobCount } = useReadContract({
    address: BLINDHIRE_ADDRESS,
    abi: BLINDHIRE_ABI,
    functionName: "jobCount",
  });

  const count = Number(jobCount || 0);
  const featuredCount = Math.min(count, 6);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-full px-4 py-1.5 mb-8 animate-fade-in-up">
            <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse"></div>
            <span className="text-xs font-medium text-yellow-800 dark:text-yellow-300">FHE-powered hiring, end-to-end confidential</span>
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-6 animate-fade-in-up animate-delay-200">
            Hire Without Revealing<br />
            <span className="text-yellow-400">Your Budget</span>
          </h1>

          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up animate-delay-300">
            BlindHire uses Fully Homomorphic Encryption so budgets and bids stay private on-chain. No one sees your numbers — not even validators.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in-up animate-delay-400">
            <Link to="/jobs" className="w-full sm:w-auto bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-8 py-3.5 rounded-xl transition-colors text-sm">
              Find Work
            </Link>
            <Link to="/post-job" className="w-full sm:w-auto border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold px-8 py-3.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors text-sm">
              Post a Job
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-gray-500 dark:text-gray-400">
            {["FHE encrypted bids", "On-chain escrow", "Sepolia testnet live"].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-400"></div>
                </div>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold text-yellow-600 dark:text-yellow-400 uppercase tracking-widest mb-3">HOW IT WORKS</p>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Two sides, one confidential flow</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                label: "For Freelancers",
                steps: [
                  { title: "Browse jobs", desc: "Discover confidential opportunities. Budgets are encrypted — focus on fit, not numbers." },
                  { title: "Submit sealed bid", desc: "Your bid is FHE encrypted before hitting the chain. No one sees it — not even the client." },
                  { title: "Get selected", desc: "Client picks the best fit. Payment is released automatically via smart contract escrow." },
                ],
                highlight: true,
              },
              {
                label: "For Clients",
                steps: [
                  { title: "Post a role", desc: "Share what you need. Set an encrypted budget — only you can decrypt it." },
                  { title: "Receive sealed bids", desc: "Freelancers bid blind. No one sees competing bids. Pure merit-based selection." },
                  { title: "Select and pay", desc: "Pick your winner. Smart contract handles escrow and payment automatically." },
                ],
                highlight: false,
              },
            ].map((side) => (
              <div key={side.label} className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-100 dark:border-gray-800">
                <div className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-6 ${side.highlight ? "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-300" : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"}`}>
                  {side.label}
                </div>
                <div className="space-y-6">
                  {side.steps.map((step, i) => (
                    <div key={i} className="flex gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${side.highlight ? "bg-yellow-400" : "bg-gray-200 dark:bg-gray-700"}`}>
                        <span className={`text-xs font-bold ${side.highlight ? "text-black" : "text-gray-700 dark:text-gray-300"}`}>{i + 1}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{step.title}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <p className="text-xs font-semibold text-yellow-600 dark:text-yellow-400 uppercase tracking-widest mb-2">LIVE ON-CHAIN</p>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Confidential jobs this week</h2>
            </div>
            <Link to="/jobs" className="text-sm font-medium text-yellow-600 dark:text-yellow-400 hover:underline">Browse all jobs →</Link>
          </div>

          {count === 0 ? (
            <div className="text-center py-16 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
              <p className="text-gray-400 dark:text-gray-500 text-sm mb-4">No jobs posted yet. Be the first.</p>
              <Link to="/post-job" className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors inline-block">
                Post a Job
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: featuredCount }, (_, i) => (
                <JobCard key={i} jobId={count - 1 - i} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
