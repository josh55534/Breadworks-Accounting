import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import jwt_decode from "jwt-decode";
const token = localStorage.getItem("token");

const AdminHeader = () => {
  //Gets the main page of adminDashboard which returns "admin dashboard" if authorized as an administrator
  const [data, setData] = useState(null);
  //Looks for the Bearer
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    fetch("http://localhost:5000/adminDashboard", config)
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
        <div className="bg-orange-600 w-fit rounded-sm font-bold mx-auto">
          {data ? <div>{data}</div> : <div>Loading...</div>}
        </div>
        <div className="flex justify-center">
          <Link to="/admindashboard/email">
            <button
              className="mt-4 bg-orange-600 rounded-sm hover:bg-orange-700 ml-2"
              onClick={() => { }}
            >
              Email
            </button>
          </Link>
          <Link to="/admindashboard/view">
            <button
              className="mt-4 bg-orange-600 rounded-sm hover:bg-orange-700 ml-2"
              onClick={() => { }}
            >
              View Users
            </button>
          </Link>
          <Link to="/admindashboard/register">
            <button
              className="mt-4 bg-orange-600 rounded-sm hover:bg-orange-700 ml-2"
              onClick={() => { }}
            >
              Register
            </button>
          </Link>
        </div>
      </>
    );
  }
};

export function AdminMain() {
  //Looks for the Bearer
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

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
        <Link to="/login"></Link>;
        console.error(err);
        setLoading(false);
      });
  }, [config]);

  return (
    <>
      <AdminHeader />
      <div>
        <form>
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
                                    onClick={() =>
                                      handleActivate(emails[index])
                                    }
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
                                <Link
                                  to={`/admindashboard/update/${emails[index]}`}
                                >
                                  <button className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left">
                                    Update
                                  </button>
                                </Link>
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
    </>
  );
}

//Alows Admin to send an email to any user
export function EmailForm() {
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
    <>
      <AdminHeader />
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-xl w-7/12 mx-auto mt-10 mb-10"
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
          <div className="flex items-center">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Submit
            </button>
            <p className="ml-2">{fbmessage}</p>
          </div>
        </div>
      </form>
    </>
  );
}

export function UpdateUserForm() {
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
          const response = await axios.get(`http://localhost:5000/admindashboard/userByEmail/${email}`, config);
          const data = response.data;
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
        } catch (error) {
          console.log(error);
        }
      };
      fetchData();
    }
  }, [email, config, isDataFetched]);


  const handleSubmit = async (event) => {
    event.preventDefault();

    await axios.put(`http://localhost:5000/adminDashboard/update/${email}`, {
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
      <div className="max-w-lg mx-auto mt-10 mb-10">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        >
          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="Fname"
            >
              First Name:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              value={Fname}
              onChange={(e) => setFname(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="Lname"
            >
              Last Name:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              value={Lname}
              onChange={(e) => setLname(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="newEmail"
            >
              Email:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="streetAddress"
            >
              Street Address:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              value={streetAddress}
              onChange={(e) => setStreetAddress(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="city"
            >
              City:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="state"
            >
              State:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="zipcode"
            >
              Zip Code:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="DOB">
              Date of Birth:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="date"
              value={DOB}
              onChange={(e) => setDOB(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="role"
            >
              Role:
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="basic">Basic</option>
            </select>
          </div>
          {error ? (
            <div className="text-red-500 font-medium mb-4">{error}</div>
          ) : null}
          <button className="bg-indigo-500 text-white py-2 px-4 rounded-full hover:bg-indigo-600">
            Update User
          </button>
          <p>{message}</p>
        </form>
      </div>
    </>
  );
}

export function RegisterAdmin() {
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
      .post("http://localhost:5000/adminDashboard/register", {
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
      <AdminHeader />
      <div className="flex flex-col items-center">
        <div className="bg-white p-6 rounded-lg shadow-xl w-4/12 mx-auto mt-10 mb-10">
          <form onSubmit={handleSubmit}>
            <h2 className="text-lg font-medium mb-4">Register</h2>
            <div className="mb-4">
              <label className="block font-medium mb-2" htmlFor="Fname">
                First Name
              </label>
              <input
                className="border border-gray-400 p-2 w-full"
                type="text"
                id="Fname"
                value={Fname}
                onChange={(e) => setFname(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block font-medium mb-2" htmlFor="Lname">
                Last Name
              </label>
              <input
                className="border border-gray-400 p-2 w-full"
                type="text"
                id="Lname"
                value={Lname}
                onChange={(e) => setLname(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block font-medium mb-2" htmlFor="email">
                Email
              </label>
              <input
                className="border border-gray-400 p-2 w-full"
                type="text"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block font-medium mb-2" htmlFor="password">
                Password
              </label>
              <input
                className="border border-gray-400 p-2 w-full"
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block font-medium mb-2" htmlFor="street_address">
                Street Address
              </label>
              <input
                className="border border-gray-400 p-2 w-full"
                type="text"
                id="street_address"
                name="street_address"
                value={address.street_address}
                onChange={handleAddressChange}
              />
            </div>
            <div className="mb-4">
              <label className="block font-medium mb-2" htmlFor="city">
                City
              </label>
              <input
                className="border border-gray-400 p-2 w-full"
                type="text"
                id="city"
                name="city"
                value={address.city}
                onChange={handleAddressChange}
              />
            </div>
            <div className="mb-4">
              <label className="block font-medium mb-2" htmlFor="state">
                State
              </label>
              <input
                className="border border-gray-400 p-2 w-full"
                type="text"
                id="state"
                name="state"
                value={address.state}
                onChange={handleAddressChange}
              />
            </div>
            <div className="mb-4">
              <label className="block font-medium mb-2" htmlFor="zip_code">
                Zip Code
              </label>
              <input
                className="border border-gray-400 p-2 w-full"
                type="text"
                id="zip_code"
                name="zip_code"
                value={address.zip_code}
                onChange={handleAddressChange}
              />
            </div>

            <div className="mb-4">
              <label className="block font-medium mb-2" htmlFor="DOB">
                Date of Birth
              </label>
              <input
                className="border border-gray-400 p-2 w-full"
                type="date"
                id="DOB"
                value={DOB}
                onChange={(e) => setDOB(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 font-bold mb-2"
                htmlFor="role"
              >
                Role:
              </label>
              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="basic">Basic</option>
              </select>
            </div>
            {error ? (
              <div className="text-red-500 font-medium mb-4">{error}</div>
            ) : null}

            <button className="bg-indigo-500 text-white py-2 px-4 rounded-full hover:bg-indigo-600">
              Register
            </button>
            <p>{message}</p>
          </form>
        </div>
      </div>
    </>
  );
}

const AdminDash = () => {
  return (
    <>
      <AdminHeader />
    </>
  );
};

export default AdminDash;
