import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
const token = localStorage.getItem("token");

function JournalNavbar() {
    return (
        <div className="flex flex-row justify-center gap-5">
            <Link to="/journal/account" className="btn-primary">Accounts</Link>
            <Link to="/journal/entries" className="btn-primary">General Journal</Link>
            <Link to="/journal/entries/pending" className="btn-primary">Pending Entries</Link>
        </div>
    )
}

function JournalHome() {
    return (
        <div className="window-primary max-w-5xl text-center">
            <h2>Journal Home</h2>
            <JournalNavbar />
        </div>
    )
}

export { JournalHome, JournalNavbar }