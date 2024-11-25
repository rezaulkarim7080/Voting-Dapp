// import { BrowserProvider, ethers } from "ethers";
// import { useContext, useEffect, useState } from "react";
// import upload from "../../upload.json";
// ///////////
// //////////
// ///////

// //////////////----------------------------////////////

// ////

// /////////////////-----------GET CONTRACT INSTANCE --------/////////////
// const getEthereumContract = async () => {
//   if (!signer) return;
//   const contract = new ethers.Contract(upload.address, upload.abi, signer);
//   return contract;
// };

// /////////////////-----------CREATE POLL FUNCTION --------/////////////

// const createPoll = async (data) => {
//   const [polls, setPolls] = useState([]);

//   if (!signer) return;

//   try {
//     const contract = await getEthereumContract();
//     const { image, title, description, startsAt, endsAt } = data;
//     const tx = await contract.createPoll(
//       image,
//       title,
//       description,
//       startsAt,
//       endsAt
//     );

//     await tx.wait();
//     const polls = await getPolls();
//     setPolls(polls);
//     return Promise.resolve(tx);
//   } catch (error) {
//     reportError(error);
//     return Promise.reject(error);
//   }
// };

// /////////////////-----------UPDATE POLL FUNCTION --------/////////////
// const updatePoll = async (id, data) => {
//   const [poll, setPoll] = useState(null);
//   if (!signer) return;

//   try {
//     const contract = await getEthereumContract();
//     const { image, title, description, startsAt, endsAt } = data;
//     const tx = await contract.updatePoll(
//       id,
//       image,
//       title,
//       description,
//       startsAt,
//       endsAt
//     );

//     await tx.wait();
//     const poll = await getPoll(id);
//     setPoll(poll);
//     return Promise.resolve(tx);
//   } catch (error) {
//     reportError(error);
//     return Promise.reject(error);
//   }
// };

// /////////////////-----------DELETE POLL FUNCTION --------/////////////
// const deletePoll = async (id) => {
//   if (!signer) return;

//   try {
//     const contract = await getEthereumContract();
//     const tx = await contract.deletePoll(id);

//     await tx.wait();
//     return Promise.resolve(tx);
//   } catch (error) {
//     reportError(error);
//     return Promise.reject(error);
//   }
// };

// /////////////////-----------CONTEST POLL FUNCTION --------/////////////
// const contestPoll = async (id, name, image) => {
//   const [contestants, setContestants] = useState([]);
//   if (!signer) return;
//   try {
//     const contract = await getEthereumContract();
//     const tx = await contract.contest(id, name, image);

//     await tx.wait();
//     const poll = await getPoll(id);
//     setPoll(poll);

//     const contestants = await getContestants(id);
//     setContestants(contestants);
//     return Promise.resolve(tx);
//   } catch (error) {
//     reportError(error);
//     return Promise.reject(error);
//   }
// };

// /////////////////-----------VOTE FOR CANDIDATE FUNCTION --------/////////////
// const voteCandidate = async (id, cid) => {
//   try {
//     const contract = await getEthereumContract();
//     const tx = await contract.vote(id, cid);

//     await tx.wait();
//     const poll = await getPoll(id);
//     setPoll(poll);

//     const contestants = await getContestants(id);
//     setContestants(contestants);
//     return Promise.resolve(tx);
//   } catch (error) {
//     reportError(error);
//     return Promise.reject(error);
//   }
// };

// /////////////////-----------GET POLLS FUNCTION --------/////////////
// const getPolls = async () => {
//   const contract = await getEthereumContract();
//   const polls = await contract.getPolls();
//   return structurePolls(polls);
// };

// const getPoll = async (id) => {
//   const contract = await getEthereumContract();
//   const polls = await contract.getPoll(id);
//   return structurePolls([polls])[0];
// };

// const getContestants = async (id) => {
//   const contract = await getEthereumContract();
//   const contestants = await contract.getContestants(id);
//   return structureContestants(contestants);
// };

// /////////////////-----------HELPER FUNCTIONS --------/////////////
// const truncate = ({ text, startChars, endChars, maxLength }) => {
//   if (text.length > maxLength) {
//     let start = text.substring(0, startChars);
//     let end = text.substring(text.length - endChars, text.length);
//     while (start.length + end.length < maxLength) {
//       start = start + ".";
//     }
//     return start + end;
//   }
//   return text;
// };

// const formatDate = (timestamp) => {
//   const date = new Date(timestamp);
//   const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
//   const months = [
//     "Jan",
//     "Feb",
//     "Mar",
//     "Apr",
//     "May",
//     "Jun",
//     "Jul",
//     "Aug",
//     "Sep",
//     "Oct",
//     "Nov",
//     "Dec",
//   ];

//   const dayOfWeek = daysOfWeek[date.getUTCDay()];
//   const month = months[date.getUTCMonth()];
//   const day = date.getUTCDate();
//   const year = date.getUTCFullYear();

//   return `${dayOfWeek}, ${month} ${day}, ${year}`;
// };

// const formatTimestamp = (timestamp) => {
//   const date = new Date(timestamp);

//   const year = date.getFullYear();
//   const month = String(date.getMonth() + 1).padStart(2, "0");
//   const day = String(date.getDate()).padStart(2, "0");
//   const hours = String(date.getHours()).padStart(2, "0");
//   const minutes = String(date.getMinutes()).padStart(2, "0");

//   return `${year}-${month}-${day}T${hours}:${minutes}`;
// };

// const structurePolls = (polls) =>
//   polls
//     .map((poll) => ({
//       id: Number(poll.id),
//       image: poll.image,
//       title: poll.title,
//       description: poll.description,
//       votes: Number(poll.votes),
//       contestants: Number(poll.contestants),
//       deleted: poll.deleted,
//       director: poll.director.toLowerCase(),
//       startsAt: Number(poll.startsAt),
//       endsAt: Number(poll.endsAt),
//       timestamp: Number(poll.timestamp),
//       voters: poll.voters.map((voter) => voter.toLowerCase()),
//       avatars: poll.avatars,
//     }))
//     .sort((a, b) => b.timestamp - a.timestamp);

// const structureContestants = (contestants) =>
//   contestants
//     .map((contestant) => ({
//       id: Number(contestant.id),
//       image: contestant.image,
//       name: contestant.name,
//       voter: contestant.voter.toLowerCase(),
//       votes: Number(contestant.votes),
//       voters: contestant.voters.map((voter) => voter.toLowerCase()),
//     }))
//     .sort((a, b) => b.votes - a.votes);
// export {
//   getPoll,
//   getPolls,
//   createPoll,
//   updatePoll,
//   deletePoll,
//   contestPoll,
//   voteCandidate,
//   truncate,
//   formatDate,
//   formatTimestamp,
//   signer,
// };
