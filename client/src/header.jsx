import jwt_decode from "jwt-decode";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import accountIcon from "./assets/accountIcon.png";
import LogoPic from "./assets/Breadworks.fw.png";


function Logo(props) {
  return (
    <div className="flex justify-center">
      <Link to="/" onClick={() => window.location.href = "/"}>
        <img src={LogoPic} alt="Logo" />
      </Link>
    </div>);
}

function Header() {
  const token = localStorage.getItem("token");
  const [Fname, setName] = useState("");

  function handleLogout() {
    localStorage.removeItem("token");
    window.location.href = "/";
  }

  useEffect(() => {
    if (token) {
      var decoded = jwt_decode(token)
      setName(decoded.user.Fname);
    }
  })

  return (
    <header>
      <div className="grid grid-cols-3 my-auto justify-end py-5">
        <p></p>
        <Logo />
        {token && (
          <div className="flex justify-end">
            <div
              className="account-leaflet"
            >
              <div className="container w-auto">
                <img src={accountIcon} alt="AccountPicture" className="profile-picture" />
              </div>
              <div className="account-leaflet-info">
                <p className="mt-auto">Welcome, {Fname}</p>
                <div className="flex flex-row justify-between">
                <button className="btn-logout"
                  onClick={handleLogout}
                >
                  Profile
                </button>
                <button className="btn-logout"
                  onClick={handleLogout}
                >
                  Logout
                </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {!token && location.pathname !== "/login" && location.pathname !== "/register" && (
          <div className="flex justify-end">
            <div
              className="account-leaflet"
            >
              <img src={accountIcon} alt="AccountPicture" className="profile-picture" />
              <div className="account-leaflet-info">
                <p className="mt-auto">Not signed in</p>
                <button
                  className="btn-logout ml-auto"
                  onClick={() => window.location.href = "/login"}
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
