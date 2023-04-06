import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { JournalHome, JournalNavbar } from "./journalHome";
const token = localStorage.getItem("token");

function GeneralJournalList(props) {
  var statusColor;
  if (props.status === "approved") statusColor = "text-green-500"
  else if (props.status === "pending") statusColor = "text-yellow-500"
  else if (props.status === "rejected") statusColor = "text-red-500"

  return (
    <>
      {props.rowID.map((d, index) => (
        <>
          {d.creditAmount === 0 && (
            <tr key={d.id}>
              <td className={index == 0 ? "user-table-body border-gray-500" : "user-table-body"}>{index == 0 && props.date}</td>
              <td className={index == 0 ? "user-table-body border-gray-500" : "user-table-body"}>{d.accountName}</td>
              <td className={index == 0 ? "user-table-body border-gray-500 text-center" : "user-table-body text-center"}>{index == 0 && <Link to={`/journal/entry/${props.id}`}>{props.id}</Link>}</td>
              <td className={index == 0 ? "user-table-body border-gray-500 text-center" : "user-table-body text-center"}>{d.debitAmount}</td>
              <td className={index == 0 ? "user-table-body border-gray-500" : "user-table-body"}></td>
              <td className={index == 0 ? "user-table-body border-gray-500 text-center "+statusColor: "user-table-body text-center"}>{index == 0 &&<strong>{props.status}</strong>}</td>
            </tr>
          )}
        </>
      ))}
      {props.rowID.map((d, index) => (
        <>
          {d.debitAmount === 0 && (
            <tr key={d.id}>
              <td className="user-table-body"></td>
              <td className="user-table-body pl-10">{d.accountName}</td>
              <td className="user-table-body text-center"></td>
              <td className="user-table-body"></td>
              <td className="user-table-body text-center">{d.creditAmount}</td>
              <td className="user-table-body text-center"></td>
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
  const [status, setStatus] = useState([])

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    // GET JOURNAL ENTRY LIST
    let decoded;
    if (token) {
      decoded = jwt_decode(token);

    }

    axios
      .get("http://localhost:5000/journal/entries", config)
      .then((res) => {
        const { data } = res;
        setID(data.map((d) => d.id));
        setStatus(data.map((d) => d.status))
        setDate(data.map((d) => d.date))
        setDesc(data.map((d) => d.desc))
        setRowID(data.map((d) => d.transactions))
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
                <th className="user-table-header text-center">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {entryID.map((id, index) => (
                <GeneralJournalList
                  date={entryDate[index]}
                  rowID={rowID[index]}
                  id={id}
                  desc={entryDesc[index]}
                  status={status[index]}
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


function JournalListData(props) {
  var color = "";

  if (props.status === "approved") color = "text-green-500"
  else if (props.status === "pending") color = "text-yellow-500"
  else if (props.status === "rejected") color = "text-red-500"

  return (
    <tr
      className="table-row-button"
      key={props.id}
    >
      <td className="user-table-body">{props.desc}</td>
      <td className="user-table-body text-center">{<Link to={`/journal/entry/${props.id}`}>{props.id}</Link>}</td>
      <td className="user-table-body">{props.date}</td>
      <td className="user-table-body">{props.user}</td>
      <td className={"text-center user-table-body " + color}><strong>{props.status}</strong></td>
    </tr>
  )
}

function JournalListPending() {
  const [rowID, setRowID] = useState([])

  const [isLoading, setLoading] = useState(true);

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    axios
      .get('http://localhost:5000/journal/entries/pending', config)
      .then((res) => {
        setRowID(res.data)
        setLoading(false);
      })

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
                  Description
                </th>
                <th className="user-table-header text-center">
                  PR
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
              {!isLoading && (
                <>
                  {rowID.map((data) => (
                    <JournalListData
                      id={data.id}
                      desc={data.desc}
                      date={data.date}
                      user={data.userName}
                      status={data.status}

                    />
                  ))
                  }
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export { JournalList, JournalListPending };