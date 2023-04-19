import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import React from "react";
import { TrialBalance } from "./trialBalance";

function DocumentHome() {

    const document = (<TrialBalance />);
    return (
        <div className="window-primary">
            <PDFDownloadLink document={document} fileName="trialBalance.pdf" className="btn-primary">Download</PDFDownloadLink>
            <PDFViewer className="pdf-window" height={700}>
                {document}
            </PDFViewer>
        </div>
    )
}

export { DocumentHome }