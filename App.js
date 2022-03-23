import React, {Component} from 'react';
import { View, Text, StyleSheet } from "react-native";
import ScreenInvoice from "./components/ScreenInvoice"
import ScreenClients from "./components/ScreenClients"
import Invoice from "./components/Invoice"
import ProductList from "./components/ProductList"
import ClientList from "./components/ClientList"
import ProfilList from "./components/ProfilList"
import { createStackNavigator } from '@react-navigation/stack';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs'
import { NavigationContainer } from '@react-navigation/native';
import AddClientScreen from './components/AddClientScreen'
import FontAwesome, {
  SolidIcons,
  RegularIcons
} from 'react-native-fontawesome';


const Tab = createMaterialBottomTabNavigator();


function BottomTabBar(){
  return(
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({ focused, size, color }) => {
          let iconName;
          if(route.name === 'Faktury'){
            iconName = SolidIcons.fileInvoice;
            size=focused?25:20;
            color=focused?'#00F' : '#333'
          }else if(route.name === 'Klienti'){
            iconName = SolidIcons.user;
            size=focused?25:20;
            color=focused?'#00f' : '#333'
          }
          return(
            <FontAwesome
            style={{fontSize:size, color:'black'}}
            icon={iconName}
            />
          )
        },
        tabBarOptions:{
          labelStyle: { fontSize:16, fontWeight:'bold'}
        }
        })
        }
        
        barStyle={{ backgroundColor:'#FF8C00'}}
      >
        <Tab.Screen 
          name="Faktury"
          component={ScreenInvoice}
        />
        <Tab.Screen 
          name="Klienti"
          component={ScreenClients}
        /> 
        
      </Tab.Navigator>
  );
}


const Root = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Root.Navigator
        screenOptions={{
          headerTitleAlign:'center',
          headerTitleStyle:{
            fontSize:18, fontWeight:'bold'
          }
        }}
        
      >
        <Root.Screen
          name="My Invoices"
          component={BottomTabBar}
        />
        <Root.Screen
          name="Add client"
          component={AddClientScreen}
        />
        <Root.Screen
          name="Faktura"
          component={Invoice}
        />
        <Root.Screen
          name="Položky"
          component={ProductList}
        />
        <Root.Screen
          name="Klienti"
          component={ClientList}
        />
        <Tab.Screen 
          name="Profily"
          component={ProfilList}
        /> 

      </Root.Navigator>

    </NavigationContainer>
  );
}