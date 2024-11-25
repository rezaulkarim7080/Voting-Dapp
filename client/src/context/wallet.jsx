"use client";

import upload from "../../upload.json";
import { BrowserProvider, ethers } from "ethers";
import { createContext, useEffect, useState } from "react";

export const WalletContext = createContext();

export const WalletContextProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [userAddress, setUserAddress] = useState(null);
  const [signer, setSigner] = useState(null);
  //////
  const [poll, setPoll] = useState(null);
  const [polls, setPolls] = useState([]);
  const [contestants, setContestants] = useState([]);

  ////
  //////

  /////////////

  /////////////////-----------EFFECT: RECONNECT WALLET --------/////////////
  useEffect(() => {
    const savedAddress = window.localStorage.getItem("userAddress");
    if (savedAddress) {
      setIsConnected(true);
      setUserAddress(savedAddress);

      const reconnectWallet = async () => {
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        setSigner(signer);
      };
      reconnectWallet();
    }

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          setUserAddress(accounts[0]);
          window.localStorage.setItem("userAddress", accounts[0]);
        }
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", () => {});
      }
    };
  }, []);

  /////////////////-----------CONNECT WALLET FUNCTION --------/////////////
  const connectWallet = async () => {
    if (!window.ethereum) {
      throw new Error("Metamask is not installed");
    }

    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      setSigner(signer);
      console.log("signer", signer);
      const accounts = await provider.send("eth_requestAccounts", []);
      setIsConnected(true);
      setUserAddress(accounts[0]);

      // Save the connected address in localStorage
      window.localStorage.setItem("userAddress", accounts[0]);

      const network = await provider.getNetwork();
      const chainId = network.chainId;
      const sepoliaNetworkId = "11155111";

      if (chainId != sepoliaNetworkId) {
        alert("Please switch your Metamask to sepolia network");
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  /////////////////-----------DISCONNECT WALLET FUNCTION --------/////////////
  const disconnectWallet = async () => {
    setIsConnected(false);
    setUserAddress(null);
    setSigner(null); // Clears signer on disconnect
    window.localStorage.removeItem("userAddress");
  };

  /////////////////-----------GET CONTRACT INSTANCE --------/////////////
  const getEthereumContract = async () => {
    if (!signer) {
      console.error("Signer not set");
      return null;
    }
    const contract = new ethers.Contract(upload.address, upload.abi, signer);
    console.log("Contract instance created:", contract);
    return contract;
  };

  /////////////////-----------CREATE POLL FUNCTION --------/////////////

  const createPoll = async (data) => {
    if (!signer) {
      console.error("No signer available");
      return;
    }

    try {
      const contract = await getEthereumContract();
      console.log("Creating poll with data:", data);

      const tx = await contract.createPoll(
        data.image,
        data.title,
        data.description,
        data.startsAt,
        data.endsAt
      );
      console.log("Transaction submitted:", tx);

      await tx.wait();
      console.log("Transaction confirmed");

      const polls = await getPolls();
      setPolls(polls);
      return Promise.resolve(tx);
    } catch (error) {
      console.error("Error creating poll:", error);
      return Promise.reject(error);
    }
  };

  /////////////////-----------UPDATE POLL FUNCTION --------/////////////
  const updatePoll = async (id, data) => {
    if (!signer) return;

    try {
      const contract = await getEthereumContract();
      const { image, title, description, startsAt, endsAt } = data;
      const tx = await contract.updatePoll(
        id,
        image,
        title,
        description,
        startsAt,
        endsAt
      );

      await tx.wait();
      const poll = await getPoll(id);
      setPoll(poll);
      return Promise.resolve(tx);
    } catch (error) {
      reportError(error);
      return Promise.reject(error);
    }
  };

  /////////////////-----------DELETE POLL FUNCTION --------/////////////
  const deletePoll = async (id) => {
    if (!signer) return;

    try {
      const contract = await getEthereumContract();
      const tx = await contract.deletePoll(id);

      await tx.wait();
      return Promise.resolve(tx);
    } catch (error) {
      reportError(error);
      return Promise.reject(error);
    }
  };

  /////////////////-----------CONTEST POLL FUNCTION --------/////////////
  const contestPoll = async (id, name, image) => {
    if (!signer) return;
    try {
      const contract = await getEthereumContract();
      const tx = await contract.contest(id, name, image);

      if (!tx || !tx.wait) {
        throw new Error("Transaction object is invalid");
      }
      await tx.wait();
      const poll = await getPoll(id);
      setPoll(poll);

      const contestants = await getContestants(id);
      setContestants(contestants);
      console.log("Transaction object:", tx);

      return tx;
    } catch (error) {
      console.error("Error in contestPoll:", error);
      throw error; // Rethrow the error for better handling
    }
  };

  /////////////////-----------VOTE FOR CANDIDATE FUNCTION --------/////////////
  const voteCandidate = async (id, cid) => {
    try {
      const contract = await getEthereumContract();
      const tx = await contract.vote(id, cid);

      await tx.wait();
      const poll = await getPoll(id);
      setPoll(poll);

      const contestants = await getContestants(id);
      setContestants(contestants);
      return Promise.resolve(tx);
    } catch (error) {
      reportError(error);
      return Promise.reject(error);
    }
  };

  /////////////////-----------GET POLLS FUNCTION --------/////////////
  const getPolls = async () => {
    const contract = await getEthereumContract();
    const polls = await contract.getPolls();
    return structurePolls(polls);
  };

  ///////////-----

  const getPoll = async (id) => {
    const contract = await getEthereumContract();
    const polls = await contract.getPoll(id);
    return structurePolls([polls])[0];
  };

  const getContestants = async (id) => {
    const contract = await getEthereumContract();
    const contestants = await contract.getContestants(id);
    return structureContestants(contestants);
  };

  /////////////////-----------HELPER FUNCTIONS --------/////////////
  const truncate = ({ text, startChars, endChars, maxLength }) => {
    if (text.length > maxLength) {
      let start = text.substring(0, startChars);
      let end = text.substring(text.length - endChars, text.length);
      while (start.length + end.length < maxLength) {
        start = start + ".";
      }
      return start + end;
    }
    return text;
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const dayOfWeek = daysOfWeek[date.getUTCDay()];
    const month = months[date.getUTCMonth()];
    const day = date.getUTCDate();
    const year = date.getUTCFullYear();

    return `${dayOfWeek}, ${month} ${day}, ${year}`;
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const structurePolls = (polls) =>
    polls
      .map((poll) => ({
        id: Number(poll.id),
        image: poll.image,
        title: poll.title,
        description: poll.description,
        votes: Number(poll.votes),
        contestants: Number(poll.contestants),
        deleted: poll.deleted,
        director: poll.director.toLowerCase(),
        startsAt: Number(poll.startsAt),
        endsAt: Number(poll.endsAt),
        timestamp: Number(poll.timestamp),
        voters: poll.voters.map((voter) => voter.toLowerCase()),
        avatars: poll.avatars,
      }))
      .sort((a, b) => b.timestamp - a.timestamp);

  const structureContestants = (contestants) =>
    contestants
      .map((contestant) => ({
        id: Number(contestant.id),
        image: contestant.image,
        name: contestant.name,
        voter: contestant.voter.toLowerCase(),
        votes: Number(contestant.votes),
        voters: contestant.voters.map((voter) => voter.toLowerCase()),
      }))
      .sort((a, b) => b.votes - a.votes);

  ///////////////------------------

  useEffect(() => {
    console.log("Polls updated:", polls);
  }, [polls]);

  useEffect(() => {
    console.log("Poll updated:", poll);
  }, [poll]);

  useEffect(() => {
    console.log("Contestants updated:", contestants);
  }, [contestants]);

  useEffect(() => {
    const fetchPolls = async () => {
      if (!signer) {
        console.warn("Cannot fetch polls: Wallet not connected.");
        return;
      }
      try {
        const polls = await getPolls();
        console.log("Fetched polls:", polls);
        setPolls(polls);
      } catch (error) {
        console.error("Error fetching polls:", error);
      }
    };

    if (isConnected && signer) {
      fetchPolls();
    }
  }, [isConnected, signer]);

  /////////////////-----------PROVIDER RETURN --------/////////////
  return (
    <WalletContext.Provider
      value={{
        connectWallet,
        disconnectWallet,
        isConnected,
        userAddress,
        getPoll,
        polls,
        getPolls,
        createPoll,
        updatePoll,
        deletePoll,
        contestPoll,
        voteCandidate,
        truncate,
        formatDate,
        getContestants,
        formatTimestamp,
        signer,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
