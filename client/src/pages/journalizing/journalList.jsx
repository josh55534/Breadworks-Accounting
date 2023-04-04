import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
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
      <tr>
        <td className="user-table-body">{props.date}</td>
        <td className="user-table-body">{props.debitAcct}</td>
        <Link to={`/journal/entry/${props.id}`}>
          <td className="user-table-body text-center">{props.id}</td>
        </Link>
        <td className="user-table-body">{props.amount}</td>
        <td className="user-table-body"></td>
      </tr>
      <tr>
        <td className="user-table-body"></td>
        <td className="user-table-body pl-4">{props.creditAcct}</td>
        <td className="user-table-body"></td>
        <td className="user-table-body"></td>
        <td className="user-table-body">{props.amount}</td>
        <td className="user-table-body"></td>
      </tr>
      <tr>
        <td className="user-table-body"></td>
        <td className="user-table-body"><em>{props.desc}</em></td>
        <td className="user-table-body"></td>
        <td className="user-table-body"></td>
        <td className="user-table-body"></td>
        <td className="user-table-body"></td>
      </tr>
    </>
  )
}

function JournalList() {
  const [entryDate, setDate] = useState([]); // array of journal entry dates
  const [entryID, setID] = useState([]); // array of journal entry PR's (id)
  const [entryDesc, setDesc] = useState([]); // array of journal entry descriptions
  const [debitAcct, setDebitAcct] = useState([]); // array of journal entry debit accounts
  const [creditAcct, setCreditAcct] = useState([]); // array of journal entry credit accounts
  const [amounts, setAmounts] = useState([]); // array of journal entry amounts

  useEffect(() => {
    // TODO: GET JOURNAL ENTRY LIST
  })

  return (
    <>
      <div className="window-primary max-w-5xl text-center">
        <h2>General Journal</h2>
        <div className="form-primary">
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
                  amount={amounts[index]}
                  debitAcct={debitAcct[index]}
                  creditAcct={creditAcct[index]}
                  id={id}
                  desc={entryDesc[index]}
                />
              ))}
            </tbody>
          </table>
          <div className="flex justify-between">
            <Link to="/journal">
              <button className="btn-primary btn-color-red">Back</button>
            </Link>
            <Link to="/journal/entries/pending">
              <button className="btn-primary">Pending Entries</button>
            </Link>
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
      <div className="window-primary max-w-5xl text-center">
        <h2>Pending Entries</h2>
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
          <div className="flex justify-left">
            <Link to="/journal/entries">
              <button className="btn-primary btn-color-red">Back</button>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export { JournalList, JournalListPending };