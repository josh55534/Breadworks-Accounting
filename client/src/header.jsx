import jwt_decode from "jwt-decode";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import accountIcon from "./assets/accountIcon.png";
import LogoPic from "./assets/Breadworks.fw.png";

function HeadNavbar() {
	const [data, setData] = useState(null);
	const token = localStorage.getItem("token");
	if (token) {
		var decoded = jwt_decode(token);
	}
	useEffect(() => {
		fetch("http://localhost:5000/")
			.then((response) => response.text())
			.then((text) => setData(text));
	}, []);

	return (
		<div>
			<div className="flex flex-row justify-center gap-10">
				{token && (
					<>
						<Link to="/chartofaccounts">
							<button className="btn-navbar">
								Chart of Accounts
							</button>
						</Link>
						<Link to="/journal">
							<button className="btn-navbar">
								Journal
							</button>
						</Link>
					</>
				)}
				{decoded && decoded.user.role === "admin" && (

					<Link to='/admindashboard'>
						<button className="btn-navbar"
							onClick={() => {
							}}
						>
							Admin Dashboard
						</button>
					</Link>

				)}
				{decoded && decoded.user.verify === "unverified" && (
					<div className="mx-auto bg-red-600 text-slate-100 w-80 mt-4">
						You will recieve an email at {decoded.user.email} after an Admin verifies your account
					</div>
				)}
			</div>
		</div>
	);
}

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
      <HeadNavbar/>
    </header>
  );
};

export default Header;
