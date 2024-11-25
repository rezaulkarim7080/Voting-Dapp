import { useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import { WalletContext } from "../context/wallet";
import { createAvatar } from "@dicebear/core";
import { openPeeps } from "@dicebear/collection";
////

const NavBar = () => {
  ///////
  const { isConnected, userAddress, connectWallet } = useContext(WalletContext);

  ////////////--- generate avator
  const userAvatar = useMemo(() => {
    return createAvatar(openPeeps, {
      seed: userAddress || "anonymous",
      size: 128,
    }).toDataUri();
  }, [userAddress]);

  ////////---------
  //////////////

  return (
    <div>
      <div className="navbar bg-slate-50 ">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li>
                <Link to={"/"}>Home</Link>
              </li>
            </ul>
          </div>
          {/* <a >Opensea</a> */}
          <Link to={"/"} className="btn btn-ghost text-2xl text-blue-500">
            Voting Dapp
          </Link>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal text-xl px-1">
            <li>
              <Link to={"/"}>Home</Link>
            </li>
          </ul>
        </div>
        <div className="navbar-end">
          {isConnected ? (
            <div className="flex items-center gap-2">
              {/* ////---- avator  */}

              <img
                src={userAvatar}
                alt="user Avatar"
                className="rounded-full w-12 h-12"
              />
              <button className=" text-xl">
                {userAddress.slice(0, 5)}...
                {userAddress.slice(userAddress.length - 5, userAddress.length)}
              </button>
            </div>
          ) : (
            <button className="btn text-xl" onClick={() => connectWallet()}>
              Connect{" "}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
