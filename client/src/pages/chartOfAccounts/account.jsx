import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
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
      .get(`http://localhost:5000/chartOfAccounts/account/${accountId}`, config)
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
  }, [config])

  return (
    <div className="window-primary">
      <h2>Account Details: {accountId} - {name}</h2>
      <div className="form-primary">
        <div>
          <label>Name</label>
          <input
            disabled
            className="txt-primary"
            type="text"
            id="Fname"
            value={name} />
        </div>
        <div>
          <label>Description</label>
          <input
            disabled
            className="txt-primary"
            type="text"
            id="Desc"
            value={desc} />
        </div>
        <div>
          <label>Normal Side</label>
          <input
            disabled
            className="txt-primary"
            type="text"
            id="normalSide"
            value={normalSide} />
        </div>
        <div>
          <label>Category</label>
          <input
            disabled
            className="txt-primary"
            type="text"
            id="category"
            value={category} />
        </div>
        <div>
          <label>Subcategory</label>
          <input
            disabled
            className="txt-primary"
            type="text"
            id="subcat"
            value={subcategory} />
        </div>
        <div>
          <label>Balance</label>
          <div className="flex flex-row ml-2">
            <p className="m-auto text-xl">$</p>
            <input
              disabled
              className="txt-primary"
              type="text"
              id="balance"
              value={balance.toLocaleString('en', {useGrouping:true, minimumFractionDigits: 2})} />
          </div>
        </div>
        <div className="flex flex-row justify-end gap-4">
          <div>
            <label>Credit</label>
            <div className="flex flex-row ml-2">
              <p className="m-auto text-xl">$</p>
              <input
                disabled
                className="txt-primary"
                type="text"
                id="credit"
                value={credit.toLocaleString('en', {useGrouping:true, minimumFractionDigits: 2})} />
            </div>
          </div>
          <div>
            <label>Debit</label>
            <div className="flex flex-row ml-2">
              <p className="m-auto text-xl">$</p>
              <input
                disabled
                className="txt-primary"
                type="text"
                id="debit"
                value={debit.toLocaleString('en', {useGrouping:true, minimumFractionDigits: 2})} />
            </div>
          </div>
        </div>
        <div>
          <label>Assigned Users</label>
          <input
            disabled
            className="txt-primary"
            type="text"
            id="users"
            value={assignedUsers} />
        </div>
        <div>
          <label>Comment</label>
          <input
            disabled
            className="txt-primary"
            type="text"
            id="comment"
            value={comment} />
        </div>
        <div>
          <label>Statement</label>
          <input
            disabled
            className="txt-primary"
            type="text"
            id="statement"
            value={statement} />
        </div>
      </div>
      <div className="flex">
        <Link to="/chartofaccounts">
          <button className="btn-primary btn-color-red">
            Go Back
          </button>
        </Link>
      </div>
    </div>
  )
}

export { Account };