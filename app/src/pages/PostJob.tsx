import { useState } from "react";
import { useWriteContract, useAccount } from "wagmi";
import { useEncrypt } from "@zama-fhe/react-sdk";
import { BLINDHIRE_ABI, BLINDHIRE_ADDRESS } from "../lib/blindhire";
import { encryptValue } from "../lib/fhe";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Freelance"];
const CATEGORIES = ["Engineering", "Design", "AI / ML", "Marketing", "Content", "Operations"];

export default function PostJob() {
  const { isConnected, address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const encrypt = useEncrypt();
  const [success, setSuccess] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [status, setStatus] = useState("");
  const [form, setForm] = useState({
    title: "", description: "", skills: "",
    budget: "", category: "", jobType: "", deadline: "",
  });

  const handleSubmit = async () => {
    if (!form.title || !form.description || !form.skills || !form.budget || !form.deadline) {
      alert("Please fill all required fields");
      return;
    }
    try {
      const deadlineTs = BigInt(Math.floor(new Date(form.deadline).getTime() / 1000));
      const budgetWei = BigInt(Math.floor(parseFloat(form.budget) * 1e9));

      setStatus("Initializing FHE encryption...");
      const { handle, inputProof } = await encryptValue(encrypt, budgetWei, BLINDHIRE_ADDRESS, address!);

      setStatus("Sending transaction to Sepolia...");
      const hash = await writeContractAsync({
        address: BLINDHIRE_ADDRESS,
        abi: BLINDHIRE_ABI,
        functionName: "postJob",
        args: [form.title, form.description, form.skills, deadlineTs, handle, inputProof],
      });

      setTxHash(hash);
      setStatus("");
      setSuccess(true);
    } catch (err: any) {
      setStatus("");
      alert(err?.message || "Transaction failed");
    }
  };

  if (!isConnected) return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Navbar />
      <div className="pt-32 text-center px-4">
        <div className="max-w-md mx-auto bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Connect your wallet</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">You need to connect your wallet to post a job.</p>
        </div>
      </div>
      <Footer />
    </div>
  );

  if (success) return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Navbar />
      <div className="pt-32 text-center px-4">
        <div className="max-w-md mx-auto bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-10">
          <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M5 13l4 4L19 7" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Job Posted!</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Your budget is encrypted and sealed on-chain using Zama FHE.</p>
          {txHash && (
            <a href={`https://sepolia.etherscan.io/tx/${txHash}`} target="_blank" className="text-xs text-yellow-600 dark:text-yellow-400 hover:underline block mb-6">View on Etherscan →</a>
          )}
          <div className="flex gap-3">
            <Link to="/jobs" className="flex-1 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium py-3 rounded-xl text-sm text-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">View Jobs</Link>
            <button onClick={() => { setSuccess(false); setTxHash(""); setForm({ title: "", description: "", skills: "", budget: "", category: "", jobType: "", deadline: "" }); }}
              className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 rounded-xl text-sm transition-colors">Post Another</button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Navbar />
      <div className="pt-24 pb-10 px-4 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-semibold text-yellow-600 dark:text-yellow-400 uppercase tracking-widest mb-2">FOR CLIENTS</p>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">Post a job</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Your budget stays encrypted — freelancers bid without seeing your number.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-5 mb-8">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center shrink-0">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="11" width="18" height="11" rx="2" fill="black"/>
                <path d="M7 11V7a5 5 0 0110 0v4" stroke="black" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <p className="font-semibold text-yellow-800 dark:text-yellow-200 text-sm mb-1">FHE Protection Active</p>
              <p className="text-yellow-700 dark:text-yellow-300 text-xs leading-relaxed">Your budget will be encrypted using Zama's Fully Homomorphic Encryption before being stored on-chain. Nobody — not even validators — can see the amount.</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Job Title <span className="text-red-400">*</span></label>
              <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Senior Solidity Developer"
                className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400">
                  <option value="">Select</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Job Type</label>
                <select value={form.jobType} onChange={(e) => setForm({ ...form, jobType: e.target.value })}
                  className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400">
                  <option value="">Select</option>
                  {JOB_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description <span className="text-red-400">*</span></label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Describe the role..." rows={5}
                className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Required Skills <span className="text-red-400">*</span></label>
              <input type="text" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} placeholder="e.g. Solidity, React, TypeScript"
                className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
              <p className="text-xs text-gray-400 mt-1.5">Separate with commas</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Budget (ETH) <span className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-2 py-0.5 rounded-full ml-1">Encrypted</span>
                </label>
                <input type="number" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} placeholder="0.00"
                  className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Deadline <span className="text-red-400">*</span></label>
                <input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                  className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
              </div>
            </div>

            {status && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full border-2 border-yellow-400 border-t-transparent animate-spin"></div>
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">{status}</p>
                </div>
              </div>
            )}

            <button onClick={handleSubmit} disabled={!!status || encrypt.isPending}
              className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:opacity-50 text-black font-bold py-4 rounded-xl transition-colors text-sm">
              {status || encrypt.isPending ? "Processing..." : "Post Job with Encrypted Budget"}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
