import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Header from "./header";
import Register from "./pages/register";
import { Login, ForgotPass, ResetPass } from "./pages/login";
import Home from "./pages/home";
import AdminDash from "./pages/adminDashboard";
import { EmailForm, AdminMain, UpdateUserForm, RegisterAdmin } from "./pages/adminDashboard";
import { ChartOfAccounts } from "./pages/chartOfAccounts/chartOfAccounts";
import { Account } from "./pages/chartOfAccounts/account";

function App() {
  return (
    <>
      <Header />
      <Home/>
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login/forgotpassword" element={<ForgotPass />} />
        <Route path="/login/resetpassword" element={<ResetPass />} />
        <Route path="/admindashboard" element={<AdminDash />} />
        <Route path="/admindashboard/email" element={<EmailForm />} />
        <Route path="/admindashboard/view" element={<AdminMain />} />
        <Route path="/admindashboard/update/:email" element={<UpdateUserForm />} />
        <Route path="/admindashboard/register" element={<RegisterAdmin />} />
        <Route path="/chartofaccounts" element={<ChartOfAccounts />} />
        <Route path="/account/:accountId" element={<Account />} />
      </Routes>
    </>
  );
}

export default App;
