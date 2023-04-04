import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import jwt_decode from "jwt-decode";
const token = localStorage.getItem("token");

function JournalEntry() {
  // TODO: ADD JOURNAL ENTRY FILE DOWNLOAD
  const { journalEntryID } = useParams();
  const [debitAccountID, setDebitID] = useState("");
  const [debitAccountName, setDebitName] = useState("");
  const [creditAccountID, setCreditID] = useState("");
  const [creditAccountName, setCreditName] = useState("");
  const [desc, setDesc] = useState("");
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState();
  const [journalStatus, setStatus] = useState("");
  const [toBeVerified, setToBeVerified] = useState(false);
  const [isManager, setManager] = useState("");

  const navigate = useNavigate();

  if (token) {
    var decoded = jwt_decode(token);
  }

  useEffect(() => {
    // TODO: GET ACTUAL JOURNAL ENTRY DATA
    setDebitID("1-001");
    setDebitName("Cash");
    setCreditID("2-001");
    setCreditName("Debt");
    setAmount(200.00);
    setDesc("This is a journal entry");
    setDate("2/23/2023");
    setStatus("pending");

    if (journalStatus === "pending") setToBeVerified(true);
    if (decoded.user.role === "manager") setManager(true);
  })

  const handleVerify = () => {

  }

  const statusColor = (status) => {
    if (status === "approved") {
      return ("text-green-500")
    }
    else if (status === "pending") {
      return ("text-yellow-500")
    }
    else if (status === "rejected") {
      return ("text-red-500")
    }
  }

  return (
    <>
      <div className="window-primary max-w-3xl">
        <div className="flex justify-between">
          <h2>Journal Entry: {journalEntryID}</h2>
          <div className="flex flex-row gap-2 text-lg">
            <p>Status:</p>
            <p className={statusColor(journalStatus)}><strong>{journalStatus}</strong></p>
          </div>
        </div>
        <div className="form-primary">
          <table>
            <thead>
              <tr>
                <th className="user-table-header text-left">
                  Date
                </th>
                <th className="user-table-header text-left">
                  Account
                </th>
                <th className="user-table-header">
                  Debit
                </th>
                <th className="user-table-header">
                  Credit
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="journal-data">
                  {date}
                </td>
                <td className="journal-data">
                  {debitAccountID + ": " + debitAccountName}
                </td>
                <td className="journal-data text-center">
                  {amount}
                </td>
              </tr>
              <tr>
                <td>
                </td>
                <td className="journal-data pl-10">
                  {creditAccountID + ": " + creditAccountName}
                </td>
                <td>
                </td>
                <td className="journal-data text-center">
                  {amount}
                </td>
              </tr>
            </tbody>
          </table>
          <p className="text-lg"><strong>Description:</strong> {desc}</p>
          <div className="flex justify-between">
            <button className="btn-primary btn-color-red" onClick={() => navigate(-1)}>
              Back
            </button>
            {toBeVerified && isManager && (
              <button className="btn-primary"
                onClick={handleVerify}
              >
                Update Status
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export { JournalEntry };