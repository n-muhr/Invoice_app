import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import ScreenInvoice from './components/ScreenInvoice';
import ScreenClients from './components/ScreenClients';
import Invoice from './components/Invoice';
import ProductList from './components/ProductList';
import ClientList from './components/ClientList';
import ProfilList from './components/ProfilList';
import InvoicePreview from './components/InvoicePreview';
import ScreenProfile from './components/ScreenProfile';
import {createStackNavigator} from '@react-navigation/stack';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import AddClientScreen from './components/AddClientScreen';
import AddProfile from './components/AddProfile';
import FontAwesome, {SolidIcons, RegularIcons} from 'react-native-fontawesome';
import {Provider} from 'react-redux';
import {Store} from './src/redux/rootReducer';

const Tab = createMaterialBottomTabNavigator();

function BottomTabBar() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, size, color}) => {
          let iconName;
          if (route.name === 'Faktury') {
            iconName = SolidIcons.fileInvoice;
            size = focused ? 25 : 20;
            color = focused ? '#00F' : '#333';
          } else if (route.name === 'Klienti') {
            iconName = SolidIcons.user;
            size = focused ? 25 : 20;
            color = focused ? '#00f' : '#333';
          } else if (route.name === 'Profily') {
            iconName = SolidIcons.user;
            size = focused ? 25 : 20;
            color = focused ? '#00f' : '#333';
          }

          return (
            <FontAwesome
              style={{fontSize: size, color: 'black'}}
              icon={iconName}
            />
          );
        },
        tabBarOptions: {
          labelStyle: {fontSize: 16, fontWeight: 'bold'},
        },
      })}
      barStyle={{backgroundColor: '#FF8C00'}}>
      <Tab.Screen name="Faktury" component={ScreenInvoice} />
      <Tab.Screen name="Klienti" component={ScreenClients} />
      <Tab.Screen name="Profily" component={ScreenProfile} />
    </Tab.Navigator>
  );
}

const Root = createStackNavigator();

export default function App() {
  return (
    <Provider store={Store}>
      <NavigationContainer>
        <Root.Navigator
          screenOptions={{
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontSize: 18,
              fontWeight: 'bold',
            },
          }}>
          <Root.Screen name="My Invoices" component={BottomTabBar} />
          <Root.Screen name="Přidat klienta" component={AddClientScreen} />
          <Root.Screen name="Přidat profil" component={AddProfile} />
          <Root.Screen name="Faktura" component={Invoice} />
          <Root.Screen name="Položky" component={ProductList} />
          <Root.Screen name="Klienti" component={ClientList} />
          <Tab.Screen name="Profily" component={ProfilList} />
          <Tab.Screen name="Náhled" component={InvoicePreview} />
        </Root.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
