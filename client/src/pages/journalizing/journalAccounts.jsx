import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { JournalHome, JournalNavbar } from "./journalHome";
const token = localStorage.getItem("token");

function JournalAccounts() {
  const [loading, setLoading] = useState(true);
  const [accountIds, setIds] = useState([]);
  const [accountNames, setNames] = useState([]);
  const [accountDescs, setDescs] = useState([]);
  const [accountCategories, setCategories] = useState([]);
  const [accountStatements, setStatements] = useState([]);
  const [accountStatus, setStatus] = useState([]);


  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  
    axios
      .get("http://localhost:5000/chartOfAccounts", config)
      .then((res) => {
        const { data } = res;
        setIds(data.map((d) => d.id));
        setNames(data.map((d) => d.name));
        setDescs(data.map((d) => d.desc));
        setCategories(data.map((d) => d.category));
        setStatements(data.map((d) => d.statement));
        setStatus(data.map((d) => d.active));
  
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);
  

  return (
    <>
      <div className="window-primary text-center">

        <h2>Accounts</h2>
        <JournalNavbar />
        {loading ? (
          <div className="flex items-center justify-center h-fit">
            Loading...
          </div>) : (
          <>
            <div className="form-primary mt-4">
              <table className="user-table">
                <thead>
                  <tr>
                    <th className="user-table-header">
                      Account ID
                    </th>
                    <th className="user-table-header">
                      Name
                    </th>
                    <th className="user-table-header">
                      Description
                    </th>
                    <th className="user-table-header text-center">
                      Category
                    </th>
                    <th className="user-table-header text-center">
                      Statement
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {accountIds.map((id, index) => {
                    if (accountStatus[index]) {
                      return (
                        <tr
                          className="table-row-button"
                          key={index}
                          onClick={() => { window.location.href = `/journal/account/${id}` }}
                        >
                          <td className="user-table-body">{id}</td>
                          <td className="user-table-body">{accountNames[index]}</td>
                          <td className="user-table-body">{accountDescs[index]}</td>
                          <td className="user-table-body text-center">{accountCategories[index]}</td>
                          <td className="user-table-body text-center">{accountStatements[index]}</td>
                        </tr>
                      )
                    }
                  }
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </>
  )
}

export { JournalAccounts };