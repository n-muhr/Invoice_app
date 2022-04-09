import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
  ScrollView,
  Switch,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import SQLite from 'react-native-sqlite-storage';
import {useSelector} from 'react-redux';
import {XMLParser} from 'fast-xml-parser';

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

export default function AddProfile({navigation}) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [descriptive_number, setDesNum] = useState('');
  const [city, setCity] = useState('');
  const [pays_dph, setPaysDPH] = useState(false);
  const [ico, setIco] = useState('');
  const [dic, setDic] = useState('');
  const [description, setDescription] = useState('');

  const {currProfile} = useSelector(state => state.profileReducer);

  const verifyAdd = () => {
    if (name.length == 0) {
      Alert.alert('Varování', 'Prosím zadejte jméno.');
    } else {
      if (currProfile === undefined) {
        db.transaction(tx => {
          tx.executeSql(
            'insert into profile(name, email, address, descriptive_number, city, pays_dph, ico, dic, description) values (?,?,?,?,?,?,?,?,?)',
            [
              name,
              email,
              address,
              descriptive_number,
              city,
              pays_dph,
              ico,
              dic,
              description,
            ],
          );
        });
        Alert.alert('Nový Profil', 'Byl přidán nový profil.');
      } else {
        db.transaction(tx => {
          tx.executeSql(
            'update profile set name = ?, email = ?, address = ?, descriptive_number = ?, city = ?, pays_dph = ?, ico = ?, dic = ?, description = ? where id = ?',
            [
              name,
              email,
              address,
              descriptive_number,
              city,
              pays_dph,
              ico,
              dic,
              description,
              currProfile.id,
            ],
          );
        });
        Alert.alert('Edit', 'Údaje byly uloženy.');
      }

      navigation.goBack();
    }
  };

  const setProfile = () => {
    if (currProfile === undefined) console.log('New profile.');
    else {
      console.log('Profil: ' + currProfile.id);
      setName(currProfile.name);
      setEmail(currProfile.email);
      setAddress(currProfile.address);
      setDesNum(currProfile.descriptive_number);
      setCity(currProfile.city);
      setPaysDPH(currProfile.pays_dph);
      setIco(currProfile.ico);
      setDic(currProfile.dic);
      setDescription(currProfile.description);
    }
  };

  const getInfo = () => {
    //if (ico.length > 0) {
    fetch('https://wwwinfo.mfcr.cz/cgi-bin/ares/darv_std.cgi?ico=27074358')
      .then(response => response.text())
      .then(textResponse => {
        const parser = new XMLParser();
        let obj = parser.parse(textResponse);
        console.log(obj);
        const {Ares_odpovedi} = obj;
        console.log('response is ', Ares_odpovedi);
      })
      .catch(error => {
        console.log(error);
      });
    /* } else {
      alert('Chybí IČO', 'Pro vyhledání zadejte IČO');
    } */
  };

  useEffect(() => {
    setProfile();
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
          onChangeText={value => setDesNum(value)}
          style={styles.input}
          placeholder="Číslo popisné"
        />
        <TextInput
          value={city}
          onChangeText={value => setCity(value)}
          style={styles.input}
          placeholder="Město"
        />
        <View style={styles.rows}>
          <Text style={styles.text}>Plátce dph</Text>
          <Switch
            value={pays_dph}
            onValueChange={() => {
              setPaysDPH(previousState => !previousState);
            }}
            trackColor={{false: '#767577', true: '#81b0ff'}}
            thumbColor={pays_dph ? '#f5dd4b' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
          />
        </View>
        <View style={styles.rows}>
          <TextInput
            value={ico}
            onChangeText={value => setIco(value)}
            style={styles.inputSearch}
            placeholder="IČO"
          />
          <Pressable
            onPress={getInfo}
            android_ripple={{color: '#00000050'}}
            style={({pressed}) => [
              {backgroundColor: pressed ? '#dddddd' : '#0bf'},
              styles.buttonSearch,
            ]}>
            <Text>Vyhledat</Text>
          </Pressable>
        </View>
        <TextInput
          value={dic}
          onChangeText={value => setDic(value)}
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
  inputSearch: {
    width: '75%',
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
  buttonSearch: {
    width: '10%',
    height: '50%',
    alignItems: 'center',
    borderRadius: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 20,
    margin: 10,
    textAlign: 'center',
  },
  rows: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    color: '#000',
    paddingHorizontal: 10,
    fontSize: 20,
    margin: 5,
  },
});
