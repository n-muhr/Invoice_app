import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import ScreenInvoice from './components/screens/ScreenInvoice';
import ScreenClients from './components/screens/ScreenClients';
import Invoice from './components/screens/Invoice';
import ProductList from './components/screens/ProductList';
import ClientList from './components/screens/ClientList';
import ProfilList from './components/screens/ProfilList';
import InvoicePreview from './components/screens/InvoicePreview';
import ScreenProfile from './components/screens/ScreenProfile';
import Stats from './components/screens/Stats';
import Login from './components/user/Login';
import Contacts from './components/navigation/Contacts';
import Register from './components/user/Register';
import {createStackNavigator} from '@react-navigation/stack';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import AddClientScreen from './components/screens/AddClientScreen';
import AddProfile from './components/screens/AddProfile';
import FontAwesome, {SolidIcons, RegularIcons} from 'react-native-fontawesome';
import {Provider} from 'react-redux';
import {Store} from './src/redux/rootReducer';
import {createDrawerNavigator} from '@react-navigation/drawer';
//import BottomTabBar from './components/navigation/BottomTabBar';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

const Tab = createMaterialBottomTabNavigator();

function BottomTabBar() {
  return (
    <Tab.Navigator
      /* screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 20,
          left: 15,
          right: 15,
          elevation: 0,
          backgroundColor: '#fff',
          borderRadius: 15,
          height: 70,
        },
      }} */
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, size, color}) => {
          let iconName;
          if (route.name === 'Faktury') {
            iconName = SolidIcons.fileInvoice;
            size = focused ? 25 : 20;
            color = focused ? '#00F' : '#333';
          } else if (route.name === 'Statistika') {
            iconName = SolidIcons.chartBar;
            size = focused ? 25 : 20;
            color = focused ? '#00f' : '#333';
          } else if (route.name === 'Kontakty') {
            iconName = SolidIcons.user;
            size = focused ? 25 : 20;
            color = focused ? '#00f' : '#333';
          }
          /* else if (route.name === 'Klienti') {
            iconName = SolidIcons.user;
            size = focused ? 25 : 20;
            color = focused ? '#00f' : '#333';
          } else if (route.name === 'Profily') {
            iconName = SolidIcons.user;
            size = focused ? 25 : 20;
            color = focused ? '#00f' : '#333';
          } */

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
      <Tab.Screen name="Statistika" component={Stats} />
      <Tab.Screen name="Kontakty" component={Contacts} />
      {/* <Tab.Screen name="Klienti" component={ScreenClients} />
      <Tab.Screen name="Profily" component={ScreenProfile} /> */}
    </Tab.Navigator>
  );
}

//const Drawer = createDrawerNavigator();

const Root = createStackNavigator();

export default function App() {
  return (
    <Provider store={Store}>
      <NavigationContainer>
        <Root.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerTitleAlign: 'center',
            headerShown: false,
            headerTitleStyle: {
              fontSize: 18,
              fontWeight: 'bold',
            },
          }}>
          <Root.Screen name="Login" component={Login} />
          <Root.Screen name="Registrace" component={Register} />
          <Root.Screen name="Moje faktury" component={BottomTabBar} />
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
