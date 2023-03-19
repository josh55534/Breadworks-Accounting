import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import accountIcon from "./assets/accountIcon.png";
import LogoPic from "./assets/Breadworks.fw.png";

const Header = () => {
  const token = localStorage.getItem("token");
  const [showDropdown, setShowDropdown] = useState(false);

  function handleLogout() {
    localStorage.removeItem("token");
    setShowDropdown(false);
    window.location.reload();
  }

  return (
    <header>
      <div>
        <div className="grid place-items-center mt-5">
          <Link to="/">
            <img src={LogoPic} alt="Logo" />
          </Link>
        </div>
        {token && (
          <div className="pt-5 flex justify-end mr-2">
            <div
              className="relative"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <img src={accountIcon} alt="AccountPicture" className="cursor-pointer pr-3" />
              {showDropdown && (
                <div className="absolute right-0 bg-white shadow-lg rounded-lg py-2 mt-2">
                  <button className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {!token && location.pathname !== "/login" && location.pathname !== "/register" && (
          <div className="pt-5 flex justify-end mr-2">
            <Link to='/login'>
              <button
                className="bg-indigo-500 text-white py-2 px-4 rounded-full hover:bg-indigo-600 mr-2"
              >
                Login
              </button>
            </Link>
            <Link to='/register'>
              <button
                className="bg-red-600 text-white py-2 px-4 rounded-full hover:bg-red-800"
              >
                Register
              </button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
