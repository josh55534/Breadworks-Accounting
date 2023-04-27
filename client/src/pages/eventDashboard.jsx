import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendPath } from "../../config";

function EventLog() {
  const [accounts, setAccounts] = useState([]);
  const [journals, setJournals] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [selectedJournal, setSelectedJournal] = useState("");
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // Fetch accounts and journals data
    axios
      .get(`${backendPath}/eventlog/accounts`)
      .then((response) => {
        setAccounts(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

    axios
      .get(`${backendPath}/eventlog/journals`)
      .then((response) => {
        setJournals(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  function handleAccountClick(accountId) {
    // Fetch logs for selected account
    axios
      .get(`${backendPath}/eventlog/accounts/${accountId}`)
      .then((response) => {
        setLogs(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

    setSelectedAccount(accountId);
    setSelectedJournal("");
  }

  function handleJournalClick(journalId) {
    // Fetch logs for selected journal
    axios
      .get(`${backendPath}/eventlog/journals/${journalId}`)
      .then((response) => {
        setLogs(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

    setSelectedJournal(journalId);
    setSelectedAccount("");
  }
  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 mt-10 ml-28 mr-28">
      <h2 className="text-center">Accounts and Journals</h2>
      <div className="flex">
        <div className="w-1/2 pr-2">
          <h2 className="text-xl font-bold mb-2">Accounts</h2>
          <ul className="border rounded-lg overflow-hidden">
            {accounts.map((account) => (
              <li
                key={account}
                className={`px-3 py-2 cursor-pointer ${
                  account === selectedAccount ? "bg-gray-200" : ""
                }`}
                onClick={() => handleAccountClick(account)}
              >
                {account}
              </li>
            ))}
          </ul>
        </div>
        <div className="w-1/2 pl-2">
          <h2 className="text-xl font-bold mb-2">Journals</h2>
          <ul className="border rounded-lg overflow-hidden">
            {journals.map((journal) => (
              <li
                key={journal}
                className={`px-3 py-2 cursor-pointer ${
                  journal === selectedJournal ? "bg-gray-200" : ""
                }`}
                onClick={() => handleJournalClick(journal)}
              >
                {journal}
              </li>
            ))}
          </ul>
        </div>
      </div>
      {selectedAccount && (
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-2">
            Logs for Account {selectedAccount}
          </h2>
          {logs.length > 0 ? (
            <ul className="border rounded-lg overflow-hidden">
              {logs.map((log) => (
                <li key={log.id} className="px-3 py-2">
                  <ul>
                    <li>
                      <strong>Timestamp:</strong>{" "}
                      {new Date(log.timestamp._seconds * 1000).toLocaleString()}
                    </li>
                    <li>
                      <strong>Change Type:</strong> {log.changeType}
                    </li>
                    <li>
                      <strong>User ID:</strong> {log.userId}
                    </li>
                    <li>
                      <strong>Account ID:</strong> {log.accountId}
                    </li>
                    {log.oldAccount ? (
                      <>
                        <li>
                          <strong>Name (old):</strong> {log.oldAccount.name}
                        </li>
                        <li>
                          <strong>Description (old):</strong>{" "}
                          {log.oldAccount.desc}
                        </li>
                        <li>
                          <strong>Category (old):</strong>{" "}
                          {log.oldAccount.category}
                        </li>
                        <li>
                          <strong>Subcategory (old):</strong>{" "}
                          {log.oldAccount.subcategory}
                        </li>
                        <li>
                          <strong>Statement (old):</strong>{" "}
                          {log.oldAccount.statement}
                        </li>
                        <li>
                          <strong>Normal Side (old):</strong>{" "}
                          {log.oldAccount.normalSide}
                        </li>
                        <li>
                          <strong>Balance (old):</strong>{" "}
                          {log.oldAccount.balance}
                        </li>
                      </>
                    ) : (
                      <li>No previous account information found</li>
                    )}
                    {log.newAccount ? (
                      <>
                        <li>
                          <strong>Name (new):</strong> {log.newAccount.name}
                        </li>
                        <li>
                          <strong>Description (new):</strong>{" "}
                          {log.newAccount.desc}
                        </li>
                        <li>
                          <strong>Category (new):</strong>{" "}
                          {log.newAccount.category}
                        </li>
                        <li>
                          <strong>Subcategory (new):</strong>{" "}
                          {log.newAccount.subcategory}
                        </li>
                        <li>
                          <strong>Statement (new):</strong>{" "}
                          {log.newAccount.statement}
                        </li>
                        <li>
                          <strong>Normal Side (new):</strong>{" "}
                          {log.newAccount.normalSide}
                        </li>
                        <li>
                          <strong>Balance (new):</strong>{" "}
                          {log.newAccount.balance}
                        </li>
                      </>
                    ) : (
                      <li>No new account information found</li>
                    )}
                  </ul>
                </li>
              ))}
            </ul>
          ) : (
            <p>No logs found for this account.</p>
          )}
        </div>
      )}
      {selectedJournal && (
  <div className="mt-4">
    <h2 className="text-xl font-bold mb-2">
      Logs for Journal {selectedJournal}
    </h2>
    {logs.length > 0 ? (
      <ul className="border rounded-lg overflow-hidden">
        {logs.map((log) => (
          <li key={log.id} className="px-3 py-2">
            <ul>
              <li>
                <strong>Journal ID:</strong> {log.journalId}
              </li>
              <li>
                <strong>Timestamp:</strong>{" "}
                {new Date(log.timestamp._seconds * 1000).toLocaleString()}
              </li>

              <li>
                <strong>Change Type:</strong> {log.changeType}
              </li>
              <li>
                <strong>User ID:</strong> {log.userId}
              </li>
            </ul>
          </li>
        ))}
      </ul>
    ) : (
      <p>No logs to display.</p>
    )}
  </div>
)}

    </div>
  );
}

export { EventLog };
