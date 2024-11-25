import React from "react";
import { FaGithub, FaLinkedinIn, FaTwitter, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer
      className="w-full 
      rounded-t-[24px] flex flex-col items-center justify-center
      bg-white bg-opacity-20 px-5 py-5"
    >
      <hr className="w-full sm:w-100% border-t border-gray-400 pb-5" />
      <div className=" flex items-center gap-5">
        <div>
          {" "}
          <div className="flex justify-center items-center space-x-4">
            <FaLinkedinIn size={27} />
            <FaYoutube size={27} />
            <FaGithub size={27} />
            <FaTwitter size={27} />
          </div>
        </div>
        <div>
          <h1 className="text-sm font-[500px]">
            {" "}
            ©️{new Date().getFullYear()} With Love ❤️ by Rezaul Karim
          </h1>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
