import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {
  Table,
  TableWrapper,
  Row,
  Rows,
  Col,
  Cols,
  Cell,
} from 'react-native-table-component';

export default function TableData({tableHead, tableTitle, tableData}) {
  return (
    <View>
      <View style={styles.container}>
        <Table borderStyle={{borderWidth: 1}}>
          <Row data={tableHead} flexArr={[1, 1, 1, 1]} style={styles.head} />
          {/* Řádky s daty */}
          <TableWrapper style={styles.wrapper}>
            <Col data={tableTitle} style={styles.title} heightArr={[28, 28]} />
            <Rows data={tableData} flexArr={[1, 1, 1]} style={styles.row} />
          </TableWrapper>
        </Table>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 1,
    margin: 5,
    marginVertical: 10,
    backgroundColor: '#fff',
  },
  head: {height: 40, backgroundColor: '#80BEF3'},
  wrapper: {flexDirection: 'row'},
  title: {flex: 1, backgroundColor: '#B4DDFF'},
  row: {
    height: 28,
  },
  text: {textAlign: 'center'},
  header: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    margin: 5,
  },
});
