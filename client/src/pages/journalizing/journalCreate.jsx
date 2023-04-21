import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { backendPath } from "../../../config";

const token = localStorage.getItem("token");


function CreateJournal() {
  const defaultRow = {
    accountID:"none",
    accountName: "",
    creditAmount: 0.0,
    debitAmount: 0.0,
    debitAfter: "N/A",
    creditAfter: "N/A"
  };

  const [accountList, setAccountList] = useState([])
  const [accountListID, setAccountListId] = useState([])

  const data = new FormData();
  const [rowID, setRowID] = useState([defaultRow])
  const [desc, setDesc] = useState("");
  const [date, setDate] = useState("");
  const [file, setFile] = useState("");
  const [userName, setUsername] = useState(" ")



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
    setUsername(decoded.user.id);
    axios
      .get(`${backendPath}/chartOfAccounts`, config)
      .then((res) => {
        const { data } = res
        const filtered = data.filter((account) => account.active)
        setAccountList(filtered.map((d) => d.id + " " + d.name));
        setAccountListId(filtered.map((d) => d.id));
      })
      .catch((err) => {
        console.error(err);
      });

  }, [])

  const handleSubmit = () => {
    rowID.map((d, index) => data.append(`transactions[${index}]`, JSON.stringify(rowID[index])))
    data.append('desc', desc);
    data.append('date', date);
    data.append('userName', userName);
    data.append('file', file);
    axios

    .post(`${backendPath}/journal/new-entry`, data, config)
    .then((res) => {
      window.location.href = "/journal/entries"
      console.log(res)
    })
    .catch((err) => {
      console.log(err.response.data.errors)
    })

  }
  
  

  const changeAccount = (props) => {
    var account = [...rowID]
    account[props.target.id].accountID = props.target.value;
    account[props.target.id].accountName = accountList[accountListID.indexOf(props.target.value)];
    setRowID(account)
  }

  const changeDebit = (props) => {
    var debit = [...rowID]
    debit[props.target.id].debitAmount = props.target.value;
    setRowID(debit);
  }

  const changeCredit = (props) => {
    var credit = [...rowID]
    credit[props.target.id].creditAmount = props.target.value;
    setRowID(credit);
  }

  const removeList = (props) => {
    if (rowID.length > 1) {
      var tempRowID;
      tempRowID = [...rowID];

      tempRowID.splice(props.target.id, 1);

      setRowID(tempRowID);
    }
    else {
      setRowID([defaultRow])
    }
  }

  const addList = (props) => {
    var tempRowID = [...rowID];

    tempRowID.push(defaultRow)

    setRowID(tempRowID);
  }

  return (
    <div className="window-primary">
      <h2>New Journal Entry</h2>
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
                      value={rowID[index].accountID}
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
                      type="number"
                      id={index}
                      value={rowID[index].debitAmount}
                      onChange={changeDebit}
                    />
                  </td>
                  <td className="user-table-body">
                    <input
                      className="txt-primary ml-0"
                      type="number"
                      id={index}
                      value={rowID[index].creditAmount}
                      onChange={changeCredit}
                    />
                  </td>
                  <td>
                    <button type="button" id={index} className="btn-primary btn-color-red" onClick={removeList}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button type="button" className="btn-primary" onClick={addList}>Add Row</button>
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
    </div >
  )
}

export { CreateJournal }