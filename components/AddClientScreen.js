import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
  ScrollView,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import SQLite from 'react-native-sqlite-storage';
import {useSelector} from 'react-redux';
import {XMLParser} from 'fast-xml-parser';
import FontAwesome, {SolidIcons} from 'react-native-fontawesome';

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

export default function AddClientScreen({navigation}) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [descriptive_number, setDescriptiveNumber] = useState('');
  const [city, setCity] = useState('');
  const [ico, setICO] = useState('');
  const [dic, setDIC] = useState('');
  const [description, setDescription] = useState('');

  const {currClient} = useSelector(state => state.clientReducer);
  const {currUser} = useSelector(state => state.invoiceReducer);

  const verifyAdd = () => {
    if (name.length == 0) {
      Alert.alert('Varování', 'Prosím zadejte jméno.');
    } else {
      if (currClient === undefined) {
        db.transaction(tx => {
          tx.executeSql(
            'insert into client(name, email, address, descriptive_number, city, ico, dic, description, user_id) values (?,?,?,?,?,?,?,?,?)',
            [
              name,
              email,
              address,
              descriptive_number,
              city,
              ico,
              dic,
              description,
              currUser.id,
            ],
          );
        });
        Alert.alert('Nový klient', 'Byl přidán nový klient.');
      } else {
        db.transaction(tx => {
          tx.executeSql(
            'update client set name = ?, email = ?, address = ?, descriptive_number = ?, city = ?, ico = ?, dic = ?, description = ? where id = ?',
            [
              name,
              email,
              address,
              descriptive_number,
              city,
              ico,
              dic,
              description,
              currClient.id,
            ],
          );
        });
        Alert.alert('Edit', 'Údaje byly uloženy.');
      }

      navigation.goBack();
    }
  };

  const setClient = () => {
    if (currClient === undefined) console.log('New client');
    else {
      console.log('Client: ' + currClient.id);
      setName(currClient.name);
      setEmail(currClient.email);
      setAddress(currClient.address);
      setDescriptiveNumber(currClient.descriptive_number);
      setCity(currClient.city);
      setICO(currClient.ico);
      setDIC(currClient.dic);
      setDescription(currClient.description);
    }
  };

  const getInfo = () => {
    if (ico.length > 0) {
      fetch('https://wwwinfo.mfcr.cz/cgi-bin/ares/darv_std.cgi?ico=' + ico)
        .then(response => response.text())
        .then(textResponse => {
          const parser = new XMLParser();
          let obj = parser.parse(textResponse);
          const data =
            obj['are:Ares_odpovedi']?.['are:Odpoved']?.['are:Zaznam'];
          const name = data['are:Obchodni_firma'];
          const address = data?.['are:Identifikace']?.['are:Adresa_ARES'];
          const city = address?.['dtt:Nazev_obce'];
          const street = address?.['dtt:Nazev_ulice'];
          const numb = address?.['dtt:Cislo_domovni'];
          const psc = address?.['dtt:PSC'];
          console.log(city, street, numb);
          setName(name);
          setCity(city);
          setAddress(street + ' ' + numb);
          setDescriptiveNumber(String(psc));
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      Alert.alert('Chybí IČO', 'Pro vyhledání zadejte IČO');
    }
  };

  useEffect(() => {
    setClient();
  }, []);

  return (
    <ScrollView style={styles.body}>
      <View style={styles.body}>
        <TextInput
          value={name}
          onChangeText={value => setName(value)}
          style={styles.input}
          placeholder="Název/Jméno"
        />
        <TextInput
          value={email}
          onChangeText={value => setEmail(value)}
          style={styles.input}
          placeholder="Email"
        />
        <TextInput
          value={address}
          onChangeText={value => setAddress(value)}
          style={styles.input}
          placeholder="Ulice"
        />
        <TextInput
          value={descriptive_number}
          onChangeText={value => setDescriptiveNumber(value)}
          style={styles.input}
          placeholder="PSC"
        />
        <TextInput
          value={city}
          onChangeText={value => setCity(value)}
          style={styles.input}
          placeholder="Město"
        />
        <View style={styles.rows}>
          <TextInput
            value={ico}
            onChangeText={value => setICO(value)}
            style={styles.inputSearch}
            placeholder="IČO"
          />
          <Pressable
            onPress={getInfo}
            android_ripple={{color: '#00000050'}}
            style={({pressed}) => [
              {backgroundColor: pressed ? '#4aafff' : '#fff'},
              styles.buttonSearch,
            ]}>
            <FontAwesome
              icon={SolidIcons.search}
              style={{fontSize: 15, color: 'black'}}
            />
          </Pressable>
        </View>
        <TextInput
          value={description}
          onChangeText={value => setDescription(value)}
          style={styles.input}
          placeholder="Poznámka"
          multiline
        />
        <Pressable
          onPress={verifyAdd}
          android_ripple={{color: '#00000050'}}
          style={({pressed}) => [
            {backgroundColor: pressed ? '#dddddd' : '#0b0'},
            styles.button,
          ]}>
          <Text style={styles.buttonText}>Uložit</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
  input: {
    width: '95%',
    //borderBottomWidth: 1,
    borderColor: '#555555',
    borderRadius: 25,
    backgroundColor: '#ffffff',
    textAlign: 'left',
    fontSize: 20,
    margin: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 20,
  },
  button: {
    width: '95%',
    height: 50,
    alignItems: 'center',
    borderRadius: 5,
    margin: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 20,
    margin: 10,
    textAlign: 'center',
  },
  inputSearch: {
    width: '75%',
    borderColor: '#555555',
    borderRadius: 25,
    backgroundColor: '#ffffff',
    textAlign: 'left',
    fontSize: 20,
    margin: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 20,
  },
  buttonSearch: {
    width: 40,
    height: 40,
    alignItems: 'center',
    borderRadius: 40,
    margin: 10,
    paddingVertical: 12,
    marginBottom: 20,
  },
  rows: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
