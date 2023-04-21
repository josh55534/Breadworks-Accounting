import { backendPath } from "../../../config";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { TrialBalance } from "./trialBalance";
import { BalanceSheet } from "./balanceSheet";

const token = localStorage.getItem("token");

const config = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};

function DocumentHome() {
  const [documentName, setDocumentName] = useState("none");
  const [date, setDate] = useState("");
  const [startGenerate, setStart] = useState(false);

  const handleGenerate = () => {
    if (documentName ===  "none" || date === "") {
      if(documentName === "none") document.getElementById("class-select").className += " txt-primary-error"
      else  document.getElementById("class-select").className = "txt-primary"

      if(date === "") document.getElementById("date-select").className += " txt-primary-error"
      else document.getElementById("date-select").className = "txt-primary"
    }
    else {
      console.log(documentName)
      setStart(true)
    }
  }

  if(!startGenerate) {
    return (
      <div className="window-primary max-w-2xl">
        <h2 className="text-center">Generate Document</h2>
        <div>
          <label>Document Type</label>
          <select 
            id="class-select"
            className="txt-primary"
            value={documentName}
            onChange={(props) => setDocumentName(props.target.value)}>
            <option value="none" disabled hidden>Select an Option</option>
            <option value="balanceSheet">Balance Sheet</option>
            <option value="trialBalance">Trial Balance</option>
          </select>
        </div>
        <div className="py-2">
          <label>Date</label>
          <input 
            id="date-select"
            type="date"
            className="txt-primary"
            value={date}
            onChange={(props) => setDate(props.target.value)}/>
        </div>
        <div className="flex justify-end">
          <button className="btn-primary" onClick={handleGenerate}>Generate</button>
        </div>
      </div>
    )
  }
  else {
    return (<DocumentWindow date={date} documentName={documentName}/>)
  }
}

function DocumentWindow(props) {
  const documentName = props.documentName;
  const date = props.date;
  const [resData, setData] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect((req, res) => {
    if (isLoading) {
      axios
        .get(`${backendPath}/documents/${documentName}/${date}`, config)
        .then((res) => {
          const { data } = res;
          setData(data);
          setLoading(false);
          console.log(resData)
        });
    }
  }, [date])

  if (!isLoading) {
    var document;
    if(documentName == "balanceSheet") document = (<BalanceSheet date={date} data={resData} />)
    else if (documentName == "trialBalance") document = (<TrialBalance date={date} data={resData} />)

    return (
      <div className="window-primary">
        <div className="flex justify-between">
          <button className="btn-primary btn-color-red" onClick={() => window.location.reload()}>Go Back</button>
          <PDFDownloadLink document={document} fileName="trialBalance.pdf" className="btn-primary">Download</PDFDownloadLink>
        </div>
        <PDFViewer className="pdf-window" height={700}>
          {document}
        </PDFViewer>
      </div>
    )
  }
  else {
    return (
      <div className="window-primary text-center">
        <p>Generating document...</p>
      </div>
    )
  }
}

export { DocumentHome }