import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import jwt_decode from "jwt-decode";
const token = localStorage.getItem("token");

function ChartOfAccounts() {
  const [accountIds, setIds] = useState([]);
  const [accountNames, setNames] = useState([]);
  const [accountDescs, setDescs] = useState([]);
  const [accountCategories, setCategories] = useState([]);
  const [accountStatements, setStatements] = useState([]);
  const [accountStatus, setStatus] = useState([]);
  const [loading, setLoading] = useState(true);

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
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
        <Link to="/login"></Link>;
        console.error(err);
        setLoading(false);
      });
  }, [config])

  return (
    <>
      <div className="window-primary max-w-5xl">
        <form>
          {loading ? (
            <div className="flex items-center justify-center h-fit">
              Loading...
            </div>) : (
            <div className="form-primary mb-0">
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
                    <th className="user-table-header text-center">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {accountIds.map((id, index) => (      
                    <tr
                      className="table-row-button"
                      key={index}
                      onClick={() =>{window.location.href = `/account/${id}`}}
                    >
                      <td className="user-table-body">{id}</td>
                      <td className="user-table-body">{accountNames[index]}</td>
                      <td className="user-table-body">{accountDescs[index]}</td>
                      <td className="user-table-body text-center">{accountCategories[index]}</td>
                      <td className="user-table-body text-center">{accountStatements[index]}</td>
                      <td className="user-table-body text-center">{accountStatus[index] ? (<>activated</>) : (<>deactivated</>)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
            </div>
          )}
    </form>
      </div >
    </>
  );
}

export { ChartOfAccounts }