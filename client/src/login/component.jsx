import { useState } from 'react';
import { BrowserRouter, Route, Link, Redirect, useHistory, useLocation } from "react-router-dom";
import axios from 'axios';
import RegisterPage from '../register/component'
import Header from '../header'

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const history = useHistory();

  const handleSubmit = (event) => {
    event.preventDefault();

    axios
      .post('http://localhost:5000/login', {
        email: username,
        password: password,
      })
      .then((res) => {
        console.log(res.data);
        localStorage.setItem('token', res.data.token);
        history.push('/');
		window.location.reload();
      })
      .catch((err) => {
        setError(err.response.data.errors);
      });
  };


  return (
	<div>
		<Header />
    <div className="flex justify-center items-center mb-10 mt-10">
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
	</div>
  );
};

function notSignedUp(){
	const history = useHistory();
	function handleRegisterButtonClick() {
		history.push('/register/');
		window.location.reload();
	  }

	  return (
		<div className='flex justify-center pb-10'>
		<button
          onClick={handleRegisterButtonClick}
          className="bg-red-600 text-white py-2 px-4 rounded-full hover:bg-red-800" 
        >
          Not signed up?
        </button>
		</div>
	  )
}

function LoginPage(){
	return (
		<BrowserRouter>
		  <Route path="/login/" component={Login} />
		  <Route path="/login/" component={notSignedUp} />
		  <Route exact path="/register/" component={RegisterPage} />
		</BrowserRouter>
	  );
}
export default LoginPage;
