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

  const verifyAdd = () => {
    if (name.length == 0) {
      Alert.alert('Varování', 'Prosím zadejte jméno.');
    } else {
      if (currClient === undefined) {
        db.transaction(tx => {
          tx.executeSql(
            'insert into client(name, email, address, descriptive_number, city, ico, dic, description) values (?,?,?,?,?,?,?,?)',
            [
              name,
              email,
              address,
              descriptive_number,
              city,
              ico,
              dic,
              description,
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
          placeholder="Číslo popisné"
        />
        <TextInput
          value={city}
          onChangeText={value => setCity(value)}
          style={styles.input}
          placeholder="Město"
        />
        <TextInput
          value={ico}
          onChangeText={value => setICO(value)}
          style={styles.input}
          placeholder="IČO"
        />
        <TextInput
          value={dic}
          onChangeText={value => setDIC(value)}
          style={styles.input}
          placeholder="DIČ"
        />
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
    borderWidth: 1,
    borderColor: '#555555',
    borderRadius: 10,
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
});
