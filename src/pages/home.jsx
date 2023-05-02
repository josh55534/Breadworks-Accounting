import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import help from "../assets/help.png";
import jwt_decode from "jwt-decode";
const token = localStorage.getItem("token");
import axios from "axios";
import { backendPath } from "../../config";


function LoggedIn() {
  const [expanded, setExpanded] = useState(false);
  const [rowID, setRowID] = useState([])
  const [isLoading, setLoading] = useState(true);
  const [totalAssets, setTotalAssets] = useState(0.0);
  const [totalLiabilities, setTotalLiabilities] = useState(0.0);
  const [totalARplusInventory, setTotalARplusInventory] = useState(0.0);
  const [netIncome, setNetIncome] = useState(0.0);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  if (token) {
    var decoded = jwt_decode(token);
  }

  useEffect(() => {
    axios
      .get(`${backendPath}/journal/entries/pending`, config)
      .then((res) => {
        setRowID(res.data)
        setLoading(false);
      }, [])
  }, []);

  useEffect(() => {
    axios
      .get(`${backendPath}/ratio/totalassets`, config)
      .then((res) => {
        setTotalAssets(res.data.totalAssets)
      }, [])
  }, []);

  useEffect(() => {
    axios
      .get(`${backendPath}/ratio/totalliabilities`, config)
      .then((res) => {
        setTotalLiabilities(res.data.totalLiabilities)
      }, [])
  }, []);

  useEffect(() => {
    axios
      .get(`${backendPath}/ratio/totalarplusinventory`, config)
      .then((res) => {
        setTotalARplusInventory(res.data.totalARplusInventory)
      }, [])
  }, []);

  useEffect(() => {
    axios
      .get(`${backendPath}/ratio/netincome`, config)
      .then((res) => {
        setNetIncome(res.data.netIncome)
      }, [])
  }, []);


  const currentRatio = totalAssets / totalLiabilities;

  const quickRatio = (totalAssets - totalARplusInventory) / totalLiabilities;

  const RoA = (netIncome / totalAssets).toFixed(3);


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
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
        <td className="user-table-body text-center">{props.user}</td>
        <td className={"text-center user-table-body " + color}><strong>{props.status}</strong></td>
      </tr>
    )
  }

  return (
    <>
      <div className="window-primary max-w-7xl">
        <div className="text-center">
          <h2>Breadworks Home Page</h2>
          <label>To get started, click on one of the tabs above.</label>
          <label className="flex items-center ml-80">
            Information on the tabs can be found by clicking the help icon
            <img
              src={help}
              alt="help icon"
              className="ml-2 cursor-pointer"
              onClick={toggleExpand}
            />
          </label>
        </div>
        <div className={expanded ? "" : "hidden"}>
          <label>Information:</label>
          <div className="ml-4">
            <div className="mt-1">
              <label>Chart of Accounts</label>
              <p className="ml-4">
                Lists all accounts and their general information. Administrators
                can also create and edit account information here.
              </p>
            </div>
            <div className="mt-2">
              <label>Journal</label>
              <p className="ml-4">
                View and create journal transactions. Accountants and Managers
                can create new journal entries to update balance of accounts.
                Managers can see a list of pending journal entries and either
                approve or reject changes. New journal entries must be approved by
                managers before their changes go into effect. Journal entries may
                be viewed directly from the general journal, or as transactions
                in account ledgers.
              </p>
            </div>
            <div className="mt-2">
              <label>Event Log</label>
              <p className="ml-4">View and create event logs</p>
            </div>
            <div className="mt-2">
              <label>Documents</label>
              <p className="ml-4">Generate documents</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex my-4">
        <div className="window-primary text-center w-2/5 mr-10">
          <h2>Pending Entries</h2>
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
                        key={data.id}
                        id={data.id}
                        desc={data.desc}
                        date={formatDate(data.date)}
                        user={data.userName}
                        status={data.status}
                      />
                    ))}
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="window-primary flex items-center w-1/5 pb-4 ml-20">
          <div className="mx-auto">
            <table className="border-collapse table-auto">
              <thead>
                <tr>
                  <th className="px-4 py-2">Ratios</th>
                  <th className="px-4 py-2">Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border px-4 py-2 font-bold text-left">Current Ratio</td>
                  <td className={`border px-4 py-2 text-right ${currentRatio < 1.0 ? 'text-red-700' : currentRatio >= 1.0 && currentRatio <= 1.9 ? 'text-yellow-300' : 'text-green-400'}`}>{currentRatio}</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2 font-bold text-left">Quick Ratio</td>
                  <td className={`border px-4 py-2 text-right ${quickRatio < 1.0 ? 'text-red-700' : quickRatio >= 1.0 && quickRatio <= 1.9 ? 'text-yellow-300' : 'text-green-400'}`}>{quickRatio}</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2 font-bold text-left">Return on Assets</td>
                  <td className={`border px-4 py-2 text-right ${RoA < 1.0 ? 'text-red-700' : RoA >= 1.0 && RoA <= 1.9 ? 'text-yellow-300' : 'text-green-400'}`}>{RoA}</td>
                </tr>
              </tbody>

            </table>
          </div>
        </div>
      </div>
    </>
  );
}

function LandingPage() {
  return (
    <div className="window-primary text-center max-w-3xl">
      <h2 className="text-center">Let's Get This Bread!</h2>
      <label>Start accounting now!</label>
      <div className="flex justify-center gap-28 mt-3">
        <div className="flex flex-col text-center">
          <p>Have an account?</p>
          <Link to="/login" className="btn-primary mx-auto">
            Login
          </Link>
        </div>
        <div className="flex flex-col text-center">
          <p>New Users</p>
          <Link to="/register" className="btn-primary btn-color-red mx-auto">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}

function Home() {
  const token = localStorage.getItem("token");

  if (token) return <LoggedIn />;
  else return <LandingPage />;
}

export default Home;