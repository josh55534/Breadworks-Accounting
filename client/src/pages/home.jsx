import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import jwt_decode from "jwt-decode";

function LoggedIn() {
	return (
		<div className="window-primary max-w-5xl">
			<div className="text-center">
				<h2>Breadworks Home Page</h2>
				<label>To get started, click on one of the tabs above.</label>
				<label>Information on the tabs can be found below.</label>
			</div>
			<label>Information:</label>
			<div className="ml-4">
				<div className="mt-1">
					<label>Chart of Accounts</label>
					<p className="ml-4">
						Lists all accounts and their general information. Administrators can also create and edit account information here.
					</p>
				</div>
				<div className="mt-2">
					<label>Journal</label>
					<p className="ml-4">
						View and create journal transactions. Accountants and Managers can create new journal entries to update balance of accounts.
						Managers can see a list of pending journal entries and either approve or reject changes. New journal entries must be approved
						by managers before their changes go into effect. Journal entries may be viewed directly from the general journal, or as 
						transactions in account ledgers.
					</p>
				</div>
			</div>
		</div>
	)
}

function LandingPage() {
	return (
		<div className="window-primary max-w-5xl text-center">
			<h2 className="text-center">Let's Get This Bread!</h2>
			<label>Start accounting now!</label>
			<div className="flex justify-center gap-5 mt-3">
				<div className="flex flex-col text-center">
					<p>Have an account?</p>
					<Link to="/login" className="btn-primary mx-auto">
						Login
					</Link>
				</div>
				<div className="flex flex-col text-center">
					<p>New Users</p>
					<Link to="/register" className="btn-primary btn-color-red mx-auto">
						Create Account
					</Link>
				</div>
			</div>
		</div>
	)
}

function Home() {
	const token = localStorage.getItem("token");

	if (token) return (<LoggedIn />)
	else return (<LandingPage />)
}

export default Home;