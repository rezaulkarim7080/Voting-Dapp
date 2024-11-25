import React, { useContext, useEffect, useMemo, useState } from "react";
import { WalletContext } from "../../context/wallet";
import { ethers } from "ethers";
import upload from "../../../upload.json";
import { Link } from "react-router-dom";
import { createAvatar } from "@dicebear/core";

import { openPeeps } from "@dicebear/collection";
/////////////
//
const Polls = () => {
  const { truncate, signer, polls } = useContext(WalletContext);
  return (
    <div className="p-10">
      <h1 className="text-center text-[34px] font-[550px] mb-5 ">All Polls</h1>
      <h1 className="text-right  mb-5 ">Total Polls: {polls.length}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mx-auto ">
        {polls.length === 0 ? (
          <p className="text-center text-gray-500 ">No polls available.</p>
        ) : (
          polls.map((poll, i) => <Poll key={i} poll={poll} />)
        )}
      </div>
    </div>
  );
};

const Poll = ({ poll }) => {
  const { formatDate, truncate } = useContext(WalletContext);
  if (!poll) {
    return <div>Loading...</div>;
  }

  ////////////--- generate avator
  const directorAvatar = useMemo(() => {
    return createAvatar(openPeeps, {
      seed: poll?.director || "anonymous",
      size: 128,
    }).toDataUri();
  }, [poll?.director]);

  ////////---------
  //////////////

  ////////---------
  return (
    <div className=" rounded-lg  hover:shadow-xl p-2  w-full">
      <div>
        <img
          src={poll.image}
          alt={poll.title}
          className="w-[160px] md:w-full
                h-[150px] rounded-[20px] object-cover"
        />
      </div>
      <div className="">
        <h1 className="text-[18px] font-semibold capitalize">
          {truncate({
            text: poll.title || "Untitled Poll",
            startChars: 30,
            endChars: 0,
            maxLength: 33,
          })}
        </h1>
        <p className="text-[14px] font-[400px] py-2">
          {truncate({
            text: poll.description || "No description available.",
            startChars: 104,
            endChars: 0,
            maxLength: 107,
          })}
        </p>
        <div className="flex justify-between items-center gap-[8px] py-2">
          <div className="">
            {formatDate ? formatDate(poll.startsAt) : "No date"}
          </div>

          <div className="h-[32px] w-[119px] gap-[5px] flex items-center">
            <div className="h-[32px] w-[32px] rounded-full " />
            <img
              src={directorAvatar}
              alt="Director Avatar"
              className="rounded-full w-12 h-12"
            />
            <p className="text-[12px] font-[400px]">
              {truncate
                ? truncate({
                    text: poll.director || "Anonymous",
                    startChars: 4,
                    endChars: 4,
                    maxLength: 11,
                  })
                : poll.director || "Anonymous"}
            </p>
          </div>
        </div>
        <div className="md:mb-4">
          <Link
            to={`/polls/${poll.id}`}
            className="px-6 py-2 w-full  rounded-full transition-all duration-300 bg-blue-500 hover:bg-blue-700"
          >
            Enter
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Polls;
