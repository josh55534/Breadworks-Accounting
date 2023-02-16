import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Route,
  Link,
  Redirect,
  useHistory,
  useLocation,
} from "react-router-dom";
import Header from "./header";
import jwt_decode from "jwt-decode";
import RegisterPage from "./register/component";
import LoginPage from './login/component';

function Sub() {
  const [data, setData] = useState(null);
  const token = localStorage.getItem("token");
  if(token){
  var decoded = jwt_decode(token);
  }
  useEffect(() => {
    fetch("http://localhost:5000/")
      .then((response) => response.text())
      .then((text) => setData(text));
  }, []);

  const history = useHistory();

  return (
    <div>
      <div>
        <Header />
      </div>
      <div className="grid place-items-center mt-5 bg-yellow-800 text-white py-1 px-2">
        {data ? <div>{data}</div> : <div>Loading...</div>}
      </div>
      {decoded && decoded.user.role === "admin" && (
        <div className="grid place-items-center pr-28">
          <button className="mt-4 bg-orange-600 rounded-sm hover:bg-orange-700 ml-44"
            onClick={() => {
              history.push("/adminDashboard/");
              window.location.reload();
            }}
          >
            Go to Admin Dashboard
          </button>
        </div>
      )}
	  {decoded && decoded.user.verify === "unverified" && (
        <div className="mx-auto bg-red-600 text-slate-100 w-80 mt-4">
		You will recieve an email at {decoded.user.email} after an Admin verifies your account
		</div>
	  )}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Route path="/" component={Sub} />
      <Route exact path="/register/" component={RegisterPage} />
	  <Route exact path="/login/" component={LoginPage} />
    </BrowserRouter>
  );
}

export default App;
