import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { backendPath } from "../../config";
const token = localStorage.getItem("token");

function AdminNavbar() {
  return (
    <div className="flex justify-center gap-5">
      <Link to="/admindashboard/email">
        <button
          className="btn-primary"
          onClick={() => { }}
        >
          Email
        </button>
      </Link>
      <Link to="/admindashboard/view">
        <button
          className="btn-primary"
          onClick={() => { }}
        >
          View Users
        </button>
      </Link>
      <Link to="/admindashboard/register">
        <button
          className="btn-primary"
          onClick={() => { }}
        >
          New User
        </button>
      </Link>
    </div>
  )
}

function AdminHeader() {
  //Gets the main page of adminDashboard which returns "admin dashboard" if authorized as an administrator
  const [data, setData] = useState(null);
  //Looks for the Bearer
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    fetch(`${backendPath}/adminDashboard`, config)
      .then((response) => response.text())
      .then((text) => setData(text));
  }, [config]);

  //If token isn't active or you are not an admin returns to home page
  if (token) {
    var decoded = jwt_decode(token);
  }
  if (!token || decoded.user.role !== "admin") {
    return <Navigate replace to="/" />;
  } else {
    return (
      <>
        <div className="window-primary">
          <h2 className="text-center">Admin Dashboard</h2>
          <AdminNavbar />
          <div className="text-center mt-2">
                <label>To get started, click on one of the tabs above.</label>
                <label>Information on the tabs can be found below.</label>
            </div>
            <label className="mt-2">Information:</label>
            <div className="ml-4">
                <div className="mt-1">
                    <label>Email</label>
                    <p className="ml-4">
                        Administrators can send emails to the other users of the system.
                    </p>
                </div>
                <div className="mt-2">
                    <label>View Users</label>
                    <p className="ml-4">
                        Displays a list of all users. Administrators can view and update individual user information here, as well as 
                        change account access. Administrators may also activate or deactivate accounts.
                    </p>
                </div>
                <div className="mt-2">
                    <label>New User</label>
                    <p className="ml-4">
                        Administrators can create new accounts by manually inputting the user information.
                    </p>
                </div>
            </div>
        </div>
      </>
    );
  }
};

