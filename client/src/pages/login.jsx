import { useState, useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import jwt_decode from "jwt-decode";
const token = localStorage.getItem("token");

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    setError(null);
    axios
      .post("http://localhost:5000/login", {
        username: username,
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
      }, 1000);
    }
  }, [message]);

  if (token) {
    return <Navigate replace to="/" />;
  } else {
    return (
      <div className="window-primary">
        <form onSubmit={handleSubmit} >
          <h2>Login</h2>

          <div className="form-primary">
            <div>
              <label htmlFor="username">
                Username
              </label>
              <input
                className="txt-primary"
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="password">
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
        </form>
      </div>
    );
  }
};

function ForgotPass() {
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
    <div className="window-primary">
      <form onSubmit={handleSubmit}>
        <h2>Password Reset</h2>

        <div className="form-primary">
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
        </div>
        {error ? (
          <div className="text-red-500 font-medium mb-4">{error}</div>
        ) : null}
        <div className="flex justify-end">
          <button className="btn-primary">
            Reset Password
          </button>
        </div>
        <p class="mt-2">{message}</p>
      </form>
    </div>
  );
}

function ResetPass() {
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
    <div className="window-primary">
      <form onSubmit={handleSubmit} >
        <h2>Enter your new password</h2>
        <div className="form-primary">
          <div>
            <label htmlFor="password">
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
        </div>
        {error ? (
          <div className="text-red-500 font-medium mb-4">{error}</div>
        ) : null}
        <div className="flex justify-end">
          <button className="btn-primary">
            Set Password
          </button>
        </div>
        <p>{message}</p>
      </form>
    </div>
  );
}

export { Login, ResetPass, ForgotPass };