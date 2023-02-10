import React, { useState } from "react";
import axios from "axios";
import { Form, FormGroup, Input, Label, Button } from 'reactstrap';

const LoginPage = () => {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();

    axios
      .post("http://localhost:5000/login", {
        email: username,
        password: password,
      })
      .then((res) => {
        console.log(res.data);
        localStorage.setItem("token", res.data.token);
        window.location.href = "/adminDashboard/";
      })
      .catch((err) => {
        setError(err.response.data.errors);
      });
  };

  return (
    <div className="flex h-screen justify-center items-center">
      <form className="bg-white p-6 rounded-lg shadow-md" onSubmit={handleSubmit}>
        <h2 className="text-lg font-medium mb-4">Login</h2>
        <div className="mb-4">
          <label className="block font-medium mb-2" htmlFor="username">
            Email
          </label>
          <input
            className="border border-gray-400 p-2 w-full"
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
        {error ? (
          <div className="text-red-500 font-medium mb-4">{error}</div>
        ) : null}
        <button className="bg-indigo-500 text-white py-2 px-4 rounded-full hover:bg-indigo-600">
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;