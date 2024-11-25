import React, { useContext, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import { WalletContext } from "../../context/wallet";
import { uploadFileToIPFS } from "../../components/pinata";
import Button from "./Button";

const CreatePoll = ({ onClose }) => {
  const { userAddress, createPoll } = useContext(WalletContext);
  const [poll, setPoll] = useState({
    image: "",
    title: "",
    description: "",
    startsAt: "",
    endsAt: "",
  });
  const [btnContent, setBtnContent] = useState("Create Poll");
  const [message, setMessage] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  // Handle image upload
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setMessage("Uploading image...");
    try {
      const formData = new FormData();
      formData.set("file", file);

      const response = await uploadFileToIPFS(formData);
      if (response.success) {
        setPoll({ ...poll, image: response.pinataURL });
        setImagePreview(URL.createObjectURL(file));
        setMessage("");
      } else {
        setMessage("Image upload failed. Try again.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setMessage("Error uploading image.");
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !poll.image ||
      !poll.title ||
      !poll.description ||
      !poll.startsAt ||
      !poll.endsAt
    ) {
      toast.warning("Please fill all the fields!");
      return;
    }
    if (!userAddress) {
      toast.warning("Connect wallet first!");
      return;
    }

    try {
      setBtnContent("Processing...");
      poll.startsAt = new Date(poll.startsAt).getTime();
      poll.endsAt = new Date(poll.endsAt).getTime();

      await toast.promise(createPoll(poll), {
        pending: "Submitting transaction...",
        success: "Poll created successfully! 🎉",
        error: "Error creating poll. Please try again.",
      });

      setPoll({
        image: "",
        title: "",
        description: "",
        startsAt: "",
        endsAt: "",
      });
      setImagePreview("");
    } catch (error) {
      console.error("Error creating poll:", error);
    } finally {
      setBtnContent("Create Poll");
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPoll((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white text-black shadow-lg rounded-xl w-11/12 md:w-2/5 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Create A Voting Poll</h2>
          {/* Close Button */}
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <FaTimes size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">Poll Image</label>
            <div className="flex items-center">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Poll Preview"
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
              ) : (
                <div className="w-16 h-16 border flex items-center justify-center rounded-full mr-4">
                  <span className="text-gray-500 text-center">No Image</span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block text-sm text-gray-500 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
            <p className="text-sm text-teal-500 mt-1">{message}</p>
          </div>
          {/* Title */}
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
          {/* Description */}
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
          {/* Start Date */}
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
          {/* End Date */}
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
          {/* Submit Button */}
          <div className="text-center">
            <Button
              type="submit"
              btnName="Create Poll"
              className="w-full py-3"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePoll;
