import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import jwt_decode from "jwt-decode";
const token = localStorage.getItem("token");

function AdminMain() {
  //Looks for the Bearer
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  //Gets the main page of adminDashboard which returns "admin dashboard" if authorized as an administrator
  const [data, setData] = useState(null);
  const [showDropdownIndex, setShowDropdownIndex] = useState(-1);

  const handleVerify = (email) => {
    axios
      .put(`http://localhost:5000/adminDashboard/verify/${email}`, null, config)
      .then((res) => console.log(res.data))
      .catch((err) => console.error(err));
  };

  const handleActivate = (email) => {
    axios
      .put(
        `http://localhost:5000/adminDashboard/activate/${email}`,
        null,
        config
      )
      .then((res) => console.log(res.data))
      .catch((err) => console.error(err));
  };

  const handleDeactivate = (email) => {
    axios
      .put(
        `http://localhost:5000/adminDashboard/deactivate/${email}`,
        null,
        config
      )
      .then((res) => console.log(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetch("http://localhost:5000/adminDashboard", config)
      .then((response) => response.text())
      .then((text) => setData(text));
  }, [config]);

  const [users, setUsers] = useState([]);
  const [emails, setEmails] = useState([]);
  const [roles, setRoles] = useState([]);
  const [verifies, setVerifies] = useState([]);
  const [status, setStatus] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    axios
      .get("http://localhost:5000/adminDashboard/users", config)
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
        <Link to= '/login'></Link>
        console.error(err);
        setLoading(false);
      });
  }, [config]);

  return (
    <div>
      <form>
        <div className="bg-orange-600 w-fit rounded-sm font-bold mx-auto">
          {data ? <div>{data}</div> : <div>Loading...</div>}
        </div>
        <div className="mt-10 mb-10 flex flex-col bg-white p-6 rounded-lg shadow-xl w-fit mx-auto">
          {loading ? (
            <div className="flex items-center justify-center h-fit">
              Loading...
            </div>
          ) : (
            <div className="px-8 py-6">
              <table className="min-w-fit text-left table-collapse">
                <thead>
                  <tr>
                    <th className="text-sm font-medium text-gray-700 p-2">
                      Username
                    </th>
                    <th className="text-sm font-medium text-gray-700 p-2 ">
                      Email
                    </th>
                    <th className="text-sm font-medium text-gray-700 p-2 ">
                      Role
                    </th>
                    <th className="text-sm font-medium text-gray-700 p-2 ">
                      Verification
                    </th>
                    <th className="text-sm font-medium text-gray-700 p-2 ">
                      Status
                    </th>
                    <th className="text-sm font-medium text-gray-700 p-2 ">
                      Options
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={index}>
                      <td className="p-2 border-t border-gray-200">{user}</td>
                      <td className="p-2 border-t border-gray-200">
                        {emails[index]}
                      </td>
                      <td className="p-2 border-t border-gray-200">
                        {roles[index]}
                      </td>
                      <td className="p-2 border-t border-gray-200">
                        {verifies[index]}
                      </td>
                      <td className="p-2 border-t border-gray-200">
                        {status[index]}
                      </td>
                      <td className="p-2 border-t border-gray-200">
                        <div className="relative">
                          <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
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
                            <div
                              className="absolute left-0 mt-2 py-2 w-48 bg-white rounded-md shadow-xl origin-top-right "
                              style={{ zIndex: 1 }}
                            >
                              {verifies[index] !== "unverified" ? null : (
                                <button
                                  className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left"
                                  onClick={() => handleVerify(emails[index])}
                                >
                                  Verify
                                </button>
                              )}
                              {status[index] !== "deactivated" ? null : (
                                <button
                                  className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left"
                                  onClick={() => handleActivate(emails[index])}
                                >
                                  Activate
                                </button>
                              )}
                              {status[index] !== "activated" ? null : (
                                <button
                                  className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left"
                                  onClick={() =>
                                    handleDeactivate(emails[index])
                                  }
                                >
                                  Deactivate
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

//Alows Admin to send an email to any user
function EmailForm() {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
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
        "http://localhost:5000/adminDashboard/email",
        {
          email,
          subject,
          message,
        },
        config
      )
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  //Gets the json values of all emails in firebase
  useEffect(() => {
    axios
      .get("http://localhost:5000/adminDashboard/emailsAvailable", config)
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
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-xl w-7/12 mx-auto"
    >
      <div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div className="mb-4">
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
          </>
        )}
      </div>
      <div className="mb-10">
        <label
          className="block text-gray-700 font-medium mb-2"
          htmlFor="subject"
        >
          Subject
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="subject"
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label
          className="block text-gray-700 font-medium mb-2"
          htmlFor="message"
        >
          Message
        </label>
        <textarea
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
      <div className="flex items-center justify-between">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Submit
        </button>
      </div>
    </form>
  );
}

function UpdateUserForm({ email }) {
  const [Fname, setFname] = useState("");
  const [Lname, setLname] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [DOB, setDOB] = useState("");
  const [role, setRole] = useState("");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await fetch(`/adminDashboard/update/${email}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...config.headers },
      body: JSON.stringify({
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
      }),
    });
    const data = await response.json();
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        First Name:
        <input
          type="text"
          value={Fname}
          onChange={(e) => setFname(e.target.value)}
        />
      </label>
      <br />
      <label>
        Last Name:
        <input
          type="text"
          value={Lname}
          onChange={(e) => setLname(e.target.value)}
        />
      </label>
      <br />
      <label>
        Email:
        <input
          type="email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
        />
      </label>
      <br />
      <label>
        Street Address:
        <input
          type="text"
          value={streetAddress}
          onChange={(e) => setStreetAddress(e.target.value)}
        />
      </label>
      <br />
      <label>
        City:
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
      </label>
      <br />
      <label>
        State:
        <input
          type="text"
          value={state}
          onChange={(e) => setState(e.target.value)}
        />
      </label>
      <br />
      <label>
        Zip Code:
        <input
          type="text"
          value={zipCode}
          onChange={(e) => setZipCode(e.target.value)}
        />
      </label>
      <br />
      <label>
        Date of Birth:
        <input
          type="date"
          value={DOB}
          onChange={(e) => setDOB(e.target.value)}
        />
      </label>
      <br />
      <label>
        Role:
        <input
          type="text"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />
      </label>
      <br />
      <button type="submit">Update User</button>
    </form>
  );
}

const AdminDash = () => {
  //If token isn't active or you are not an admin returns to home page
  if (token) {
    var decoded = jwt_decode(token);
  }
  if (!token || decoded.user.role !== "admin") {
    return <Navigate replace to="/" />;
  } else {
  return (
    <>
      <AdminMain />
      <EmailForm />
    </>
  );
  }
};

export default AdminDash;
