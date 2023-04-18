import { Page, Text, View, Document } from '@react-pdf/renderer';

import { useState } from 'react';
import { StyleSheet } from "@react-pdf/renderer";

import { dStyles } from './document-styles/defaultStyles';
import {tableRow, tableHead, tableName, tableVal} from "./document-styles/tbStyles.js";


function TR(props) {
  (
    <View style={tableRow}>
      {props.children}
    </View>
  )
};

function TD(props) {
  return (
    <View style={props.styling}>
      <Text style={dStyles.p}>{props.children}</Text>
    </View>
  )
};

function TrialBalance() {
  const [date, setDate] = useState("today");


  return (
    <Document>
      <Page size="A4" style={dStyles.page}>
        <View style={dStyles.header}>
          <Text style={dStyles.h1}>Trial Balance Sheet</Text>
          <Text style={dStyles.h2}>Generated on {date}</Text>
        </View>
        <View style={dStyles.body}>
          <View style={dStyles.table}>
            <View style={tableHead}>
              <TD styling={tableName}>Account Name</TD>
              <TD styling={tableVal}>Debit</TD>
              <TD styling={tableVal}>Credit</TD>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  )
}

export { TrialBalance }