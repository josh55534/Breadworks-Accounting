import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
const token = localStorage.getItem("token");

function JournalListData (props) {
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

function JournalList() {
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
      <div className="window-primary max-w-5xl text-center">
        <h2>Journal Entries</h2>
        <div className="form-primary">
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

function JournalListPending() {

}

export { JournalList, JournalListPending };