import { useAccount } from "wagmi";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

export default function MyBids() {
  const { isConnected, address } = useAccount();

  if (!isConnected) return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Navbar />
      <div className="pt-32 text-center px-4">
        <div className="max-w-md mx-auto bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Connect your wallet</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Connect your wallet to view your bids.</p>
        </div>
      </div>
      <Footer />
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Navbar />

      <div className="pt-24 pb-10 px-4 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">My Bids</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {address?.slice(0, 6)}...{address?.slice(-4)} — all bids FHE encrypted
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            { label: "Total Bids", value: "0" },
            { label: "Pending", value: "0" },
            { label: "Won", value: "0" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5">
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="text-center py-20 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
          <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center mx-auto mb-4">
            <div className="w-5 h-5 rounded-full border-2 border-yellow-400"></div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No bids yet</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm mx-auto mb-6">
            Browse the job board and place encrypted bids. Nobody sees your amount — not even the client until selection.
          </p>
          <Link to="/jobs" className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors inline-block">
            Browse Jobs
          </Link>
          <div className="mt-6 inline-flex items-center gap-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl px-4 py-3">
            <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
            <span className="text-sm text-yellow-800 dark:text-yellow-200 font-medium">All bids are FHE encrypted on-chain</span>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
