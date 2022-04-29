import {StyleSheet, Text, View, TouchableOpacity, FlatList} from 'react-native';
import React, {useState, useEffect} from 'react';
import SQLite from 'react-native-sqlite-storage';
import FontAwesome, {SolidIcons} from 'react-native-fontawesome';
import {useIsFocused} from '@react-navigation/native';
import {setInvoiceProfile, setCurrentProfile} from '../../src/redux/actions';
import {useDispatch} from 'react-redux';
import {createTableProfile} from '../../src/database/database';
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

export default function ProfileList({navigation}) {
  const [Profiles, setProfiles] = useState([]);

  const dispatch = useDispatch();

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

  //asynchronni funkce pro nacteni klientu z tabulky clients z databaze
  const getProfile = async () => {
    setProfiles([]);

    let selectQuery = await ExecuteQuery(
      'select id, name, email, address, descriptive_number, city, pays_dph, ico, dic, description from profile where user_id = ?',
      [currUser.id],
    );

    var rows = selectQuery.rows;
    for (let i = 0; i < rows.length; i++) {
      let item = rows.item(i);
      console.log(item);
      let Profile = {
        id: item.id,
        name: item.name,
        email: item.email,
        address: item.address,
        descriptive_number: item.descriptive_number,
        city: item.city,
        pays_dph: item.pays_dph,
        ico: item.ico,
        dic: item.dic,
        description: item.description,
      };
      setProfiles(Profiles => [...Profiles, Profile]);
    }
  };

  const isFocused = useIsFocused();

  useEffect(() => {
    createTableProfile();
    if (isFocused) {
      getProfile();
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
              navigation.goBack();
              dispatch(setInvoiceProfile(item.id));
            }}>
            <View style={styles.item_body}>
              <Text style={styles.title}>{item.name}</Text>
              {item.description.length === 0 ? null : (
                <Text style={styles.description}>{item.description}</Text>
              )}
            </View>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.navigate('Přidat profil');
          dispatch(setCurrentProfile());
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
  },
  title: {
    fontSize: 25,
    margin: 10,
    color: '#fff',
  },
  description: {
    fontSize: 18,
    color: '#999',
    margin: 5,
    paddingHorizontal: 10,
  },
  item_body: {
    flex: 1,
    borderColor: '#000',
    borderBottomWidth: 2,
  },
});