function AdminMain() {
  const [users, setUsers] = useState([]);
  const [emails, setEmails] = useState([]);
  const [roles, setRoles] = useState([]);
  const [verifies, setVerifies] = useState([]);
  const [status, setStatus] = useState([]);
  const [loading, setLoading] = useState(true);

  //Looks for the Bearer
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const [showDropdownIndex, setShowDropdownIndex] = useState(-1);

  const handleVerify = (email) => {
    axios
      .put(`${backendPath}/adminDashboard/verify/${email}`, null, config)
      .then((res) => console.log(res.data))
      .catch((err) => console.error(err));
  };

  const toggleActivate = (email, index) => {
    let activateDeactivate;
    if (status[index] === 'activated') activateDeactivate = "deactivate";
    else activateDeactivate = "activate"

    axios
      .put(
        `${backendPath}/adminDashboard/${activateDeactivate}/${email}`,
        null,
        config
      )
      .then((res) => console.log(res.data))
      .catch((err) => console.error(err));
  }

  useEffect(() => {
    axios
      .get(`${backendPath}/adminDashboard/users`, config)
      .then((res) => {
        const { data } = res;
        setUsers(data.map((d) => d.id));
        setEmails(data.map((d) => d.email));
        setRoles(data.map((d) => d.role));
        setVerifies(data.map((d) => d.verify));
        setStatus(data.map((d) => d.status));
        setLoading(false);
      })
      .catch((err) => {
        <Link to="/login"></Link>;
        console.error(err);
        setLoading(false);
      });
  }, [config]);

  return (
    <>
      <div className="window-primary px-2 text-center">
        <h2>Users</h2>
        <AdminNavbar />
        <form>
          {loading ? (
            <div className="flex items-center justify-center h-fit">
              Loading...
            </div>
          ) : (
            <div className="form-primary mt-4">
              <table className="user-table">
                <thead>
                  <tr>
                    <th className="user-table-header">
                      Username
                    </th>
                    <th className="user-table-header">
                      Email
                    </th>
                    <th className="user-table-header text-center">
                      Role
                    </th>
                    <th className="user-table-header text-center">
                      Verification
                    </th>
                    <th className="user-table-header text-center">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={index}>
                      <td className="user-table-body">{user}</td>
                      <td className="user-table-body">
                        {emails[index]}
                      </td>
                      <td className="user-table-body text-center">
                        {roles[index]}
                      </td>
                      <td className="user-table-body text-center">
                        {verifies[index]}
                      </td>
                      <td className="user-table-body text-center">
                        {status[index]}
                      </td>
                      <td className="user-table-body  w-0">
                        <div>
                          <button
                            className="btn-primary"
                            onClick={(event) => {
                              event.preventDefault();
                              setShowDropdownIndex(
                                index === showDropdownIndex ? -1 : index
                              );
                            }}
                          >
                            Options
                          </button>

                          {showDropdownIndex === index && (
                            <ul className="dropdown-menu-window-primary z-1">
                              {verifies[index] !== "unverified" ? null : (
                                <li>
                                  <button
                                    className="dropdown-menu-button-primary"
                                    onClick={() => handleVerify(emails[index])}
                                  >
                                    Verify
                                  </button>
                                </li>
                              )}
                              <li>
                                <button
                                  className="dropdown-menu-button-primary"
                                  onClick={() => toggleActivate(emails[index], index)}
                                >
                                  {status[index] === "activated" ? (<>Deactivate</>) : (<>Activate</>)}
                                </button>
                              </li>
                              <li>
                                <Link to={`/admindashboard/update/${emails[index]}`}>
                                  <button className="dropdown-menu-button-primary">
                                    Update
                                  </button>
                                </Link>
                              </li>
                            </ul>
                          )}
                        </div>
                      </td>
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

//Alows Admin to send an email to any user
function EmailForm() {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [fbmessage, setFbmessage] = useState("");
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  //Sends the emails on submit
  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post(
        `${backendPath}/adminDashboard/email`,
        {
          email,
          subject,
          message,
        },
        config
      )
      .then((res) => {
        console.log(res);
        setFbmessage("Email Sent");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  //Sets a feedback message for email sent successfully
  useEffect(() => {
    if (fbmessage) {
      setTimeout(() => {
        setMessage("");
        window.location.reload();
      }, 3000);
    }
  }, [fbmessage]);

  //Gets the json values of all emails in firebase
  useEffect(() => {
    axios
      .get(`${backendPath}/adminDashboard/emailsAvailable`, config)
      .then((res) => {
        setEmails(res.data.emails);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <div className="window-primary">
        <h2 className="text-center">Email</h2>
        <AdminNavbar/>
        <form onSubmit={handleSubmit}>
          <div className="form-primary">
            {loading ? (<p>Loading...</p>) : (
              <div>
                <label htmlFor="email">
                  Recipient
                </label>
                <select
                  className="txt-primary"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                >
                  {emails.map((email, index) => (
                    <option key={index} value={email}>
                      {email}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label htmlFor="subject">
                Subject
              </label>
              <input
                className="txt-primary"
                id="subject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="message">
                Message
              </label>
              <textarea
                className="txt-primary"
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              className="btn-primary"
              type="submit"
            >
              Submit
            </button>
          </div>
          <p>{fbmessage}</p>

        </form>
      </div>
    </>
  );
}

function UpdateUserForm() {
  const { email } = useParams();
  const [error, setError] = useState(null);
  const [Fname, setFname] = useState("");
  const [Lname, setLname] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [DOB, setDOB] = useState("");
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");
  const [loadedName, setLoadedName] = useState("");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const [isDataFetched, setIsDataFetched] = useState(false);
  useEffect(() => {
    if (!isDataFetched) {
      const fetchData = async () => {
        try {
          const response = await axios.get(`${backendPath}/admindashboard/userByEmail/${email}`, config);
          const data = await response.data;
          setFname(data.Fname);
          setLname(data.Lname);
          setNewEmail(data.email);
          setStreetAddress(data.address?.street_address || "");
          setCity(data.address?.city || "");
          setState(data.address?.state || "");
          setZipCode(data.address?.zip_code || "");
          setDOB(data.DOB || "");
          setRole(data.role || "");
          setIsDataFetched(true);

          setLoadedName(data.Fname + " " + data.Lname);
        } catch (error) {
          console.log(error);
        }
      };
      fetchData();
    }
  }, [email, config, isDataFetched]);


  const handleSubmit = async (event) => {
    event.preventDefault();

    await axios.put(`${backendPath}/adminDashboard/update/${email}`, {
      Fname,
      Lname,
      email: newEmail,
      address: {
        street_address: streetAddress,
        city,
        state,
        zip_code: zipCode,
      },
      DOB,
      role,
    }, {
      headers: { "Content-Type": "application/json", ...config.headers },
    })
      .then((res) => {
        console.log(res.data);
        setMessage("Successfully Updated User");
      })
      .catch((err) => {
        setError(err.response.data.errors);
      });
  };

  return (
    <>
      <AdminHeader />
      <div className="window-primary">
        <h2>Update Profile: {loadedName}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-primary">
            <div>
              <label htmlFor="Fname">
                First Name
              </label>
              <input
                className="txt-primary"
                type="text"
                value={Fname}
                onChange={(e) => setFname(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="Lname">
                Last Name
              </label>
              <input
                className="txt-primary"
                type="text"
                value={Lname}
                onChange={(e) => setLname(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="newEmail">
                Email
              </label>
              <input
                className="txt-primary"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="streetAddress">
                Street Address
              </label>
              <input
                className="txt-primary"
                type="text"
                value={streetAddress}
                onChange={(e) => setStreetAddress(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="city">
                City
              </label>
              <input
                className="txt-primary"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="state">
                State
              </label>
              <input
                className="txt-primary"
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="zipcode">
                Zip Code
              </label>
              <input
                className="txt-primary"
                type="text"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="DOB">
                Date of Birth
              </label>
              <input
                className="txt-primary"
                type="date"
                value={DOB}
                onChange={(e) => setDOB(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="role">
                Role
              </label>
              <select
                className="txt-primary"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="basic">Basic</option>
              </select>
            </div>
          </div>
          {error ? (
            <div className="text-red-500 font-medium mb-4">{error}</div>
          ) : null}
          <div className="flex flex-row justify-between">
            <Link to="/admindashboard/view" onClick={() => window.location.href = "/admindashboard/view"}>
              <button className="flex btn-primary btn-color-red justify-self-start">
                Back
              </button>
            </Link>
            <button className="btn-primary">
              Update User
            </button>
          </div>
          <p>{message}</p>
        </form>
      </div>
    </>
  );
}

function RegisterAdmin() {
  const [error, setError] = useState(null);
  const [Fname, setFname] = useState("");
  const [Lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState({
    street_address: "",
    city: "",
    state: "",
    zip_code: "",
  });
  const [DOB, setDOB] = useState("");
  const [message, setMessage] = useState("");
  const [role, setRole] = useState("");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    axios
      .post(`${backendPath}/adminDashboard/register`, {
        Fname: Fname,
        Lname: Lname,
        email: email,
        password: password,
        address: {
          street_address: address.street_address,
          city: address.city,
          state: address.state,
          zip_code: address.zip_code,
        },
        DOB: DOB,
        role: role
      }, config)
      .then((res) => {
        console.log(res.data);
        setMessage("Account registration successful");
      })
      .catch((err) => {
        setError(err.response.data.errors);
      });
  };

  const handleAddressChange = (event) => {
    const { name, value } = event.target;
    setAddress((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };


  return (
    <>
      <div className="window-primary">
        <form onSubmit={handleSubmit}>
          <h2 className="text-center">New User</h2>
          <AdminNavbar />
          <div className="form-primary">
            <div>
              <label htmlFor="Fname">
                First Name
              </label>
              <input
                className="txt-primary"
                type="text"
                id="Fname"
                value={Fname}
                onChange={(e) => setFname(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="Lname">
                Last Name
              </label>
              <input
                className="txt-primary"
                type="text"
                id="Lname"
                value={Lname}
                onChange={(e) => setLname(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="email">
                Email
              </label>
              <input
                className="txt-primary"
                type="text"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password">
                Password
              </label>
              <input
                className="txt-primary"
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="street_address">
                Street Address
              </label>
              <input
                className="txt-primary"
                type="text"
                id="street_address"
                name="street_address"
                value={address.street_address}
                onChange={handleAddressChange}
              />
            </div>
            <div>
              <label htmlFor="city">
                City
              </label>
              <input
                className="txt-primary"
                type="text"
                id="city"
                name="city"
                value={address.city}
                onChange={handleAddressChange}
              />
            </div>
            <div>
              <label htmlFor="state">
                State
              </label>
              <input
                className="txt-primary"
                type="text"
                id="state"
                name="state"
                value={address.state}
                onChange={handleAddressChange}
              />
            </div>
            <div>
              <label htmlFor="zip_code">
                Zip Code
              </label>
              <input
                className="txt-primary"
                type="text"
                id="zip_code"
                name="zip_code"
                value={address.zip_code}
                onChange={handleAddressChange}
              />
            </div>

            <div>
              <label htmlFor="DOB">
                Date of Birth
              </label>
              <input
                className="txt-primary"
                type="date"
                id="DOB"
                value={DOB}
                onChange={(e) => setDOB(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="role">
                Role
              </label>
              <select
                className="txt-primary"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="basic">Basic</option>
              </select>
            </div>
          </div>
          {error ? (
            <div className="text-red-500 font-medium mb-4">{error}</div>
          ) : null}
          <div className="flex justify-end">
            <button className="btn-primary">
              Register
            </button>
          </div>
          <p>{message}</p>
        </form>
      </div>
    </>
  );
}

function AdminDash() {
  return (
    <>
      <AdminHeader />
    </>
  );
};

export default AdminDash;
export { EmailForm, AdminMain, UpdateUserForm, RegisterAdmin };
