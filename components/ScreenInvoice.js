import {Text, View, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import FontAwesome, {SolidIcons} from 'react-native-fontawesome';
import {
  setInvoiceClient,
  setInvoiceProfile,
  setCurrentInvoce,
  setInvoices,
  setCopyInvoice,
} from '../src/redux/actions';
import {useDispatch} from 'react-redux';
import SQLite from 'react-native-sqlite-storage';
import {useIsFocused} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {deleteInvoice, createTableInvoice} from './database';

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

  const {currUser} = useSelector(state => state.invoiceReducer);

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
      'select id, date_of_issue, due_date, taxable_supply, payed, payment_method, paid, client_id, profile_id, note, is_storno, invoice_number from invoice order by id desc',
      [],
    );

    var rows = selectQuery.rows;
    for (let i = 0; i < rows.length; i++) {
      let item = rows.item(i);
      //console.log(item);
      let Invoice = {
        id: item.id,
        date_of_issue: item.date_of_issue,
        due_date: item.due_date,
        taxable_supply: item.taxable_supply,
        payed: item.payed,
        payment_method: item.payment_method,
        paid: item.paid,
        client_id: item.client_id,
        profile_id: item.profile_id,
        note: item.note,
        is_storno: item.is_storno,
        invoice_number: item.invoice_number,
      };
      setInvoices(Invoices => [...Invoices, Invoice]);
    }
  };

  const copyInvoice = item => {
    let invoice = {
      id: -1,
      date_of_issue: item.date_of_issue,
      due_date: item.due_date,
      taxable_supply: item.taxable_supply,
      payed: item.payed,
      payment_method: item.payment_method,
      paid: item.paid,
      client_id: item.client_id,
      profile_id: item.profile_id,
      note: item.note,
      is_storno: item.is_storno,
      invoice_number: item.invoice_number,
    };
    dispatch(setInvoiceClient());
    dispatch(setInvoiceProfile());
    dispatch(setCurrentInvoce(invoice));
    dispatch(setCopyInvoice(item.id));
    navigation.navigate('Faktura');
  };

  useEffect(() => {
    createTableInvoice();
    getInvoice();
    if (isFocused) {
      //console.log('focus invoice list');
      console.log(currUser);
    }
  }, [isFocused]);

  return (
    <View style={styles.body}>
      <FlatList
        data={Invoices}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => {
              navigation.navigate('Faktura');
              dispatch(setInvoiceClient());
              dispatch(setInvoiceProfile());
              dispatch(setCurrentInvoce(item));
            }}>
            <View style={styles.rows}>
              <View style={styles.item_body}>
                <Text style={styles.text}>
                  ID faktury: {item.invoice_number}
                </Text>
                <Text style={styles.text}>
                  Datum vytvoření:{' '}
                  {new Date(item.date_of_issue).toLocaleDateString()}
                </Text>
                {item.is_storno === 1 ? (
                  <Text style={styles.text}> Tato faktura je stornovaná </Text>
                ) : null}
              </View>
              <TouchableOpacity
                style={styles.del_button}
                onPress={() => {
                  console.log('Copy invoice: ', item.id);
                  copyInvoice(item);
                }}>
                <FontAwesome
                  icon={SolidIcons.copy}
                  style={{fontSize: 20, color: 'blue'}}
                />
              </TouchableOpacity>
              {item.is_storno === 0 ? (
                <TouchableOpacity
                  style={styles.del_button}
                  onPress={() => {
                    console.log('Delete invoice: ', item.id);
                    deleteInvoice(item.id);
                    getInvoice();
                  }}>
                  <FontAwesome
                    icon={SolidIcons.trashAlt}
                    style={{fontSize: 20, color: 'red'}}
                  />
                </TouchableOpacity>
              ) : null}
            </View>
          </TouchableOpacity>
        )}
      />
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
    backgroundColor: '#292C33',
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
    marginVertical: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  rows: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  item_body: {
    flex: 1,
  },
  del_button: {
    color: 'red',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  text: {color: 'black', fontSize: 18, margin: 5, paddingHorizontal: 15},
});
