// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import { FHE, euint64, externalEuint64, ebool } from "@fhevm/solidity/lib/FHE.sol";
import { ZamaEthereumConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

contract BlindHire is ZamaEthereumConfig {

    uint256 public jobCount;

    enum JobStatus { Open, Awarded, Completed, Cancelled }

    struct Job {
        uint256 id;
        address client;
        string title;
        string description;
        string skillsRequired;
        uint256 deadline;
        euint64 encryptedBudget;
        JobStatus status;
        address winner;
        uint256 bidCount;
    }

    struct Bid {
        address freelancer;
        euint64 encryptedAmount;
        bool exists;
    }

    mapping(uint256 => Job) public jobs;
    mapping(uint256 => mapping(address => Bid)) public bids;
    mapping(uint256 => address[]) public jobBidders;

    event JobPosted(uint256 indexed jobId, address indexed client, string title, uint256 deadline);
    event BidSubmitted(uint256 indexed jobId, address indexed freelancer);
    event WinnerSelected(uint256 indexed jobId, address indexed winner);
    event PaymentReleased(uint256 indexed jobId, address indexed winner);
    event JobCancelled(uint256 indexed jobId);

    modifier onlyClient(uint256 jobId) {
        require(jobs[jobId].client == msg.sender, "Not the client");
        _;
    }

    modifier jobExists(uint256 jobId) {
        require(jobId < jobCount, "Job does not exist");
        _;
    }

    function postJob(
        string calldata title,
        string calldata description,
        string calldata skillsRequired,
        uint256 deadline,
        externalEuint64 encryptedBudget,
        bytes calldata inputProof
    ) external {
        require(deadline > block.timestamp, "Deadline must be in future");

        euint64 budget = FHE.fromExternal(encryptedBudget, inputProof);

        uint256 jobId = jobCount++;
        jobs[jobId] = Job({
            id: jobId,
            client: msg.sender,
            title: title,
            description: description,
            skillsRequired: skillsRequired,
            deadline: deadline,
            encryptedBudget: budget,
            status: JobStatus.Open,
            winner: address(0),
            bidCount: 0
        });

        FHE.allowThis(budget);
        FHE.allow(budget, msg.sender);

        emit JobPosted(jobId, msg.sender, title, deadline);
    }

    function submitBid(
        uint256 jobId,
        externalEuint64 encryptedAmount,
        bytes calldata inputProof
    ) external jobExists(jobId) {
        require(jobs[jobId].status == JobStatus.Open, "Job not open");
        require(jobs[jobId].client != msg.sender, "Client cannot bid");
        require(!bids[jobId][msg.sender].exists, "Already bid");
        require(block.timestamp < jobs[jobId].deadline, "Deadline passed");

        euint64 amount = FHE.fromExternal(encryptedAmount, inputProof);

        bids[jobId][msg.sender] = Bid({
            freelancer: msg.sender,
            encryptedAmount: amount,
            exists: true
        });

        jobBidders[jobId].push(msg.sender);
        jobs[jobId].bidCount++;

        FHE.allowThis(amount);
        FHE.allow(amount, msg.sender);
        FHE.allow(amount, jobs[jobId].client);

        emit BidSubmitted(jobId, msg.sender);
    }

    function selectWinner(
        uint256 jobId,
        address freelancer
    ) external onlyClient(jobId) jobExists(jobId) {
        require(jobs[jobId].status == JobStatus.Open, "Job not open");
        require(bids[jobId][freelancer].exists, "No bid from this freelancer");

        jobs[jobId].status = JobStatus.Awarded;
        jobs[jobId].winner = freelancer;

        emit WinnerSelected(jobId, freelancer);
    }

    function completeJob(uint256 jobId) external onlyClient(jobId) jobExists(jobId) {
        require(jobs[jobId].status == JobStatus.Awarded, "Job not awarded");
        jobs[jobId].status = JobStatus.Completed;
        emit PaymentReleased(jobId, jobs[jobId].winner);
    }

    function cancelJob(uint256 jobId) external onlyClient(jobId) jobExists(jobId) {
        require(jobs[jobId].status == JobStatus.Open, "Job not open");
        jobs[jobId].status = JobStatus.Cancelled;
        emit JobCancelled(jobId);
    }

    function getJobBidders(uint256 jobId) external view returns (address[] memory) {
        return jobBidders[jobId];
    }

    function getJob(uint256 jobId) external view returns (
        uint256 id,
        address client,
        string memory title,
        string memory description,
        string memory skillsRequired,
        uint256 deadline,
        uint8 status,
        address winner,
        uint256 bidCount
    ) {
        Job storage job = jobs[jobId];
        return (
            job.id,
            job.client,
            job.title,
            job.description,
            job.skillsRequired,
            job.deadline,
            uint8(job.status),
            job.winner,
            job.bidCount
        );
    }
}
