import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import jwt_decode from "jwt-decode";

const token = localStorage.getItem("token");


function CreateJournal() {
  const [accountList, setAccountList] = useState([])
  const [accountListID, setAccountListId] = useState([])

  const [rowID, setRowID] = useState([0])
  const [accountID, setAccountID] = useState(["none"]);
  const [creditAmount, setCredit] = useState([])
  const [debitAmount, setDebit] = useState([]);
  const [desc, setDesc] = useState("");
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState();
  const [file, setFile] = useState("");
  const [userName, setUsername] = useState("")

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };


  if (token) {
    var decoded = jwt_decode(token);
  }
  if (decoded.user.role !== "manager" && decoded.user.role !== "basic") {
    window.location.href = "http://localhost:3000/journal"
  }
  useEffect(() => {
    axios
      .get("http://localhost:5000/chartOfAccounts", config)
      .then((res) => {
        const { data } = res
        const filtered = data.filter((account) => account.active)
        setAccountList(filtered.map((d) => d.id + " " + d.name));
        setAccountListId(filtered.map((d) => d.id));
      })

  }, [config])

  const handleSubmit = () => {

  }

  const changeAccount = (props) => {
    var account = [...accountID]
    account[props.target.id] = props.target.value;
    setAccountID(account)
  }

  const removeList = (props) => {
    if (rowID.length > 1) {
      var tempRowID, tempAccountID, tempCreditAmount, tempDebitAmount;
      tempRowID = [...rowID];
      tempAccountID = [...accountID];
      tempCreditAmount = [...creditAmount];
      tempDebitAmount = [...debitAmount];

      tempRowID.splice(props.target.id, 1);
      tempAccountID.splice(props.target.id, 1);
      tempCreditAmount.splice(props.target.id, 1);
      tempDebitAmount.splice(props.target.id, 1);

      setRowID(tempRowID);
      setAccountID(tempAccountID)
      setDebit(tempDebitAmount)
      setCredit(tempCreditAmount)
    }
  }

  const addList = (props) => {
    var tempRowID, tempAccountID, tempCreditAmount, tempDebitAmount;
    tempRowID = [...rowID];
    tempAccountID = [...accountID];
    tempCreditAmount = [...creditAmount];
    tempDebitAmount = [...debitAmount];

    tempRowID.push(tempRowID.length)
    tempAccountID.push("none")
    tempCreditAmount.push("");
    tempDebitAmount.push("");

    setRowID(tempRowID);
    setAccountID(tempAccountID)
    setDebit(tempDebitAmount)
    setCredit(tempCreditAmount)
  }

  return (
    <div className="window-primary">
      <h2>New Journal Entry</h2>
      <form>
        <div className="form-primary">
          <div>
            <table className="user-table">
              <thead>
                <tr>
                  <td className="user-table-header text-black">
                    <label>Account</label>
                  </td>
                  <td className="user-table-header text-black">
                    <label>Debit</label>
                  </td>
                  <td className="user-table-header text-black">
                    <label>Credit</label>
                  </td>
                </tr>
              </thead>
              <tbody>
                {rowID.map((d, index) => (
                  <tr key={index}>
                    <td className="user-table-body">
                      <select
                        className="txt-primary ml-0"
                        type="text"
                        id={index}
                        value={accountID[index]}
                        onChange={changeAccount}
                      >
                        <option value="none" disabled hidden>Select an Option</option>
                        {accountListID.map((id, index) => {
                          return (
                            <option value={id} key={index}>{accountList[index]}</option>
                          )
                        })}
                      </select>
                    </td>
                    <td className="user-table-body">
                      <input
                        className="txt-primary ml-0"
                        type="text"
                        id={index}
                        value={debitAmount[index]}
                      />
                    </td>
                    <td className="user-table-body">
                      <input
                        className="txt-primary ml-0"
                        type="text"
                        id={index}
                        value={creditAmount[index]}
                      />
                    </td>
                    <td>
                      <button type="button" id={index} className="btn-primary btn-color-red" onClick={removeList}>-</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button type="button" className="btn-primary" onClick={addList}>+</button>
          </div>
          <div>
            <label>
              Date
            </label>
            <input
              className="txt-primary"
              id="subject"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div>
            <label>
              Description
            </label>
            <input
              className="txt-primary"
              id="subject"
              type="text"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>
          <div>
            <label>
              Supporting File
            </label>
            <input
              className="txt-primary"
              id="file"
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>
        </div>
        <div className="flex justify-between">
          <Link to="/journal/entries" className="btn-primary btn-color-red">
            Go Back
          </Link>
          <button className="btn-primary" onClick={handleSubmit}>
            Add Entry
          </button>
        </div>
      </form >
    </div >
  )
}

export { CreateJournal }