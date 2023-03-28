import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Header from "./header";
import Register from "./pages/register";
import { Login, ForgotPass, ResetPass } from "./pages/login";
import Home from "./pages/home";
import AdminDash from "./pages/adminDashboard";
import { EmailForm, AdminMain, UpdateUserForm, RegisterAdmin } from "./pages/adminDashboard";
import { AdminAddAccount, ChartOfAccounts } from "./pages/chartOfAccounts/chartOfAccounts";
import { Account } from "./pages/chartOfAccounts/account";
import { JournalAccounts } from "./pages/journalizing/journalAccounts";
import { JournalList } from "./pages/journalizing/journalList";
import { JournalEntry } from "./pages/journalizing/journalEntry";

function App() {
  return (
    <>
      <Header />
      <Home/>
      <Routes>
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
        <Route path="/chartofaccounts/addAccount/" element={<AdminAddAccount />} />

        <Route path="/journal" element={<JournalAccounts />} />
        <Route path="/journal/:accountId" element={<JournalList />} />
        <Route path="/journal/:accountId/:journalEntry" element={<JournalEntry />} />
      </Routes>
    </>
  );
}

export default App;
