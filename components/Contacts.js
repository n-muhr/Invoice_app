import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import ScreenClients from './ScreenClients';
import ScreenProfile from './ScreenProfile';

const Tab = createMaterialTopTabNavigator();

export default function Contacts() {
  return (
    <Tab.Navigator initialRouteName="Dodavatelé">
      <Tab.Screen name="Dodavatelé" component={ScreenProfile} />
      <Tab.Screen name="Odběratelé" component={ScreenClients} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({});
