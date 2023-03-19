import { useState, useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import jwt_decode from "jwt-decode";
const token = localStorage.getItem("token");

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

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
        setMessage("Login successful");
      })
      .catch((err) => {
        setError(err.response.data.errors);
      });
  };

  //on login display seccessful login and navigate to home page
  const navigate = useNavigate();
  useEffect(() => {
    if (message) {
      setTimeout(() => {
        setMessage("");
        navigate("/");
        window.location.reload();
      }, 3000);
    }
  }, [message]);

  if (token) {
    return <Navigate replace to="/" />;
  } else {
    return (
      <div className="flex flex-col items-center">
        <div className="bg-white p-5 rounded-lg shadow-xl w-4/12 mx-auto my-10">
          <form onSubmit={handleSubmit} >
            <h2>Login</h2>

            <div className="px-2">
              <div className="mb-4">
                <label className="block font-medium mb-2" htmlFor="username">
                  Email
                </label>
                <input
                  className="txt-primary"
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="mb-2">
                <label className="block font-medium mb-2" htmlFor="password">
                  Password
                </label>
                <input
                  className="txt-primary mb-1"
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Link to="/login/forgotpassword" className="mx-1">
                  <a className="text-indigo-500 font-medium text-sm">
                    Forgot Password?
                  </a>
                </Link>
              </div>
            </div>

            {error ? (
              <div className="text-red-500 font-medium mb-4">{error}</div>
            ) : null}

            <div className="flex flex-row pb-2">
              <div className="flex w-full m-auto">
                <Link to="/register">
                  <a className="btn-secondary">
                    Create Account
                  </a>
                </Link>
              </div>
              <button className="btn-primary">
                Login
              </button>
            </div>
            <p>{message}</p>
          </form>
        </div>
      </div>
    );
  }
};

export function ForgotPass() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    axios
      .post("http://localhost:5000/login/forgotpassword", {
        email: email,
      })
      .then((res) => {
        console.log(res.data);
        localStorage.setItem("token", res.data.token);
        setMessage(`An email was sent to ${email} with a password reset link`);
        setError(null);
      })
      .catch((err) => {
        setError(err.response.data.errors);
        setMessage("");
      });
  };

  return (
    <div className="flex flex-col items-center">
      <div className="bg-white p-6 rounded-lg shadow-xl w-4/12 mx-auto my-10">
        <form
          onSubmit={handleSubmit}
        >
          <h2>Password Reset</h2>

          <div className="px-2">
            <div className="mb-4">
              <label className="block font-medium mb-2" htmlFor="email">
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
          </div>
          {error ? (
            <div className="text-red-500 font-medium mb-4">{error}</div>
          ) : null}
          <button className="btn-primary float-right">
            Reset Password
          </button>
          <p class="mt-2">{message}</p>
        </form>
      </div>
    </div>
  );
}

export function ResetPass() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      var decoded = jwt_decode(token);
      setEmail(decoded.user.email);
    }
    else if (!token || decoded.user.forgotpassword === false) {
      navigate('/');
    }

  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    await axios
      .put(`http://localhost:5000/login/resetpassword`, {
        email: email,
        password: password,
      })
      .then((res) => {
        console.log(res.data);
        setMessage("Successfully Reset Password");
      })
      .catch((err) => {
        setError(err.response.data.errors);
      });
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-center items-center mb-10 mt-10">
        <form
          className="bg-white p-6 rounded-lg shadow-md"
          onSubmit={handleSubmit}
        >
          <h2 className="text-lg font-medium mb-4">Enter your new password</h2>
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
            Set Password
          </button>
          <p>{message}</p>
        </form>
      </div>
    </div>
  );
}
