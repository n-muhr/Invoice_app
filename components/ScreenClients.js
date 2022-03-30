import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import SQLite from 'react-native-sqlite-storage';
import FontAwesome, {SolidIcons, RegularIcons} from 'react-native-fontawesome';
import {useIsFocused} from '@react-navigation/native';
import {setCurrentClient} from '../src/redux/actions';
import {useDispatch} from 'react-redux';

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

export default function ScreenClients({navigation}) {
  const [Profiles, setProfiles] = useState([]);

  const dispatch = useDispatch();

  //vytvoreni table clients pokud neexistuje
  const createTable = () => {
    db.transaction(txn => {
      txn.executeSql(
        'Create table if not exists clients(id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(30), email VARCHAR(30), phone VARCHAR(9), address VARCHAR(30), description TEXT)',
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

  //asynchronni funkce pro nacteni klientu z tabulky clients z databaze
  const getClient = async () => {
    setProfiles([]);

    let selectQuery = await ExecuteQuery(
      'select id, name, email, phone, address, description from clients',
      [],
    );

    var rows = selectQuery.rows;
    for (let i = 0; i < rows.length; i++) {
      let item = rows.item(i);
      console.log(item);
      let Client = {
        id: item.id,
        name: item.name,
        email: item.email,
        phone: item.phone,
        address: item.address,
        description: item.description,
      };
      //let newProfiles = [...Profiles, Client];
      setProfiles(Profiles => [...Profiles, Client]);
    }
  };

  //smazani klienta z databaze podle id
  const delClient = async id => {
    await ExecuteQuery('delete from clients where id = ?', [id]);
  };

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      createTable();
      getClient();
    }
  }, [isFocused]);

  return (
    <View style={styles.body}>
      <FlatList
        data={Profiles}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => {
              dispatch(setCurrentClient(item));
              navigation.navigate('Přidat klienta');
            }}>
            <View style={styles.rows}>
              <View style={styles.item_body}>
                <Text style={styles.title}>{item.name}</Text>
                <Text style={styles.description}>{item.description}</Text>
              </View>
              <TouchableOpacity
                style={styles.del_button}
                onPress={() => {
                  delClient(item.id);
                  getClient();
                }}>
                <FontAwesome
                  icon={SolidIcons.trashAlt}
                  style={{fontSize: 20, color: 'red'}}
                />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          dispatch(setCurrentClient());
          navigation.navigate('Přidat klienta');
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
    marginVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  title: {
    fontSize: 25,
    margin: 10,
    paddingHorizontal: 10,
  },
  description: {
    fontSize: 18,
    color: '#999',
    margin: 5,
    paddingHorizontal: 10,
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
});
