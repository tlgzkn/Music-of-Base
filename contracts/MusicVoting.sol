// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title Music of Base Voting
 * @dev Daily voting contract for music curation on Base Mainnet
 */
contract MusicVoting {
    
    struct Song {
        uint256 id;
        string title;
        string artist;
        string coverUrl;
        bool active;
    }

    struct DailyWinner {
        uint256 day;
        uint256 songId;
        uint256 voteCount;
        uint256 timestamp;
    }

    // State Variables
    address public owner;
    uint256 public currentDay;
    uint256 public lastResetTimestamp;
    
    Song[] public candidates;
    DailyWinner[] public history;

    // Mappings
    // day => user => hasVoted
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    // day => songId => voteCount
    mapping(uint256 => mapping(uint256 => uint256)) public dailyVotes;

    // Events
    event VoteCast(address indexed voter, uint256 indexed songId, uint256 day);
    event DayEnded(uint256 indexed day, uint256 winnerSongId, uint256 votes);
    event SongAdded(uint256 songId, string title, string artist);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
        currentDay = 1;
        lastResetTimestamp = block.timestamp;
        
        // Initial Data Seed
        addCandidate("Based Harmony", "Crypto Beats", "https://picsum.photos/id/10/300/300");
        addCandidate("Blue Chain Symphony", "The Nodes", "https://picsum.photos/id/20/300/300");
        addCandidate("Gas Fees Low", "L2 Legends", "https://picsum.photos/id/30/300/300");
    }

    function addCandidate(string memory _title, string memory _artist, string memory _coverUrl) public onlyOwner {
        uint256 newId = candidates.length;
        candidates.push(Song({
            id: newId,
            title: _title,
            artist: _artist,
            coverUrl: _coverUrl,
            active: true
        }));
        emit SongAdded(newId, _title, _artist);
    }

    function vote(uint256 _songId) external {
        require(_songId < candidates.length, "Invalid song ID");
        require(candidates[_songId].active, "Song inactive");
        require(!hasVoted[currentDay][msg.sender], "Already voted today");

        // Record vote
        hasVoted[currentDay][msg.sender] = true;
        dailyVotes[currentDay][_songId]++;

        emit VoteCast(msg.sender, _songId, currentDay);
    }

    /**
     * @dev Ends the current day, picks a winner, and resets for the next day.
     * In production, this should be called by Chainlink Automation or a Cron Job.
     */
    function endDay() external onlyOwner {
        // Ensure at least 24 hours have passed (Optional constraint, can be removed for testing)
        // require(block.timestamp >= lastResetTimestamp + 24 hours, "Day not over");
        
        uint256 winningSongId = 0;
        uint256 winningVoteCount = 0;

        // Determine Winner
        for (uint256 i = 0; i < candidates.length; i++) {
            if (candidates[i].active) {
                uint256 votes = dailyVotes[currentDay][i];
                if (votes > winningVoteCount) {
                    winningVoteCount = votes;
                    winningSongId = i;
                }
            }
        }

        // Record History
        history.push(DailyWinner({
            day: currentDay,
            songId: winningSongId,
            voteCount: winningVoteCount,
            timestamp: block.timestamp
        }));

        emit DayEnded(currentDay, winningSongId, winningVoteCount);

        // Advance Day (Using a new day index is cheaper than deleting mappings)
        currentDay++;
        lastResetTimestamp = block.timestamp;
    }

    // View Functions
    function getCandidateCount() external view returns (uint256) {
        return candidates.length;
    }

    function getVotesForSong(uint256 _songId) external view returns (uint256) {
        return dailyVotes[currentDay][_songId];
    }
    
    function getAllCandidates() external view returns (Song[] memory) {
        return candidates;
    }
}