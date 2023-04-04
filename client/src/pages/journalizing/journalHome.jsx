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
        <div className="window-primary max-w-5xl">
            <h2 className="text-center">Journal</h2>
            <JournalNavbar />
            <div className="text-center mt-2">
                <label>To get started, click on one of the tabs above.</label>
                <label>Information on the tabs can be found below.</label>
            </div>
            <label className="mt-2">Information:</label>
            <div className="ml-4">
                <div className="mt-1">
                    <label>Accounts</label>
                    <p className="ml-4">
                        Lists all accounts and by selecting an account, the user can view the account ledger.
                    </p>
                </div>
                <div className="mt-2">
                    <label>General Journal</label>
                    <p className="ml-4">
                        Lists all journal entries in the general journal. Accountants and Managers can create new journal entries
                        on the general ledger page. Selecting a journal entry will bring up details about the entry.
                    </p>
                </div>
                <div className="mt-2">
                    <label>Pending Entries</label>
                    <p className="ml-4">
                        Lists all journal entries that are pending approval for a manager. Selecting a journal entry will allow a
                        manager to approve or reject a jouurnal entry submitted by Accountants and Managers.
                    </p>
                </div>
            </div>
        </div>
    )
}

export { JournalHome, JournalNavbar }