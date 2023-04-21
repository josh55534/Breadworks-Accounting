import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { backendPath } from "../../../config";
const token = localStorage.getItem("token");

function ChartOfAccounts() {
  const [accountIds, setIds] = useState([]);
  const [accountNames, setNames] = useState([]);
  const [accountDescs, setDescs] = useState([]);
  const [accountCategories, setCategories] = useState([]);
  const [accountStatements, setStatements] = useState([]);
  const [accountStatus, setStatus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setAdmin] = useState(false);
  const [search, setSearch] = useSearchParams();

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    var searchParam = "";
    if (search.get("search") !== null) {
      searchParam = `?search=${search.get("search")}`;
    }

    axios
      .get(`${backendPath}/chartOfAccounts${searchParam}`, config)
      .then((res) => {
        const { data } = res;
        setIds(data.map((d) => d.id));
        setNames(data.map((d) => d.name));
        setDescs(data.map((d) => d.desc));
        setCategories(data.map((d) => d.category));
        setStatements(data.map((d) => d.statement));
        setStatus(data.map((d) => d.active));

        setLoading(false);

        let decoded;
        if (token) {
          decoded = jwt_decode(token);
        }
        if (decoded.user.role === "admin") {
          setAdmin(true);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, [search]);

  const changeSearch = (event) => {
    if (event.target.value !== "") setSearch({ search: event.target.value });
    else setSearch("");
  };

  const activateAccount = (accountId) => {
    axios
      .put(
        `${backendPath}/chartOfAccounts/activate/${accountId}`,
        {},
        config
      )
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const deactivateAccount = (accountId) => {
    axios
      .put(
        `${backendPath}/chartOfAccounts/deactivate/${accountId}`,
        {},
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
    <>
      <div className="window-primary text-center">
        <h2>Chart of Accounts</h2>
        <form>
          {loading ? (
            <div className="flex items-center justify-center h-fit">
              Loading...
            </div>
          ) : (
            <div className="form-primary mb-0">
              <div className="flex flex-row justify-between">
                <input
                  className="txt-search"
                  placeholder="Search"
                  value={search.get("search") || ""}
                  onChange={changeSearch}
                />
                {isAdmin && (
                  <Link to="/chartofaccounts/addAccount/">
                    <button className="btn-primary">Add Account</button>
                  </Link>
                )}
              </div>
              <table className="user-table">
                <thead>
                  <tr>
                    <th className="user-table-header">Account ID</th>
                    <th className="user-table-header">Name</th>
                    <th className="user-table-header">Description</th>
                    <th className="user-table-header text-center">Category</th>
                    <th className="user-table-header text-center">Statement</th>
                    <th className="user-table-header text-center">Status</th>
                    {isAdmin && (
                      <th className="user-table-header">Activate/Deactivate</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {accountIds.map((id, index) => (
                    <tr
                      className="table-row-button"
                      key={index}
                      onClick={() => {
                        window.location.href = `/account/${id}`;
                      }}
                    >
                      <td className="user-table-body py-2">{id}</td>
                      <td className="user-table-body">{accountNames[index]}</td>
                      <td className="user-table-body">{accountDescs[index]}</td>
                      <td className="user-table-body text-center">
                        {accountCategories[index]}
                      </td>
                      <td className="user-table-body text-center">
                        {accountStatements[index]}
                      </td>
                      <td className="user-table-body text-center">
                        {accountStatus[index] ? (
                          <>activated</>
                        ) : (
                          <>deactivated</>
                        )}
                      </td>
                      {isAdmin && (
                        <td className="user-table-body w-1">
                          {accountStatus[index] ? (
                            <button className="btn-primary btn-color-red" onClick={() => deactivateAccount(id)}>
                              Deactivate
                            </button>
                          ) : (
                            <button className="btn-primary btn-color-blue" onClick={() => activateAccount(id)}>
                              Activate
                            </button>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </form>
      </div>
    </>
  );
}

function AdminAddAccount() {
  const [number, setNumber] = useState("");
  const [order, setOrder] = useState("");
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [normalSide, setNormal] = useState("");
  const [category, setCategory] = useState("none");
  const [subcategory, setSubcat] = useState("");
  const [balance, setBalance] = useState(0.0);
  const [credit, setCredit] = useState(0.0);
  const [debit, setDebit] = useState(0.0);
  const [selectedUsers, setSelected] = useState([]);
  const [comment, setComment] = useState("");
  const [statement, setStatement] = useState("none");
  const [userList, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    axios
      .get(`${backendPath}/adminDashboard/users`, config)
      .then((res) => {
        const { data } = res;
        setUsers(data.map((d) => d.id));
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  });

  const handleAddAcct = () => {
    axios
      .post(
        `${backendPath}/chartOfAccounts/createAccount`,
        {
          number: number,
          order: order,
          name: name,
          desc: desc,
          normalSide: normalSide,
          category: category,
          subcategory: subcategory,
          balance: balance,
          credit: credit,
          debit: debit,
          assignedUsers: selectedUsers,
          comment: comment,
          statement: statement,
        },
        config
      )
      .then((res) => {
        window.location.href = "/chartOfAccounts";
      })
      .catch((err) => {
        console.log(err.response.data.errors);
      });
  };

  const selectColor = (props) => {
    if (selectedUsers.includes(props.target.value)) {
      return "true";
    } else {
      return "false";
    }
  };

  const handleSelect = (props) => {
    let temp = selectedUsers;
    let userName = props.target.value;

    if (temp.includes(userName)) {
      let index = temp.indexOf(userName);
      temp.splice(index, 1);
    } else {
      temp.push(userName);
    }

    setSelected(temp);
  };

  return (
    <>
      <div className="window-primary">
        <h2>Create New Account</h2>
        {loading ? (
          <div className="flex items-center justify-center h-fit">
            Loading...
          </div>
        ) : (
          <>
            <div className="form-primary pb-4">
              <div>
                <label>Account Number</label>
                <input
                  className="txt-primary"
                  type="text"
                  id="Fname"
                  value={number}
                  onChange={(props) => setNumber(props.target.value)}
                />
              </div>
              <div>
                <label>Account Order</label>
                <input
                  className="txt-primary"
                  type="text"
                  id="Fname"
                  value={order}
                  onChange={(props) => setOrder(props.target.value)}
                />
              </div>
              <div>
                <label>Name</label>
                <input
                  className="txt-primary"
                  type="text"
                  id="Fname"
                  value={name}
                  onChange={(props) => setName(props.target.value)}
                />
              </div>
              <div>
                <label>Description</label>
                <input
                  className="txt-primary"
                  type="text"
                  id="Desc"
                  value={desc}
                  onChange={(props) => setDesc(props.target.value)}
                />
              </div>
              <div>
                <label>Normal Side</label>
                <input
                  className="txt-primary"
                  type="text"
                  id="normalSide"
                  value={normalSide}
                  onChange={(props) => setNormal(props.target.value)}
                />
              </div>
              <div>
                <label>Category</label>
                <select
                  className="txt-primary"
                  type="text"
                  id="category"
                  value={category}
                  onChange={(props) => setCategory(props.target.value)}
                >
                  <option value="none" selected disabled hidden>
                    Select an Option
                  </option>
                  <option value="assets">Assets</option>
                  <option value="liabilities">Liabilities</option>
                  <option value="equity">Equity</option>
                  <option value="revenue">Revenue</option>
                  <option value="expenses">Expenses</option>
                </select>
              </div>
              <div>
                <label>Subcategory</label>
                <input
                  className="txt-primary"
                  type="text"
                  id="subcat"
                  value={subcategory}
                  onChange={(props) => setSubcat(props.target.value)}
                />
              </div>
              <div>
                <label>Balance</label>
                <div className="flex flex-row ml-2">
                  <p className="m-auto text-xl">$</p>
                  <input
                    className="txt-primary"
                    type="number"
                    id="balance"
                    value={balance}
                    onChange={(props) => setBalance(props.target.value)}
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
                      type="number"
                      id="credit"
                      value={credit}
                      onChange={(props) => setCredit(props.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label>Debit</label>
                  <div className="flex flex-row ml-2">
                    <p className="m-auto text-xl">$</p>
                    <input
                      className="txt-primary"
                      type="number"
                      id="debit"
                      value={debit}
                      onChange={(props) => setDebit(props.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div>
                <label>Assigned Users</label>
                <input
                  className="txt-primary"
                  type="text"
                  id="comment"
                  disabled
                  value={selectedUsers}
                />
                <div className="flex justify-end mt-2">
                  <div className="flex flex-col">
                    <label>Add Users</label>
                    <select className="txt-primary" id="users" multiple>
                      {userList.map((user, index) => (
                        <option
                          key={index}
                          value={user}
                          onClick={handleSelect}
                          selected={selectColor}
                        >
                          {user}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div>
                <label>Comment</label>
                <input
                  className="txt-primary"
                  type="text"
                  id="comment"
                  value={comment}
                  onChange={(props) => setComment(props.target.value)}
                />
              </div>
              <div>
                <label>Statement</label>
                <select
                  className="txt-primary"
                  type="text"
                  id="statement"
                  value={statement}
                  onChange={(props) => setStatement(props.target.value)}
                >
                  <option value="none" selected disabled hidden>
                    Select an Option
                  </option>
                  <option value="BS">Balance Sheet</option>
                  <option value="RE">Retained Earnings</option>
                  <option value="IS">Income Statement</option>
                </select>
              </div>
            </div>
            <div className="flex justify-between">
              <Link to="/chartofaccounts">
                <button className="btn-primary btn-color-red">Go Back</button>
              </Link>
              <button className="btn-primary" onClick={handleAddAcct}>
                Add Account
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export { ChartOfAccounts, AdminAddAccount };
