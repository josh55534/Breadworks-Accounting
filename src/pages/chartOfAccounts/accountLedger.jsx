import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { backendPath } from "../../../config";

const token = localStorage.getItem("token");

function JournalListData(props) {
  return (
    <>
      <tr className="" key={props.journalKey}>
        <td className="user-table-body">{props.date}</td>
        <td className="user-table-body">{props.desc}</td>
        <td className="user-table-body text-center" onClick={props.onClick}><Link to={`/journal/entry/${props.id}`}>{props.id}</Link></td>
        <td className="user-table-body text-center">{props.debit.toLocaleString('en', {useGrouping:true, minimumFractionDigits: 2})}</td>
        <td className="user-table-body text-center">{props.credit.toLocaleString('en', {useGrouping:true, minimumFractionDigits: 2})}</td>
        <td className="user-table-body text-center">{props.totalDebit.toLocaleString('en', {useGrouping:true, minimumFractionDigits: 2})}</td>
        <td className="user-table-body text-center">{props.totalCredit.toLocaleString('en', {useGrouping:true, minimumFractionDigits: 2})}</td>
      </tr>
    </>
  )
}


function AccountLedger() {
  const { accountId } = useParams();
  const [accountName, setName] = useState("")
  const [balance, setBalance] = useState("");

  const [rowID, setRowID] = useState([])

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const journalEntryClick = () => {

  }

  useEffect(() => {
    axios
      .get(`${backendPath}/journal/accountLedger/${accountId}`, config)
      .then((res) => {
        const data = res.data;
        setRowID(data.journalData)
        setBalance(data.accountBalance);
        setName(data.accountName)
      })
  }, [])

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
            <label className="txt-primary py-0 ml-0">{balance.toLocaleString('en', {useGrouping:true, minimumFractionDigits: 2})}</label>
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
              {rowID.map((id, index) => (
                <JournalListData
                  key={index}
                  onClick={journalEntryClick}
                  date={rowID[index].date}
                  desc={rowID[index].desc}
                  id={rowID[index].id}
                  debit={rowID[index].debit}
                  credit={rowID[index].credit}
                  totalDebit={rowID[index].totalDebit}
                  totalCredit={rowID[index].totalCredit}
                />
              ))}
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