import { StyleSheet, Text, View, TextInput, Pressable, Alert, ScrollView, TouchableOpacity } from 'react-native'
import React, { useState} from 'react'
import SQLite from 'react-native-sqlite-storage'

export default function Invoice({navigation}) {

  const [profil, setProfil] = useState('profilTest');
  const [client, setClient] = useState('clientTest');
  const [cost, setCost] = useState(100);

  const saveInvoice = () => {
    console.log("Save");
    navigation.goBack();
  }

  const deleteInvoice = () => {
    console.log("Delete");
    navigation.goBack();
  }

  const clientList = () => {
    console.log("List client");
    navigation.navigate("Klienti");
  }

  const profilList = () => {
    console.log("Profil client");
    navigation.navigate("Profily");
  }

  const itemList = () => {
    console.log("Item client");
    navigation.navigate("Položky");
  }

  return (
    <View style={styles.body}>
    <ScrollView style={styles.body}>

      <View style={styles.body}>

        <TouchableOpacity 
          style={styles.item_body}
          onPress={profilList}
        >
          <View style={styles.rows}>
            <Text style={styles.text}>Od: </Text>
            <Text style={styles.text}>{profil}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.item_body}
          onPress={clientList}
        >
          <View style={styles.rows}>
            <Text style={styles.text}>Pro: </Text>
            <Text style={styles.text}>{client}</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.item_body}
          onPress={itemList}
        >
          <View style={styles.rows}>
            <Text style={styles.text}>Položky</Text>
            <Text style={styles.text_cost}>Cena: {cost}</Text>
          </View>
        </TouchableOpacity>

        </View>

    </ScrollView>

    <Pressable
      onPress={deleteInvoice}
      android_ripple={{ color: '#00000050' }}
      style={({ pressed }) => [
        { backgroundColor: pressed ? '#dddddd' : '#b00' },
        styles.button_delete
      ]}
    >
      <Text style={styles.buttonText}>
        Smazat
      </Text>
    </Pressable>

    <Pressable
      onPress={saveInvoice}
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
  )
}

const styles = StyleSheet.create({
  body :{
    flex:1
  },
  rows: {
    flexDirection:'row',
    alignItems: 'center'
  },
  item_body: {
    flex:1,
    margin:10,
    paddingHorizontal:15,

  },
  text: {

  },
  text_cost: {
    right:0,
    position: 'absolute',
  },
  button: {
    width: '45%',
    height: 50,
    alignItems: 'center',
    borderRadius: 5,
    margin: 10,
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 20,
    margin: 10,
    textAlign: 'center',
  },
  button_delete: {
    width: '45%',
    height: 50,
    alignItems: 'center',
    borderRadius: 5,
    margin: 10,
    position: 'absolute',
    left: 0,
    bottom: 0,
  }
})