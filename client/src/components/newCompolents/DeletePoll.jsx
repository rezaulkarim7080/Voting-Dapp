import { useContext, useState } from "react";
import { WalletContext } from "../../context/wallet";
import { toast } from "react-toastify";
import { FaTimes } from "react-icons/fa";
import { BsTrash3Fill } from "react-icons/bs";

const DeletePoll = ({ poll, onClose }) => {
  const { userAddress, deletePoll } = useContext(WalletContext);
  const [btnContent, setBtnContent] = useState("Delete Poll");

  const handleDelete = async () => {
    if (!userAddress) {
      return toast.warning("Connect wallet first!");
    }

    try {
      setBtnContent("Processing...");
      await toast.promise(deletePoll(poll.id), {
        pending: "Deleting poll...",
        success: "Poll deleted successfully 👌",
        error: "Error deleting poll 🤯",
      });
      onClose(); // Close the modal after successful deletion
    } catch (error) {
      console.error("Error deleting poll:", error);
    } finally {
      setBtnContent("Delete Poll");
    }
  };

  return (
    <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-[#fafafa]  shadow-lg  rounded-xl w-11/12 md:w-2/5  p-6">
        <div className="flex justify-between items-center mb-4">
          <p className="font-semibold text-lg">Delete Poll</p>
          <button
            onClick={onClose}
            className="border-0 bg-transparent focus:outline-none text-white"
          >
            <FaTimes />
          </button>
        </div>

        <div className="flex flex-col justify-center items-center space-y-4">
          <p className="text-xl font-boldtext-center font-bold">
            Do you really want to delete this poll?
          </p>
          <small className="text-xl  text-gray-400">{poll?.title}</small>

          <div className="mt-4 flex space-x-2">
            <button
              className="w-[48%] py-1 px-4 rounded-full text-sm font-bold bg-red-600 hover:bg-red-500 text-white"
              onClick={handleDelete}
            >
              {btnContent}
            </button>
            <button
              className="w-[48%] py-1 px-4 rounded-full text-sm font-bold bg-gray-600 hover:bg-gray-500 text-white"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeletePoll;
