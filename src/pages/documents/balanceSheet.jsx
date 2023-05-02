import { Page, Text, View, Document } from '@react-pdf/renderer';

import { dStyles } from './document-styles/defaultStyles';
import { tableRow, tableHead, tableName, tableVal, tableAlign, rowAlign, body } from "./document-styles/bsStyles.js";

function TD(props) {
  return (
    <View style={props.styling}>
      <Text style={dStyles.p}>{props.children}</Text>
    </View>
  )
};

function BalanceSheet(props) {
  const date = props.date;
  const rowID = props.data;

  return (
    <>
      <Document>
        <Page size="A4" style={dStyles.page}>
          <View style={dStyles.header}>
            <Text style={dStyles.h1}>Balance Sheet</Text>
            <Text style={dStyles.h2}>As on {date}</Text>
          </View>
          <View style={body}>
            <View style={dStyles.table}>
              <View style={rowAlign}>
                <View style={tableAlign}>

                  <Text style={dStyles.h3}>Assets</Text>
                  <View style={dStyles.table}>
                    <View style={tableHead}>
                      <TD styling={tableName}>Account Name</TD>
                      <TD styling={tableVal}>Balance</TD>
                    </View>
                    {rowID[0].map((d, index) => (
                      <View style={(index === rowID[0].length - 1) ? tableHead : tableRow}>
                        <TD styling={tableName}>{d.name}</TD>
                        <TD styling={tableVal}>{d.balance}</TD>
                      </View>
                    ))}
                  </View>
                </View>

                <View style={tableAlign}>

                  <Text style={dStyles.h3}>Liabilities</Text>
                  <View style={dStyles.table}>
                    <View style={tableHead}>
                      <TD styling={tableName}>Account Name</TD>
                      <TD styling={tableVal}>Balance</TD>
                    </View>
                    {rowID[1].map((d, index) => (
                      <View style={(index === rowID[1].length - 1) ? tableHead : tableRow}>
                        <TD styling={tableName}>{d.name}</TD>
                        <TD styling={tableVal}>{d.balance}</TD>
                      </View>
                    ))}
                  </View>

                  <Text style={dStyles.h3}>Equity</Text>
                  <View style={dStyles.table}>
                    <View style={tableHead}>
                      <TD styling={tableName}>Account Name</TD>
                      <TD styling={tableVal}>Balance</TD>
                    </View>
                    {rowID[2].map((d, index) => (
                      <View style={(index === rowID[2].length - 1) ? tableHead : tableRow}>
                        <TD styling={tableName}>{d.name}</TD>
                        <TD styling={tableVal}>{d.balance}</TD>
                      </View>
                    ))}
                  </View>

                  <View style={dStyles.table}>
                    <View style={tableHead}>
                      <TD styling={tableName}>{rowID[3].name}</TD>
                      <TD styling={tableVal}>{rowID[3].balance}</TD>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </Page>
      </Document>
    </>
  )
}

export { BalanceSheet }