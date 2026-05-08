import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { BLINDHIRE_ABI, BLINDHIRE_ADDRESS } from "../lib/blindhire";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

const STATUS = ["Open", "Awarded", "Completed", "Cancelled"];
const STATUS_COLORS = [
  "bg-green-50 text-green-700 border border-green-200",
  "bg-blue-50 text-blue-700 border border-blue-200",
  "bg-gray-50 text-gray-600 border border-gray-200",
  "bg-red-50 text-red-700 border border-red-200",
];

function ClientJobCard({ jobId }: { jobId: number }) {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const { data: job, refetch } = useReadContract({
    address: BLINDHIRE_ADDRESS,
    abi: BLINDHIRE_ABI,
    functionName: "getJob",
    args: [BigInt(jobId)],
  });

  const { data: bidders } = useReadContract({
    address: BLINDHIRE_ADDRESS,
    abi: BLINDHIRE_ABI,
    functionName: "getJobBidders",
    args: [BigInt(jobId)],
  });

  if (!job) return null;

  const [id, client, title, description, , deadline, status, winner, bidCount] = job;
  if (client.toLowerCase() !== address?.toLowerCase()) return null;

  const statusNum = Number(status);
  const deadlineDate = new Date(Number(deadline) * 1000);

  const handleSelectWinner = async (freelancer: string) => {
    try {
      await writeContractAsync({
        address: BLINDHIRE_ADDRESS,
        abi: BLINDHIRE_ABI,
        functionName: "selectWinner",
        args: [BigInt(jobId), freelancer as `0x${string}`],
      });
      refetch();
    } catch (err: any) {
      alert(err?.message || "Failed to select winner");
    }
  };

  const handleComplete = async () => {
    try {
      await writeContractAsync({
        address: BLINDHIRE_ADDRESS,
        abi: BLINDHIRE_ABI,
        functionName: "completeJob",
        args: [BigInt(jobId)],
      });
      refetch();
    } catch (err: any) {
      alert(err?.message || "Failed to complete job");
    }
  };

  const handleCancel = async () => {
    try {
      await writeContractAsync({
        address: BLINDHIRE_ADDRESS,
        abi: BLINDHIRE_ABI,
        functionName: "cancelJob",
        args: [BigInt(jobId)],
      });
      refetch();
    } catch (err: any) {
      alert(err?.message || "Failed to cancel job");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 hover:border-yellow-300 dark:hover:border-yellow-700 transition-all">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-bold text-gray-900 dark:text-white text-base">{title}</h3>
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium shrink-0 ml-3 ${STATUS_COLORS[statusNum]}`}>
          {STATUS[statusNum]}
        </span>
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">{description}</p>

      <div className="flex items-center gap-6 mb-4">
        <div>
          <p className="text-xs text-gray-400 mb-0.5">Bids received</p>
          <p className="font-bold text-gray-900 dark:text-white text-xl">{Number(bidCount)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 mb-0.5">Budget</p>
          <p className="font-semibold text-yellow-600 dark:text-yellow-400 text-sm">Encrypted</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 mb-0.5">Deadline</p>
          <p className="font-medium text-gray-700 dark:text-gray-300 text-sm">{deadlineDate.toLocaleDateString()}</p>
        </div>
      </div>

      {winner !== "0x0000000000000000000000000000000000000000" && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-3 mb-4">
          <p className="text-xs text-green-700 dark:text-green-400 font-medium">
            Winner: {winner.slice(0, 6)}...{winner.slice(-4)}
          </p>
        </div>
      )}

      {/* Bidders list */}
      {bidders && bidders.length > 0 && statusNum === 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Bidders</p>
          <div className="space-y-2">
            {bidders.map((bidder: string) => (
              <div key={bidder} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded-xl px-3 py-2">
                <span className="text-xs text-gray-600 dark:text-gray-300 font-mono">{bidder.slice(0, 6)}...{bidder.slice(-4)}</span>
                <button
                  onClick={() => handleSelectWinner(bidder)}
                  className="text-xs bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-3 py-1 rounded-lg transition-colors"
                >
                  Select Winner
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2">
        {statusNum === 1 && (
          <button onClick={handleComplete} className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors">
            Complete Job
          </button>
        )}
        {statusNum === 0 && (
          <button onClick={handleCancel} className="flex-1 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 font-medium py-2.5 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { isConnected, address } = useAccount();

  const { data: jobCount } = useReadContract({
    address: BLINDHIRE_ADDRESS,
    abi: BLINDHIRE_ABI,
    functionName: "jobCount",
  });

  const count = Number(jobCount || 0);

  if (!isConnected) return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Navbar />
      <div className="pt-32 text-center px-4">
        <div className="max-w-md mx-auto bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Connect your wallet</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Connect your wallet to access your client dashboard.</p>
        </div>
      </div>
      <Footer />
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Navbar />

      <div className="pt-24 pb-10 px-4 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">Client Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{address?.slice(0, 6)}...{address?.slice(-4)}</p>
          </div>
          <Link to="/post-job" className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors">
            + Post new job
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Active listings</h2>

        {count === 0 ? (
          <div className="text-center py-20 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
            <p className="text-gray-400 dark:text-gray-500 text-sm mb-4">No jobs posted yet</p>
            <Link to="/post-job" className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors inline-block">
              Post your first job
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: count }, (_, i) => (
              <ClientJobCard key={i} jobId={i} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
