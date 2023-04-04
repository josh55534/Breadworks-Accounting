import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import jwt_decode from "jwt-decode";

const token = localStorage.getItem("token");


function CreateJournal() {
  const [accountList, setAccountList] = useState([])
  const [accountListID, setAccountListId] = useState([])

  const [debitAccountID, setDebitID] = useState("none");
  const [creditAccountID, setCreditID] = useState("");
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

  return (
    <div className="window-primary">
      <h2>New Journal Entry</h2>
      <form>
        <div className="form-primary">
          <div>
            <label>
              Debit Account
            </label>
            <select
              className="txt-primary"
              type="text"
              id="debit"
              value={debitAccountID}
              onChange={(props) => setDebitID(props.target.value)}
            >
              <option value="none" disabled hidden>Select an Option</option>
              {accountListID.map((id, index) => {
                return (
                  <option value={id} key={index}>{accountList[index]}</option>
                )
              })}
            </select>
          </div>
          <div>
            <label>
              Credit Account
            </label>
            <select
              className="txt-primary"
              type="text"
              id="credit"
              value={creditAccountID}
              onChange={(props) => setCreditID(props.target.value)}
            >
              <option value="none" disabled hidden>Select an Option</option>
              {accountListID.map((id, index) => {
                return (
                  <option value={id} key={index}>{accountList[index]}</option>
                )
              })}
            </select>
          </div>
          <div>
            <label>
              Amount
            </label>
            <input
              className="txt-primary"
              id="subject"
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
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
          <button className="btn-primary">
            Add Account
          </button>
        </div>
      </form >
    </div >
  )
}

export { CreateJournal }