import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { backendPath } from "../../../config";
const token = localStorage.getItem("token");

function Account() {
  const { accountId } = useParams();
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [normalSide, setNormal] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcat] = useState("");
  const [balance, setBalance] = useState(0.0);
  const [credit, setCredit] = useState(0.0);
  const [debit, setDebit] = useState(0.0);
  const [assignedUsers, setUsers] = useState([]);
  const [comment, setComment] = useState("");
  const [statement, setStatement] = useState("");
  const [dateTimeAdded, setTimeAdded] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(true);

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    axios
      .get(`${backendPath}/chartOfAccounts/account/${accountId}`, config)
      .then((res) => {
        const { data } = res;
        setName(data.name);
        setDesc(data.desc);
        setNormal(data.normalSide);
        setCategory(data.category);
        setSubcat(data.subcategory);
        setBalance(data.balance);
        setCredit(data.credit);
        setDebit(data.debit);
        setUsers(data.assignedUsers);
        setComment(data.comment);
        setStatement(data.statement);
        setTimeAdded(data.dateTimeAdded);
        setIsActive(data.active);
  
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);
  

  const updateAccount = () => {
    axios
      .put(
        `${backendPath}/chartOfAccounts/update/${accountId}`,
        {
          name: name,
          desc: desc,
          normalSide: normalSide,
          category: category,
          subcategory: subcategory,
          balance: balance,
          credit: credit,
          debit: debit,
          assignedUsers: assignedUsers,
          comment: comment,
          statement: statement
        },
        config
      )
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div className="window-primary">
      <h2>
        Account Details: {accountId} - {name}
      </h2>
      <div className="form-primary">
        <div>
        <label>Name</label>
        <input
          className="txt-primary"
          type="text"
          id="Fname"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label>Description</label>
        <input
          className="txt-primary"
          type="text"
          id="Desc"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
      </div>
      <div>
        <label>Normal Side</label>
        <input
          className="txt-primary"
          type="text"
          id="normalSide"
          value={normalSide}
          onChange={(e) => setNormal(e.target.value)}
        />
      </div>
      <div>
        <label>Category</label>
        <input
          className="txt-primary"
          type="text"
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
      </div>
      <div>
        <label>Subcategory</label>
        <input
          className="txt-primary"
          type="text"
          id="subcat"
          value={subcategory}
          onChange={(e) => setSubcat(e.target.value)}
        />
      </div>
      <div>
        <label>Balance</label>
        <div className="flex flex-row ml-2">
          <p className="m-auto text-xl">$</p>
          <input
            className="txt-primary"
            type="text"
            id="balance"
            value={balance.toLocaleString("en", {
              useGrouping: true,
              minimumFractionDigits: 2,
            })}
            onChange={(e) =>
              setBalance(Number(e.target.value.replace(/[^0-9.-]+/g, "")))
            }
          />
        </div>
      </div>
      <div className="flex flex-row justify-end gap-4">
        <div>
          <label>Credit</label>
          <div className="flex flex-row ml-2">
            <p className="m-auto text-xl">$</p>
            <input
              className="txt-primary"
              type="text"
              id="credit"
              value={credit.toLocaleString("en", {
                useGrouping: true,
                minimumFractionDigits: 2,
              })}
              onChange={(e) =>
                setCredit(Number(e.target.value.replace(/[^0-9.-]+/g, "")))
              }
            />
          </div>
        </div>
        <div>
          <label>Debit</label>
          <div className="flex flex-row ml-2">
            <p className="m-auto text-xl">$</p>
            <input
              className="txt-primary"
              type="text"
              id="debit"
              value={debit.toLocaleString("en", {
                useGrouping: true,
                minimumFractionDigits: 2,
              })}
              onChange={(e) =>
                setDebit(Number(e.target.value.replace(/[^0-9.-]+/g, "")))
              }
            />
          </div>
        </div>
      </div>
      <div>
        <label>Assigned Users</label>
        <input
          className="txt-primary"
          type="text"
          id="users"
          value={assignedUsers}
          onChange={(e) => setAssignedUsers(e.target.value)}
          />
        </div>
        <div>
          <label>Comment</label>
          <input
            className="txt-primary"
            type="text"
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
        <div>
          <label>Statement</label>
          <input
            className="txt-primary"
            type="text"
            id="statement"
            value={statement}
            onChange={(e) => setStatement(e.target.value)}
          />
        </div>
      </div>
      <div className="flex space-x-10">
        <Link to="/chartofaccounts">
          <button className="btn-primary btn-color-red">Go Back</button>
        </Link>
        <button className="btn-primary btn-color-blue" onClick={updateAccount}>
          Update Account
        </button>
      </div>
    </div>
  );
}

export { Account };
