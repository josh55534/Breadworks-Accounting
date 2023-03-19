import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import jwt_decode from "jwt-decode";


function Home() {
	const [data, setData] = useState(null);
	const token = localStorage.getItem("token");
	if(token){
		var decoded = jwt_decode(token);
	}
	useEffect(() => {
	  fetch("http://localhost:5000/")
		.then((response) => response.text())
		.then((text) => setData(text));
	}, []);
  
  
	return (
	  <div>
		<div className="grid place-items-center mt-5 bg-yellow-800 text-white py-1 px-2">
		  {data ? <div>{data}</div> : <div>Loading...</div>}
		</div>
		{decoded && decoded.user.role === "admin" && (
		  <div className="grid place-items-center pr-28">
			<Link to= '/admindashboard'>
			<button className="mt-4 bg-orange-600 rounded-sm hover:bg-orange-700 ml-44"
			  onClick={() => {
			  }}
			>
			  Go to Admin Dashboard
			</button>
			</Link>
		  </div>
		)}
		{decoded && decoded.user.verify === "unverified" && (
		  <div className="mx-auto bg-red-600 text-slate-100 w-80 mt-4">
		  You will recieve an email at {decoded.user.email} after an Admin verifies your account
		  </div>
		)}
	  </div>
	);
  }

export default Home;