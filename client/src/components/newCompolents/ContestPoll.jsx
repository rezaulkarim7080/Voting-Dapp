import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import { FaTimes } from "react-icons/fa";
import { WalletContext } from "../../context/wallet";
import { uploadFileToIPFS } from "../../components/pinata";

const ContestPoll = ({ poll, closeModal }) => {
  const { userAddress, contestPoll } = useContext(WalletContext);
  const [contestant, setContestant] = useState({
    name: "",
    image: "",
  });
  const [uploadMessage, setUploadMessage] = useState("");
  const [btnContent, setBtnContent] = useState("Contest Now");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setContestant((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
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
        setContestant((prevState) => ({
          ...prevState,
          image: response.pinataURL,
        }));
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

    if (!contestant.name || !contestant.image) {
      return toast.warning("Please fill out all fields.");
    }

    if (!userAddress) {
      return toast.warning("Connect your wallet first!");
    }

    try {
      setBtnContent("Processing...");

      await toast
        .promise(contestPoll(poll.id, contestant.name, contestant.image), {
          pending: "Processing transaction...",
          success: "You have successfully contested the poll! 🎉",
          error: "An error occurred during the process.",
        })

        .catch((error) => {
          const errorMessage =
            error?.reason || "An error occurred during voting.";
          toast.error(` ${errorMessage}`);
          console.error("Error while voting:", error);
        });

      closeModal();
      setContestant({ name: "", image: "" }); // Reset form
      setImagePreview("");
    } catch (error) {
      console.error("Error while contesting poll:", error);
    } finally {
      setBtnContent("Contest Now");
    }
  };

  return (
    <div className="fixed inset-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-[#f7f7f7] text-[#131313] rounded-xl w-11/12 md:w-2/5 h-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-lg">Become a Candidates</h2>
          <button
            onClick={closeModal}
            className="] hover:text-white focus:outline-none"
            aria-label="Close modal"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contestant Name */}
          <div className="flex items-center border border-[#212D4A] rounded-full px-4 py-3">
            <input
              type="text"
              name="name"
              value={contestant.name}
              onChange={handleChange}
              placeholder="Contestant Name"
              className="w-full bg-transparent text-sm  placeholder-[#929292] outline-none"
              required
            />
          </div>

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
                  <span
                    className="text-gray-500 text-center
                  "
                  >
                    No Image
                  </span>
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
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-full bg-[#1B5CFE] text-sm font-bold  hover:bg-blue-500 transition-all"
            disabled={btnContent !== "Contest Now"}
          >
            {btnContent}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContestPoll;
