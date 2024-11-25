import { MdModeEdit, MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import { useContext, useState, useEffect, useMemo } from "react";
import { WalletContext } from "../../context/wallet";
import { useParams } from "react-router-dom";
import UpdatePoll from "./UpdatePoll";
import DeletePoll from "./DeletePoll";
import ContestPoll from "./ContestPoll";
import Contestants from "./Contestants";
import { createAvatar } from "@dicebear/core";
import { openPeeps } from "@dicebear/collection";

///////////////

///
//////
const Details = () => {
  ////
  const { id } = useParams();
  const { getContestants, userAddress, polls, formatDate, truncate } =
    useContext(WalletContext);

  const poll = polls?.find((p) => String(p.id) === id);

  const [contestModal, setContestModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const [contestantData, setContestantData] = useState([]);
  useEffect(() => {
    const fetchContestants = async () => {
      try {
        const data = await getContestants(id);
        setContestantData(data);
      } catch (error) {
        console.error("Error fetching contestants:", error);
      }
    };

    if (id) {
      fetchContestants();
    }
  }, [id, getContestants]);
  //////////////////
  const closeModal = () => {
    setContestModal(false);
    setUpdateModal(false);
    setDeleteModal(false);
  };

  const onPressContest = () => {
    if (!userAddress) {
      return toast.warning("Connect wallet first!");
    }
    setContestModal(true);
  };
  ////////////--- generate avator
  const directorAvatar = useMemo(() => {
    return createAvatar(openPeeps, {
      seed: poll?.director || "anonymous",
      size: 128,
    }).toDataUri();
  }, [poll?.director]);

  ////////---------
  if (!poll) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h2 className="text-center text-gray-600">
          Poll not found. Please check the URL or try again later.
        </h2>
      </div>
    );
  }

  return (
    <div className="">
      {/* Poll Details */}
      <div className="w-full h-[240px] rounded-[24px] flex items-center justify-center overflow-hidden">
        <img
          className="w-full h-full object-cover"
          width={3000}
          height={500}
          src={poll.image}
          alt={poll.title}
        />
      </div>

      <div className="flex flex-col items-center justify-center space-y-6 mt-5 w-full md:max-w-[736px] mx-auto pb-10">
        <h1 className="text-[47px] font-bold text-center leading-none">
          {poll.title}
        </h1>
        <p className="text-[16px] font-medium text-center">
          {poll.description}
        </p>

        <div className="h-[136px] gap-[16px] flex flex-col items-center mt-4">
          <div className="h-[36px] py-[6px] px-[12px] rounded-full gap-[4px] border border-gray-400 bg-white bg-opacity-20">
            <p className="text-[14px] font-medium text-center md:text-[16px]">
              {formatDate(poll.startsAt)} - {formatDate(poll.endsAt)}
            </p>
          </div>
          {/* /////// ---- avator -----////////////  */}
          <div className="flex items-center gap-5 ">
            <img
              src={directorAvatar}
              alt="Director Avatar"
              className="rounded-full w-12 h-12"
            />
            <p className="text-[16px] font-medium">
              {truncate({
                text: poll.director,
                startChars: 4,
                endChars: 4,
                maxLength: 11,
              })}
            </p>
          </div>

          <div className="h-[36px] gap-[4px] flex justify-center items-center">
            <button className="py-[6px] px-[12px] border border-gray-400 bg-white bg-opacity-20 rounded-full text-[12px] md:text-[16px]">
              {poll.votes} votes
            </button>
            <button className="py-[6px] px-[12px] border border-gray-400 bg-white bg-opacity-20 rounded-full text-[12px] md:text-[16px]">
              {poll.contestants} candidates
            </button>

            {userAddress && userAddress === poll.director && poll.votes < 1 && (
              <>
                <button
                  className="py-[6px] px-[12px] border border-gray-400 bg-white bg-opacity-20 rounded-full text-[12px] md:text-[16px] gap-[8px] flex justify-center items-center"
                  onClick={() => setUpdateModal(true)}
                >
                  <MdModeEdit size={20} className="text-[#1B5CFE]" />
                  Edit poll
                </button>

                <button
                  className="py-[6px] px-[12px] border border-gray-400 bg-white bg-opacity-20 rounded-full text-[12px] md:text-[16px] gap-[8px] flex justify-center items-center hover:text-[#1B5CFE]"
                  onClick={() => setDeleteModal(true)}
                >
                  <MdDelete size={20} className="text-[#fe1b1b]" />
                  Delete poll
                </button>
              </>
            )}
          </div>

          {poll.votes < 1 && (
            <button
              className="text-black h-[45px] w-[148px] rounded-full transition-all duration-300 border border-gray-400 bg-white hover:bg-opacity-20 hover:text-[#1B5CFE] py-2"
              onClick={onPressContest}
            >
              Contest
            </button>
          )}
        </div>
      </div>

      {/* Contest Modal */}
      {contestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-transform">
          <div className="bg-white p-5 rounded-lg">
            <h3 className="text-xl">Contest Modal</h3>
            <ContestPoll poll={poll} closeModal={closeModal} />
          </div>
        </div>
      )}

      {/* Update Modal */}
      {updateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-transform">
          <div className="bg-white p-5 rounded-lg">
            <h3 className="text-xl">Update Poll</h3>
            <UpdatePoll pollData={poll} onClose={closeModal} />
          </div>
        </div>
      )}
      {/* Update Modal */}
      {deleteModal && (
        <div className="fixed inset-0  flex items-center justify-center transition-transform">
          <div className="bg-white p-5 rounded-lg">
            <h3 className="text-xl">Delete Poll</h3>
            <DeletePoll poll={poll} onClose={closeModal} />
          </div>
        </div>
      )}

      {/*Contestants */}

      {/* Contestants Section */}
      <div className="bg-white p-5 rounded-lg">
        {/* <h3 className="text-xl">Candidate</h3> */}
        <Contestants contestants={contestantData || []} poll={poll} />
      </div>
    </div>
  );
};

export default Details;
