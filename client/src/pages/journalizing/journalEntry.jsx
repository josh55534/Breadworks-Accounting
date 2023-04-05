import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import jwt_decode from "jwt-decode";
const token = localStorage.getItem("token");

function GeneralJournalList(props) {
  return (
    <>
      {props.rowID.map((d, index) => (
        <>
          {d.creditAmount === 0 && (
            <tr key={index}>
              <td className="user-table-body">{index == 0 && props.date}</td>
              <td className="user-table-body">{d.accountName}</td>
              <td className="user-table-body text-center">{d.debitAmount}</td>
              <td className="user-table-body"></td>
            </tr>
          )}
        </>
      ))}
      {props.rowID.map((d, index) => (
        <>
          {d.debitAmount === 0 && (
            <tr>
              <td className="user-table-body">{index == 0 && props.date}</td>
              <td className="user-table-body pl-10">{d.accountName}</td>
              <td className="user-table-body text-center"></td>
              <td className="user-table-body text-center">{d.creditAmount}</td>
            </tr>
          )}
        </>
      ))}
    </>
  )
}

function JournalEntry() {
  // TODO: ADD JOURNAL ENTRY FILE DOWNLOAD
  const { journalEntryID } = useParams();
  const [rowID, setRowID] = useState([]);
  const [desc, setDesc] = useState("");
  const [date, setDate] = useState("");

  const [journalStatus, setStatus] = useState("");
  const [toBeVerified, setToBeVerified] = useState(false);
  const [isManager, setManager] = useState("");

  const navigate = useNavigate();

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  if (token) {
    var decoded = jwt_decode(token);
  }

  useEffect(() => {
    // TODO: GET ACTUAL JOURNAL ENTRY DATA
    axios
      .get(`http://localhost:5000/journal/entry/${journalEntryID}`, config)
      .then((res) => {
        const { data } = res;
        setRowID(data.transactions);
        setDesc(data.desc);
        setDate(data.date);
        setStatus(data.status);
      })

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
          <table className="user-table">
            <thead>
              <tr>
                <th className="user-table-header text-left">
                  Date
                </th>
                <th className="user-table-header text-left">
                  Account
                </th>
                <th className="user-table-header text-center">
                  Debit
                </th>
                <th className="user-table-header text-center">
                  Credit
                </th>
              </tr>
            </thead>
            <tbody>
              <GeneralJournalList
                date={date}
                rowID={rowID}
              />
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