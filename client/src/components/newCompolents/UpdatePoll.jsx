import React, { useContext, useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import { WalletContext } from "../../context/wallet";
import Button from "./Button";

const UpdatePoll = ({ pollData, onClose }) => {
  const { updatePoll, userAddress } = useContext(WalletContext);

  const [poll, setPoll] = useState({ ...pollData });
  const [btnContent, setBtnContent] = useState("Update Poll");

  useEffect(() => {
    setPoll({ ...pollData });
  }, [pollData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPoll((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!poll.title || !poll.description || !poll.startsAt || !poll.endsAt) {
      toast.warning("Please fill all the fields!");
      return;
    }

    if (!userAddress) {
      toast.warning("Connect wallet first!");
      return;
    }

    try {
      setBtnContent("Processing...");
      const updatedPoll = {
        ...poll,
        startsAt: new Date(poll.startsAt).getTime(),
        endsAt: new Date(poll.endsAt).getTime(),
      };

      await toast.promise(updatePoll(pollData.id, updatedPoll), {
        pending: "Updating poll...",
        success: "Poll updated successfully! 🎉",
        error: "Error updating poll. Please try again.",
      });

      onClose(); // Close the modal after successful update
    } catch (error) {
      console.error("Error updating poll:", error);
    } finally {
      setBtnContent("Update Poll");
    }
  };

  return (
    <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white shadow-lg rounded-xl w-11/12 md:w-2/5 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Update Poll</h2>
          <button onClick={onClose} className="text-red-500">
            <FaTimes />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={poll.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter poll title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={poll.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter poll description"
              rows="4"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Start Date</label>
            <input
              type="datetime-local"
              name="startsAt"
              value={poll.startsAt}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">End Date</label>
            <input
              type="datetime-local"
              name="endsAt"
              value={poll.endsAt}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="text-center">
            <Button
              type="submit"
              btnName={btnContent}
              className="w-full py-3"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdatePoll;
