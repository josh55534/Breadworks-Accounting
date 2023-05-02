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
import { JournalList, JournalListPending } from "./pages/journalizing/journalList";
import { JournalEntry } from "./pages/journalizing/journalEntry";
import { CreateJournal } from "./pages/journalizing/journalCreate";
import { AccountLedger } from "./pages/chartOfAccounts/accountLedger";
import { JournalHome } from "./pages/journalizing/journalHome";

import { DocumentHome } from "./pages/documents/documentHome";

import { EventLog } from "./pages/eventDashboard";

const token = localStorage.getItem("token");

function App() {

  useEffect(() => {
    if(!token && !(window.location.pathname.startsWith("/register") || window.location.pathname.startsWith("/login") || window.location.pathname==="/")) {
      window.location.href="/";
    }
  }, [token])
  
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />}/>

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

        <Route path="/journal" element={<JournalHome />} />
        <Route path="/journal/account/" element={<JournalAccounts />} />
        <Route path="/journal/account/:accountId" element={<AccountLedger />} />
        <Route path="/journal/entry/:journalEntryID" element={<JournalEntry />} />
        <Route path="/journal/entries" element={<JournalList />} />
        <Route path="/journal/entries/new-entry" element={<CreateJournal />} />
        <Route path="/journal/entries/pending" element={<JournalListPending />} />


        <Route path="/documents/" element={<DocumentHome />}/>

        <Route path="/eventlog" element={<EventLog />} />
      </Routes>
    </>
  );
}

export default App;
