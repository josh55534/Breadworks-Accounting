import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { JournalHome, JournalNavbar } from "./journalHome";
const token = localStorage.getItem("token");

function JournalListData(props) {
  var color = "";

  if (props.status === "approved") color = "text-green-500"
  else if (props.status === "pending") color = "text-yellow-500"
  else if (props.status === "rejected") color = "text-red-500"

  return (
    <tr
      className="table-row-button"
      key={props.key}
      onClick={props.onClick}>
      <td className="user-table-body">{props.id}</td>
      <td className="user-table-body">{props.desc}</td>
      <td className="user-table-body">{props.date}</td>
      <td className="user-table-body">{props.user}</td>
      <td className={"user-table-body " + color}>{props.status}</td>
    </tr>
  )
}

function GeneralJournalList(props) {
  return (
    <>
      {props.rowID.map((d, index) => (
        <>
          {d.creditAmount === 0 && (
            <tr>
              <td className={index == 0 ? "user-table-body border-gray-500" : "user-table-body"}>{index == 0 && props.date}</td>
              <td className={index == 0 ? "user-table-body border-gray-500" : "user-table-body"}>{d.accountName}</td>
              <td className={index == 0 ? "user-table-body border-gray-500 text-center" : "user-table-body text-center"}>{index == 0 && <Link to={`/journal/entry/${props.id}`}>{props.id}</Link>}</td>
              <td className={index == 0 ? "user-table-body border-gray-500 text-center" : "user-table-body text-center"}>{d.debitAmount}</td>
              <td className={index == 0 ? "user-table-body border-gray-500" : "user-table-body"}></td>
            </tr>
          )}
        </>
      ))}
      {props.rowID.map((d, index) => (
        <>
          {d.debitAmount === 0 && (
            <tr>
              <td className="user-table-body"></td>
              <td className="user-table-body pl-10">{d.accountName}</td>
              <td className="user-table-body text-center"></td>
              <td className="user-table-body"></td>
              <td className="user-table-body text-center">{d.creditAmount}</td>
              
            </tr>
          )}
        </>
      ))}
      <tr>
        <td className="user-table-body"></td>
        <td className="user-table-body"><em>{props.desc}</em></td>
        <td className="user-table-body text-center"></td>
        <td className="user-table-body text-center"></td>
        <td className="user-table-body"></td>
      </tr>
    </>
  )
}

function JournalList() {
  const [entryDate, setDate] = useState([]); // array of journal entry dates
  const [entryID, setID] = useState([]); // array of journal entry PR's (id)
  const [rowID, setRowID] = useState([]);
  const [entryDesc, setDesc] = useState([]); // array of journal entry descriptions
  const [canJournal, setJournal] = useState(false);

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    // TODO: GET JOURNAL ENTRY LIST
    let decoded;
    if (token) {
      decoded = jwt_decode(token);

    }

    axios
      .get("http://localhost:5000/journal/entries", config)
      .then((res) => {
        const { data } = res;
        setID(data.map((d) => d.id));
        setRowID(data.map((d) => d.transactions));
        setDate(data.map((d) => d.date))
        setDesc(data.map((d) => d.desc))
      })
      .catch();

    if (decoded.user.role === "manager" || decoded.user.role === "basic") setJournal(true);
  })

  return (
    <>
      <div className="window-primary text-center">
        <h2>General Journal</h2>
        <JournalNavbar />
        <div className="form-primary mt-4">
          <table className="user-table">
            <thead>
              <tr>
                <th className="user-table-header">
                  Date
                </th>
                <th className="user-table-header">
                  Accounts
                </th>
                <th className="user-table-header text-center">
                  PR
                </th>
                <th className="user-table-header text-center">
                  Debits
                </th>
                <th className="user-table-header text-center">
                  Credits
                </th>
              </tr>
            </thead>
            <tbody>
              {entryID.map((id, index) => (
                <GeneralJournalList
                  key={index}

                  date={entryDate[index]}
                  rowID={rowID[index]}
                  id={id}
                  desc={entryDesc[index]}
                />
              ))}
            </tbody>
          </table>
          <div className="flex justify-end">
            {canJournal && (
              <div className="flex flex-row justify-end">
                <Link to="new-entry">
                  <button className="btn-primary">
                    New Entry
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

function JournalListPending() {
  const [entryID, setID] = useState([]);
  const [entryDesc, setDesc] = useState([]);
  const [entryDate, setDate] = useState([]);
  const [entryUser, setUser] = useState([]);
  const [entryStatus, setStatus] = useState([]);

  const journalEntryClick = () => {

  }

  useEffect(() => {
    // TODO: GET JOURNAL ENTRY LIST
  })

  return (
    <>
      <div className="window-primary text-center">
        <h2>Pending Entries</h2>
        <JournalNavbar />
        <div className="form-primary mt-4">
          <table className="user-table">
            <thead>
              <tr>
                <th className="user-table-header">
                  ID
                </th>
                <th className="user-table-header">
                  Description
                </th>
                <th className="user-table-header">
                  Date
                </th>
                <th className="user-table-header text-center">
                  Submitted By
                </th>
                <th className="user-table-header text-center">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {entryID.map((id, index) => {
                <JournalListData
                  key={index}
                  onClick={journalEntryClick}
                  id={id}
                  desc={entryDesc}
                  date={entryDate}
                  user={entryUser}
                  status={entryStatus}
                />
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export { JournalList, JournalListPending };