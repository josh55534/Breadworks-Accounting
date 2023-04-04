import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
const token = localStorage.getItem("token");

function JournalListData(props) {

  return (
    <tr
      className="table-row-button"
      key={props.key}
    >
      <td className="user-table-body">{props.date}</td>
      <td className="user-table-body">{props.desc}</td>
      <td className="user-table-body" onClick={props.onClick}>{props.id}</td>
      <td className="user-table-body">{props.debit}</td>
      <td className="user-table-body">{props.credit}</td>
      <td className="user-table-body">{props.totalDebit}</td>
      <td className="user-table-body">{props.totalCredit}</td>
    </tr>
  )
}

function AccountLedger() {
  const { accountId } = useParams();
  const [accountName, setName] = useState("")
  const [balance, setBalance] = useState("");

  const [entryID, setID] = useState([]);
  const [entryDesc, setDesc] = useState([]);
  const [entryDate, setDate] = useState([]);
  const [entryDebit, setDebit] = useState([]);
  const [entryCredit, setCredit] = useState([]);
  const [totalCredit, setTotalCredit] = useState([]);
  const [totalDebit, setTotalDebit] = useState([]);

  const journalEntryClick = () => {

  }

  useEffect(() => {
    // TODO: GET ACCOUNT LEDGER
  })

  return (
    <>
      <div className="window-primary">
        <h2 className="mb-2">Account Ledger</h2>
        <div className="flex justify-between ml-2">
          <div>
            <label>Account ID: {accountId}</label>
            <label>Account Name: {accountName}</label>
          </div>
          <div className="flex flex-col items-center">
            <label className="text-center">Balance</label>
            <label className="txt-primary py-0 ml-0">{balance}</label>
          </div>
        </div>
        <div className="form-primary mt-2">
          <table className="user-table">
            <thead>
              <tr>
                <th className="user-table-header">
                  Date
                </th>
                <th className="user-table-header">
                  Description
                </th>
                <th className="user-table-header text-center">
                  PR
                </th>
                <th className="user-table-header text-center">
                  Debit
                </th>
                <th className="user-table-header text-center">
                  Credit
                </th>
                <th className="user-table-header text-center">
                  Total Debit
                </th>
                <th className="user-table-header text-center">
                  Total Credit
                </th>
              </tr>
            </thead>
            <tbody>
              {entryID.map((id, index) => {
                <JournalListData
                  key={index}
                  onClick={journalEntryClick}
                  date={entryDate}
                  desc={entryDesc}
                  id={id}
                  debit={entryDebit}
                  credit={entryCredit}
                  totalDebit={totalDebit}
                  totalCredit={totalCredit}
                />
              })}
            </tbody>
          </table>

        </div>
        <Link to="/journal/account">
          <button className="btn-primary btn-color-red mt-1">Back</button>
        </Link>
      </div>
    </>
  )
}

export { AccountLedger };