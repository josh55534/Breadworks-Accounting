import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Link, Redirect } from "react-router-dom";
import LoginPage from "../login/component";
import axios from "axios";
import Header from '../header'

function AdminPage() {
  //If token isn't active redirects you to the login page
  const token = localStorage.getItem("token");
  if (!token) {
    return <Redirect to="/login/" />;
  }

  //Looks for the Bearer
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  //Gets the main page of adminDashboard which returns "admin dashboard" if authorized as an administrator
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/adminDashboard", config)
      .then((response) => response.text())
      .then((text) => setData(text))
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
        setUsers(res.data.users);
		setEmails(res.data.emails);
		setRoles(res.data.roles);
		setVerifies(res.data.verifies);
		setStatus(res.data.status);
        setLoading(false);
      })
      .catch((err) => {
		window.location.href = "/login/";
        console.error(err);
        setLoading(false);
  }, []);
})

  return (
	<div>
		<Header />
	<form>
    <div className="bg-red-500 w-fit rounded-lg font-bold mx-auto">
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
			  <th className="text-sm font-medium text-gray-700 p-2">Username</th>
			  <th className="text-sm font-medium text-gray-700 p-2 ">Email</th>
			  <th className="text-sm font-medium text-gray-700 p-2 ">Role</th>
			  <th className="text-sm font-medium text-gray-700 p-2 ">Verification</th>
			  <th className="text-sm font-medium text-gray-700 p-2 ">Status</th>
			</tr>
		  </thead>
		  <tbody>
              {users.map((user, index) => (
                <tr key={index}>
                  <td className="p-2 border-t border-gray-200">{user}</td>
                  <td className="p-2 border-t border-gray-200">{emails[index]}</td>
                  <td className="p-2 border-t border-gray-200">{roles[index]}</td>
				  <td className="p-2 border-t border-gray-200">{verifies[index]}</td>
				  <td className="p-2 border-t border-gray-200">{status[index]}</td>
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
  const token = localStorage.getItem("token");
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
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-xl w-7/12 mx-auto">
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

function App() {
  return (
    <BrowserRouter>
      <Route path="/adminDashboard" component={AdminPage} />
      <Route path="/adminDashboard" component={EmailForm} />
      <Route exact path="/login/" component={LoginPage} />
    </BrowserRouter>
  );
}

export default App;
