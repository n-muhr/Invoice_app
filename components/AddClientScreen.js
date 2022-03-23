import { View, Text, StyleSheet, TextInput, Pressable, Alert, ScrollView  } from 'react-native'
import React, { useState } from 'react'
import SQLite from 'react-native-sqlite-storage'

const db = SQLite.openDatabase({
  name:'InvoiceDB',
  location: 'default'
  },
  () => {},
  error => {console.log(error);}
)

export default function AddClientScreen({navigation}) {

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');

  

  const verifyAdd = () => {
    if(name.length == 0){
      Alert.alert('Varování', 'Prosím zadejte jméno.')
    }else{
      db.transaction((tx) =>{
        tx.executeSql("insert into clients(name,email,phone,address,description) values (?,?,?,?,?)", [name, email, phone, address, description]);
      })


      Alert.alert('Nový klient', 'Byl přidán nový klient.')
      navigation.goBack()
    }
  }


  return (
    <ScrollView style={styles.body}>
      <View style={styles.body}>
        <TextInput
          value={name}
          onChangeText={(value) => setName(value)}
          style={styles.input}
          placeholder='Název/Jméno'
        />
        <TextInput
          value={email}
          onChangeText={(value) => setEmail(value)}
          style={styles.input}
          placeholder='Email'
        />
        <TextInput
          value={phone}
          onChangeText={(value) => setPhone(value)}
          style={styles.input}
          placeholder='Phone'
        />
        <TextInput
          value={address}
          onChangeText={(value) => setAddress(value)}
          style={styles.input}
          placeholder='Adresa'
        />
        <TextInput
          value={description}
          onChangeText={(value) => setDescription(value)}
          style={styles.input}
          placeholder='Poznámka'
          multiline
        />
        <Pressable
              onPress={verifyAdd}
              android_ripple={{ color: '#00000050' }}
              style={({ pressed }) => [
                  { backgroundColor: pressed ? '#dddddd' : '#0b0' },
                  styles.button
              ]}
          >
              <Text style={styles.buttonText}>
                  Uložit
              </Text>
          </Pressable>

      </View>
    </ScrollView>
  )
}


const styles = StyleSheet.create({
  body :{
    flex:1
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
    marginBottom:20
  },
  button: {
    width: '95%',
    height: 50,
    alignItems: 'center',
    borderRadius: 5,
    margin: 10,
    //position: 'absolute',
    //bottom: 10
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 20,
    margin: 10,
    textAlign: 'center',
  },
})