import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import FontAwesome, {SolidIcons} from 'react-native-fontawesome';
import {
  setInvoiceClient,
  setInvoiceProfile,
  setCurrentInvoce,
  setInvoices,
} from '../src/redux/actions';
import {useDispatch} from 'react-redux';
import SQLite from 'react-native-sqlite-storage';
import {useIsFocused} from '@react-navigation/native';
import {useSelector} from 'react-redux';

//otevreni databaze InvoiceDB
const db = SQLite.openDatabase(
  {
    name: 'InvoiceDB',
    location: 'default',
  },
  () => {},
  error => {
    console.log(error);
  },
);

export default function ScreenInvoice({navigation}) {
  const dispatch = useDispatch();

  const isFocused = useIsFocused();

  const [Invoices, setInvoices] = useState([]);

  const {invoiceList} = useSelector(state => state.invoiceReducer);

  //vytvoreni table invoice pokud neexistuje
  const createTable = () => {
    db.transaction(txn => {
      txn.executeSql(
        'Create table if not exists invoice(id INTEGER PRIMARY KEY AUTOINCREMENT, date_of_issue VARCHAR(10), due_date VARCHAR(10), taxable_supply VARCHAR(10), total_cost decimal(10,5), payment_method VARCHAR(20), client_id integer, profile_id integer)',
      );
    });
  };

  //funkce pro provedeni sql query
  const ExecuteQuery = (sql, params = []) =>
    new Promise((resolve, reject) => {
      db.transaction(trans => {
        trans.executeSql(
          sql,
          params,
          (trans, results) => {
            resolve(results);
          },
          error => {
            reject(error);
          },
        );
      });
    });

  const getInvoice = async () => {
    setInvoices([]);

    let selectQuery = await ExecuteQuery(
      'select id, date_of_issue, due_date, taxable_supply, total_cost, payment_method, client_id, profile_id from invoice',
      [],
    );

    var rows = selectQuery.rows;
    for (let i = 0; i < rows.length; i++) {
      let item = rows.item(i);
      console.log(item);
      let Invoice = {
        id: item.id,
        date_of_issue: item.date_of_issue,
        due_date: item.due_date,
        taxable_supply: item.taxable_supply,
        total_cost: item.total_cost,
        payment_method: item.payment_method,
        client_id: item.client_id,
        profile_id: item.profile_id,
      };
      setInvoices(Invoices => [...Invoices, Invoice]);
      dispatch(setInvoices(Invoices));
    }
  };

  const updateInvoice = () => {
    setInvoices(invoiceList);
  };

  useEffect(() => {
    createTable();
    getInvoice();
    if (isFocused) {
      console.log('focus invoice list');
      updateInvoice();
    }
  }, [isFocused]);

  return (
    <View style={styles.body}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.navigate('Faktura');
          dispatch(setInvoiceClient());
          dispatch(setInvoiceProfile());
          dispatch(setCurrentInvoce());
        }}>
        <FontAwesome
          style={{fontSize: 20, color: 'white'}}
          icon={SolidIcons.plus}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
  button: {
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: '#00f',
    position: 'absolute',
    bottom: 10,
    right: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {
    justifyContent: 'center',
    marginHorizontal: 15,
    marginVertical: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
});
