







import { useReadContract, useAccount, useWriteContract } from "wagmi";
import { useState } from "react";
import { useEncrypt } from "@zama-fhe/react-sdk";
import { BLINDHIRE_ABI, BLINDHIRE_ADDRESS } from "../lib/blindhire";
import { encryptValue } from "../lib/fhe";

const STATUS = ["Open", "Awarded", "Completed", "Cancelled"];
const STATUS_COLORS = [
  "bg-green-50 text-green-700 border border-green-200",
  "bg-blue-50 text-blue-700 border border-blue-200",
  "bg-gray-50 text-gray-600 border border-gray-200",
  "bg-red-50 text-red-700 border border-red-200",
];

export default function JobCard({ jobId }: { jobId: number }) {
  const { address } = useAccount();
  const [bidModalOpen, setBidModalOpen] = useState(false);

  const { data: job, isLoading } = useReadContract({
    address: BLINDHIRE_ADDRESS,
    abi: BLINDHIRE_ABI,
    functionName: "getJob",
    args: [BigInt(jobId)],
  });

  if (isLoading) return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 animate-pulse">
      <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded mb-3 w-3/4"></div>
      <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded mb-2 w-full"></div>
      <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded mb-4 w-2/3"></div>
      <div className="h-8 bg-gray-100 dark:bg-gray-800 rounded w-full"></div>
    </div>
  );

  if (!job) return null;

  const [id, client, title, description, skillsRequired, deadline, status, winner, bidCount] = job;
  const deadlineDate = new Date(Number(deadline) * 1000);
  const isExpired = deadlineDate < new Date();
  const isClient = client.toLowerCase() === address?.toLowerCase();
  const statusNum = Number(status);
  const skills = skillsRequired.split(",").map((s: string) => s.trim()).filter(Boolean);

  const timeLeft = () => {
    if (isExpired) return "Expired";
    const days = Math.ceil((deadlineDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return days === 1 ? "1 day left" : `${days} days left`;
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 hover:border-yellow-300 dark:hover:border-yellow-700 hover:shadow-md transition-all duration-200 flex flex-col">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 pr-3">
            <p className="text-xs font-semibold text-yellow-600 dark:text-yellow-400 uppercase tracking-wide mb-1">CONFIDENTIAL</p>
            <h3 className="font-bold text-gray-900 dark:text-white text-base leading-snug line-clamp-2">{title}</h3>
          </div>
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium shrink-0 ${STATUS_COLORS[statusNum]}`}>
            {STATUS[statusNum]}
          </span>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2 leading-relaxed">{description}</p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {skills.slice(0, 4).map((skill: string, i: number) => (
            <span key={i} className="text-xs bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 px-2.5 py-1 rounded-lg font-medium">
              {skill}
            </span>
          ))}
          {skills.length > 4 && (
            <span className="text-xs text-gray-400 px-2 py-1">+{skills.length - 4} more</span>
          )}
        </div>

        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="11" width="18" height="11" rx="2" fill="#FFCC00"/>
                <path d="M7 11V7a5 5 0 0110 0v4" stroke="#FFCC00" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">Budget: Encrypted</span>
          </div>
          <span className="text-xs text-gray-400 dark:text-gray-500">{Number(bidCount)} bid{Number(bidCount) !== 1 ? "s" : ""}</span>
        </div>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50 dark:border-gray-800">
          <span className={`text-xs font-medium ${isExpired ? "text-red-500" : "text-gray-400 dark:text-gray-500"}`}>
            {timeLeft()}
          </span>
          {isClient ? (
            <span className="text-xs font-semibold text-yellow-600 dark:text-yellow-400">Your Job</span>
          ) : statusNum === 0 && !isExpired ? (
            <button
              onClick={() => setBidModalOpen(true)}
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold text-xs px-4 py-2 rounded-lg transition-colors"
            >
              Place Bid
            </button>
          ) : null}
        </div>
      </div>

      {bidModalOpen && (
        <BidModal jobId={jobId} onClose={() => setBidModalOpen(false)} />
      )}
    </>
  );
}

function BidModal({ jobId, onClose }: { jobId: number; onClose: () => void }) {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const encrypt = useEncrypt();
  const [amount, setAmount] = useState("");
  const [proposal, setProposal] = useState("");
  const [status, setStatus] = useState("");
  const [success, setSuccess] = useState(false);

  const handleBid = async () => {
    if (!amount || !address) return;
    try {
      setStatus("Initializing FHE encryption...");
      const bidWei = BigInt(Math.floor(parseFloat(amount) * 1e9));
      const { handle, inputProof } = await encryptValue(encrypt, bidWei, BLINDHIRE_ADDRESS, address);

      setStatus("Sending encrypted bid to Sepolia...");
      await writeContractAsync({
        address: BLINDHIRE_ADDRESS,
        abi: BLINDHIRE_ABI,
        functionName: "submitBid",
        args: [BigInt(jobId), handle, inputProof],
      });

      setStatus("");
      setSuccess(true);
    } catch (err: any) {
      setStatus("");
      alert(err?.message || "Bid failed");
    }
  };

  if (success) return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-md border border-gray-200 dark:border-gray-800">
        <div className="text-center">
          <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center mx-auto mb-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M5 13l4 4L19 7" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3 className="font-bold text-gray-900 dark:text-white mb-2">Bid Submitted!</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Your encrypted bid is now on-chain. Nobody can see the amount.</p>
          <button onClick={onClose} className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors">Done</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-md border border-gray-200 dark:border-gray-800 shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-gray-900 dark:text-white text-lg">Place Encrypted Bid</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">✕</button>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 mb-5">
          <p className="text-sm text-yellow-800 dark:text-yellow-200 leading-relaxed">
            Your bid amount will be encrypted using Zama FHE before being sent on-chain. Nobody can see it.
          </p>
        </div>

        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your Bid Amount (ETH)</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
        />
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 mt-4">Proposal</label>
        <textarea value={proposal} onChange={(e) => setProposal(e.target.value)} placeholder="Briefly describe your experience..." rows={3} className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white bg-white dark:bg-gray-800 mb-5 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm resize-none"
          className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white bg-white dark:bg-gray-800 mb-5 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
        />

        {status && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full border-2 border-yellow-400 border-t-transparent animate-spin"></div>
              <p className="text-sm text-yellow-800 dark:text-yellow-200">{status}</p>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm">Cancel</button>
          <button onClick={handleBid} disabled={!amount || !!status || encrypt.isPending} className="flex-1 bg-yellow-400 hover:bg-yellow-500 disabled:opacity-50 text-black font-semibold py-3 rounded-xl transition-colors text-sm">
            {status || encrypt.isPending ? "Processing..." : "Submit Encrypted Bid"}
          </button>
        </div>
      </div>
    </div>
  );
}
