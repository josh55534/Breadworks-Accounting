import { Page, Text, View, Document } from '@react-pdf/renderer';

import { dStyles } from './document-styles/defaultStyles';
import { tableRow, tableHead, tableName, tableVal, body } from "./document-styles/pnlStyles.js";

function TD(props) {
  return (
    <View style={props.styling}>
      <Text style={dStyles.p}>{props.children}</Text>
    </View>
  )
};

function ProfitAndLoss(props) {
  const date = props.date;
  const rowID = props.data;

  return (
    <>
      <Document>
        <Page size="A4" style={dStyles.page}>
          <View style={dStyles.header}>
            <Text style={dStyles.h1}>Profit and Loss Statement</Text>
            <Text style={dStyles.h2}>As on {date}</Text>
          </View>
          <View style={body}>
            <View style={dStyles.table}>
              {rowID[0].map((d, index) => (
                <View style={(index === rowID[0].length - 1) ? tableHead : tableRow}>
                  <TD styling={tableName}>{d.name}</TD>
                  <TD styling={tableVal}>{d.balance}</TD>
                </View>
              ))}
            </View>
            
            <View style={dStyles.table}>
              {rowID[1].map((d, index) => (
                <View style={(index === rowID[1].length - 1) ? tableHead : tableRow}>
                  <TD styling={tableName}>{d.name}</TD>
                  <TD styling={tableVal}>{d.balance}</TD>
                </View>
              ))}
            </View>

            <View style={dStyles.table}>
              <View style={tableHead}>
                <TD styling={tableName}>{rowID[2].name}</TD>
                <TD styling={tableVal}>{rowID[2].balance}</TD>
              </View>
            </View>
          </View>
        </Page>
      </Document >
    </>
  )
}

export { ProfitAndLoss }