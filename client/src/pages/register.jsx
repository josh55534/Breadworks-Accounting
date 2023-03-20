import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, Navigate, useNavigate } from "react-router-dom";

function Register() {
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

  const handleSubmit = (event) => {
    event.preventDefault();

    axios
      .post("http://localhost:5000/register", {
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
      })
      .then((res) => {
        console.log(res.data);
        localStorage.setItem("token", res.data.token);
        setMessage("Account registration successful");
      })
      .catch((err) => {
        setError(err.response.data.errors);
        console.log(err.response.data.errors)
      });
  };

  const handleAddressChange = (event) => {
    const { name, value } = event.target;
    setAddress((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const navigate = useNavigate();
  useEffect(() => {
    if (message) {
      setTimeout(() => {
        setMessage("");
        navigate('/');
      }, 3000);
    }
  }, [message]);

  return (
    <div className="window-primary">
      <form onSubmit={handleSubmit}>
        <h2>Register</h2>

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
        </div>

        {error ? (
          <div className="text-red-500 font-medium mb-4">{error}</div>
        ) : null}

        <div className="flex flex-row pt-1">
          <div className="w-full m-auto">
            <Link to='/login'>
              <a
                className="btn-secondary"
              >
                Already have an account?
              </a>
            </Link>
          </div>
          <button className="btn-primary">
            Register
          </button>
        </div>

        <p>{message}</p>
      </form>
    </div>
  );
};


export default Register;
