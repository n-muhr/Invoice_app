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
import FontAwesome, {SolidIcons, RegularIcons} from 'react-native-fontawesome';

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

  const [section, setSection] = useState('');
  const [part, setPart] = useState('');
  const [court, setCourt] = useState('');
  const [account, setAccount] = useState('');

  const {currProfile} = useSelector(state => state.profileReducer);

  const verifyAdd = () => {
    if (name.length == 0) {
      Alert.alert('Varování', 'Prosím zadejte jméno.');
    } else {
      if (currProfile === undefined) {
        db.transaction(tx => {
          tx.executeSql(
            'insert into profile(name, email, address, descriptive_number, city, pays_dph, ico, dic, description, account, court, section, part) values (?,?,?,?,?,?,?,?,?,?,?,?,?)',
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
              account,
              court,
              section,
              part,
            ],
          );
        });
        Alert.alert('Nový Profil', 'Byl přidán nový profil.');
      } else {
        db.transaction(tx => {
          tx.executeSql(
            'update profile set name = ?, email = ?, address = ?, descriptive_number = ?, city = ?, pays_dph = ?, ico = ?, dic = ?, description = ?, account =?, court = ?, section = ?, part = ? where id = ?',
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
              account,
              court,
              section,
              part,
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
    if (ico.length > 0) {
      fetch('https://wwwinfo.mfcr.cz/cgi-bin/ares/darv_bas.cgi?ico=' + ico)
        .then(response => response.text())
        .then(textResponse => {
          const parser = new XMLParser();
          let obj = parser.parse(textResponse);
          const data = obj['are:Ares_odpovedi']?.['are:Odpoved']?.['D:VBAS'];
          const name = data['D:OF'];
          const dic = data['D:DIC'];
          const city = data['D:AA']?.['D:N'];
          const street = data['D:AD']?.['D:UC'];
          const psc = data['D:AA']?.['D:PSC'];
          let court = data['D:ROR']?.['D:SZ']?.['D:SD']?.['D:T'];
          const section = data['D:ROR']?.['D:SZ']?.['D:OV'];

          if (court === undefined) {
            court = data['D:RRZ']?.['D:ZU']?.['D:NZU'];
          }

          if (dic !== undefined) {
            setDic(dic);
            setPaysDPH(true);
          } else {
            setDic('');
            setPaysDPH(false);
          }

          setName(name);
          setCity(city);
          setAddress(street);
          setDesNum(String(psc));
          if (court !== undefined) setCourt(court);
          if (section !== undefined) setSection(section.charAt(0));
          if (part !== undefined) setPart(section.substring(2));
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      Alert.alert('Chybí IČO', 'Pro vyhledání zadejte IČO');
    }
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
          placeholder="PSC"
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
            trackColor={{false: '#aaa', true: '#3e3e3e'}}
            thumbColor={pays_dph ? '#4aafff' : '#f4f3f4'}
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
          value={dic}
          onChangeText={value => setDic(value)}
          style={styles.input}
          placeholder="DIČ"
        />
        <TextInput
          value={court}
          onChangeText={value => setCourt(value)}
          style={styles.input}
          placeholder="Zapsán u soudu"
        />
        <TextInput
          value={section}
          onChangeText={value => setSection(value)}
          style={styles.input}
          placeholder="Oddíl"
        />
        <TextInput
          value={part}
          onChangeText={value => setPart(value)}
          style={styles.input}
          placeholder="Složka"
        />
        <TextInput
          value={account}
          onChangeText={value => setAccount(value)}
          style={styles.input}
          placeholder="Bankovní účet"
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
  inputSearch: {
    width: '75%',
    //borderWidth: 1,
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
  buttonSearch: {
    width: 40,
    height: 40,
    alignItems: 'center',
    borderRadius: 40,
    margin: 10,
    paddingVertical: 12,
    marginBottom: 20,
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
