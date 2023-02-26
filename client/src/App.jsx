import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Header from "./header";
import Register from "./pages/register";
import Login from "./pages/login";
import Home from "./pages/home";
import AdminDash from "./pages/adminDashboard";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admindashboard" element={<AdminDash />} />
      </Routes>
    </>
  );
}

export default App;
