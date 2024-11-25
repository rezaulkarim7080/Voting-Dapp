import React, { useContext, useMemo, useState } from "react";
import { WalletContext } from "../../context/wallet";
import { toast } from "react-toastify";
import { BiUpvote } from "react-icons/bi";
import { createAvatar } from "@dicebear/core";
import { lorelei } from "@dicebear/collection";
import { openPeeps } from "@dicebear/collection";

////
//
//////////
//// after the use of the avator / dicebear package
const Contestants = ({ contestants = [], poll }) => {
  if (!contestants.length) {
    return (
      <p className="text-center py-10 text-gray-600">
        No candidates available.
      </p>
    );
  }

  return (
    <div>
      <h1 className="text-center text-[34px] font-[550px] mb-5 py-10">
        Candidates
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mx-auto p-5">
        {contestants.map((contestant, i) => (
          <Contestant poll={poll} contestant={contestant} key={i} />
        ))}
      </div>
    </div>
  );
};

const Contestant = ({ contestant, poll }) => {
  const { userAddress, voteCandidate, truncate } = useContext(WalletContext);

  ///---add avatar-////////

  const avatar = useMemo(() => {
    return createAvatar(openPeeps, {
      seed: contestant.id || contestant.name,
      size: 128,
    }).toDataUri();
  }, [contestant.id]);

  ///----------
  const voterAvatar = useMemo(() => {
    return createAvatar(openPeeps, {
      seed: contestant.voter || "anonymous",
      size: 32,
    }).toDataUri();
  }, [contestant.voter]);

  ////////-------------------

  const [hasVoted, setHasVoted] = useState(
    contestant.voters.includes(userAddress)
  );
  const [isVoting, setIsVoting] = useState(false);

  if (!contestant) {
    return <div>Loading...</div>;
  }

  const isVotingDisabled =
    !userAddress ||
    hasVoted ||
    Date.now() < poll.startsAt ||
    Date.now() >= poll.endsAt;

  const handleVote = async () => {
    if (!userAddress) {
      return toast.warning("Connect wallet first!");
    }

    setIsVoting(true);
    try {
      await toast.promise(voteCandidate(poll.id, contestant.id), {
        pending: "Processing vote...",
        success: "Vote successfully submitted! 🎉",
        error: "Failed to submit vote. Please try again.",
      });

      setHasVoted(true);
      toast.success("Your vote has been recorded!");
    } catch (error) {
      const errorMessage = error?.reason || "An error occurred during voting.";
      toast.error(` ${errorMessage}`);
      console.error("Error while voting:", error);
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div className="rounded-[24px] flex flex-col items-center space-y-4">
      <div className="flex justify-between border items-center gap-5 hover:shadow-xl p-5 rounded-lg">
        {/* PART-1 */}
        <div>
          <img
            src={contestant.image}
            alt={`${contestant.name}'s avatar`}
            className="object-cover w-[100%] rounded-xl"
          />
        </div>
        {/* PART-2 */}
        <div>
          <h2 className="text-[20px] font-semibold capitalize">
            {contestant.name}
          </h2>

          <div className="flex gap-5 items-center">
            <img
              src={voterAvatar}
              alt="Voter avatar"
              className="w-[32px] h-[32px] rounded-full"
            />
            <p className="text-[14px] font-medium">
              {truncate
                ? truncate({
                    text: contestant.voter || "Anonymous",
                    startChars: 4,
                    endChars: 4,
                    maxLength: 11,
                  })
                : "Anonymous"}
            </p>
          </div>

          <button
            onClick={handleVote}
            disabled={isVotingDisabled || isVoting}
            title={
              !userAddress
                ? "Connect wallet to vote."
                : hasVoted
                ? "You have already voted for this contestant."
                : "Voting is not allowed at this time."
            }
            className={`w-[213px] h-[48px] rounded-full my-2 font-medium text-white transition-all ${
              isVotingDisabled
                ? "bg-[#B0BAC9] cursor-not-allowed"
                : "bg-[#1B5CFE] hover:bg-blue-500"
            }`}
          >
            {isVoting ? "Voting..." : hasVoted ? "Voted" : "Vote"}
          </button>

          <div className="flex items-center gap-5">
            <div className="w-[25px] h-[25px] rounded-[9px] flex items-center justify-center bg-[#313131]">
              <BiUpvote size={30} className="text-[#ffffff] p-1" />
            </div>
            <p
              className={`text-[14px] font-semibold my-2 ${
                contestant.votes > 10 ? "text-green-500" : "text-gray-500"
              }`}
            >
              {contestant.votes} votes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contestants;
