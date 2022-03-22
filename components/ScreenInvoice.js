import { Text, View, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs'
import { NavigationContainer } from '@react-navigation/native';
import FontAwesome, {
  SolidIcons,
  RegularIcons
} from 'react-native-fontawesome';

function ScreenAll({navigation}){
  return(
    <View style={styles.body}>
      <TouchableOpacity style={styles.button} onPress={() => {
        navigation.navigate('Faktura');
        }}>
        <FontAwesome
          style={{fontSize:20, color:'white'}}
          icon={SolidIcons.plus}
        />

      </TouchableOpacity>
    </View>
  );
}

function ScreenPaid(){
  return(
    <View style={styles.body}>
      <TouchableOpacity style={styles.button} onPress={() => {
        navigation.navigate('Faktura');
        }}>
        <FontAwesome
          style={{fontSize:20, color:'white'}}
          icon={SolidIcons.plus}
        />

      </TouchableOpacity>
    </View>
    );
}

function ScreenNotPaid(){
  return(
    <View style={styles.body}>
      <TouchableOpacity style={styles.button} onPress={() => {
        navigation.navigate('Faktura');
        }}>
        <FontAwesome
          style={{fontSize:20, color:'white'}}
          icon={SolidIcons.plus}
        />

      </TouchableOpacity>
    </View>
    );
}


const Tab = createMaterialTopTabNavigator();

export default function ScreenInvoice() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarOptions:{
          labelStyle: { fontSize:16, fontWeight:'bold'}
        }
      })
      }
      >
        <Tab.Screen 
          name="Vše"
          component={ScreenAll}
        />
         <Tab.Screen 
          name="Zaplacené"
          component={ScreenPaid}
        /> 
        <Tab.Screen 
          name="Nezaplacené"
          component={ScreenNotPaid}
        /> 
        
      </Tab.Navigator>
  )
}

const styles = StyleSheet.create({
  body:{
    flex:1
  },
  button: {
    width:50,
    height:50,
    borderRadius:30,
    backgroundColor: '#00f',
    position: 'absolute',
    bottom: 10,
    right: 10,
    alignItems:"center",
    justifyContent: 'center'
  },
  item:{
    justifyContent: 'center',
    marginHorizontal:15,
    marginVertical:20,
    backgroundColor: '#fff',
    borderRadius:10

  }
});