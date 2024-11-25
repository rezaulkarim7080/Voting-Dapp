import { useContext, useEffect, useState } from "react";
import Polls from "../components/newCompolents/Polls";
import { WalletContext } from "../context/wallet";
import UpdatePoll from "./newCompolents/UpdatePoll";
import CreatePoll from "./newCompolents/CreatePoll";
import Button from "./newCompolents/Button";
import { toast } from "react-toastify";

const HomePage = ({ pollsData }) => {
  const { isConnected, userAddress, truncate } = useContext(WalletContext);
  //
  const [openCreatePoll, setOpenCreatePoll] = useState(false);
  const [showConnectWarning, setShowConnectWarning] = useState(false);

  const openCreatePollModal = () => {
    if (isConnected) {
      // Show the form if MetaMask is connected
      setOpenCreatePoll(true);
    } else {
      // Show warning if MetaMask is not connected
      setShowConnectWarning(true);
    }
  };

  const closeCreatePollModal = () => {
    setOpenCreatePoll(false);
  };

  const closeConnectWarning = () => {
    setShowConnectWarning(false);
  };

  return (
    <div>
      <div className="relative bg-[url('https://nc211.org/wp-content/uploads/2020/10/vote-resize-1200x600.jpg')] bg-cover bg-center h-[350px]">
        {/* Black overlay */}
        <div className="absolute inset-0 bg-black opacity-50"></div>

        {/* Content */}
        <div className="relative flex flex-col justify-center items-center py-5 text-white">
          <h1 className="mt-5 font-semibold">
            Address :
            {truncate
              ? truncate({
                  text: userAddress || "Anonymous",
                  startChars: 5,
                  endChars: 7,
                  maxLength: 20,
                })
              : "Anonymous"}
          </h1>
          <h1 className="mt-2 text-4xl font-semibold">Create a Voting Poll</h1>
        </div>
        <div className="relative flex">
          <button
            onClick={openCreatePollModal}
            className="w-1/5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg mx-auto"
          >
            Create Poll
          </button>
        </div>
      </div>

      {/* Show CreatePoll Modal */}
      {openCreatePoll && <CreatePoll onClose={closeCreatePollModal} />}

      {/* Warning Modal */}
      {showConnectWarning && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-5 w-[300px] text-center">
            <h2 className="text-lg font-semibold mb-4">
              MetaMask Not Connected
            </h2>
            <p className="text-gray-600 mb-4">
              Please connect MetaMask to continue.
            </p>
            <button
              onClick={closeConnectWarning}
              className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <Polls />
    </div>
  );
};

export default HomePage;
