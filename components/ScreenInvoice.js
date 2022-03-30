import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import FontAwesome, {SolidIcons} from 'react-native-fontawesome';
import {setInvoiceClient, setInvoiceProfile} from '../src/redux/actions';
import {useDispatch} from 'react-redux';

function ScreenAll({navigation}) {
  const dispatch = useDispatch();
  return (
    <View style={styles.body}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.navigate('Faktura');
          dispatch(setInvoiceClient());
          dispatch(setInvoiceProfile());
        }}>
        <FontAwesome
          style={{fontSize: 20, color: 'white'}}
          icon={SolidIcons.plus}
        />
      </TouchableOpacity>
    </View>
  );
}

function ScreenPaid() {
  return (
    <View style={styles.body}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.navigate('Faktura');
        }}>
        <FontAwesome
          style={{fontSize: 20, color: 'white'}}
          icon={SolidIcons.plus}
        />
      </TouchableOpacity>
    </View>
  );
}

function ScreenNotPaid() {
  return (
    <View style={styles.body}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.navigate('Faktura');
        }}>
        <FontAwesome
          style={{fontSize: 20, color: 'white'}}
          icon={SolidIcons.plus}
        />
      </TouchableOpacity>
    </View>
  );
}

export default function ScreenInvoice({navigation}) {
  const dispatch = useDispatch();
  return (
    <View style={styles.body}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.navigate('Faktura');
          dispatch(setInvoiceClient());
        }}>
        <FontAwesome
          style={{fontSize: 20, color: 'white'}}
          icon={SolidIcons.plus}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
  button: {
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: '#00f',
    position: 'absolute',
    bottom: 10,
    right: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {
    justifyContent: 'center',
    marginHorizontal: 15,
    marginVertical: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
});
