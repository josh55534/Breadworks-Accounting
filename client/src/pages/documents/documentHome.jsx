import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import React from "react";
import { TrialBalance } from "./trialBalance";

function DocumentHome() {
    return (
        <div className="window-primary">
            <PDFDownloadLink document={<TrialBalance/>} fileName="trialBalance.pdf" className="btn-primary">Download</PDFDownloadLink>
            <PDFViewer className="pdf-window" height={700}>
                <TrialBalance />
            </PDFViewer>
        </div>
    )
}

export { DocumentHome }