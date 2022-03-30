import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Alert,
  ScrollView,
  TouchableOpacity,
  Switch,
  Button,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import SQLite from 'react-native-sqlite-storage';
import {useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import DatePicker from 'react-native-date-picker';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

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

export default function Invoice({navigation}) {
  const [profil, setProfile] = useState('');
  const [client, setClient] = useState('');
  const [cost, setCost] = useState(0);

  const [isEnabled, setIsEnabled] = useState(false);

  const [dueDate, setDueDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  const [taxableDate, setTaxableDate] = useState(new Date());
  const [openTaxable, setOpenTaxable] = useState(false);

  const {invoiceClient, invoiceProfile, currInvoice} = useSelector(
    state => state.invoiceReducer,
  );

  const isFocused = useIsFocused();

  const InvoiceDetail = () => {
    return (
      <View style={styles.body}>
        <ScrollView style={styles.body}>
          <View style={styles.body}>
            <TouchableOpacity style={styles.item_body} onPress={profilList}>
              <View style={styles.rows}>
                <Text style={styles.text}>Dodavatel: </Text>
                <Text style={styles.text}>{profil}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.item_body} onPress={clientList}>
              <View style={styles.rows}>
                <Text style={styles.text}>Odběratel: </Text>
                <Text style={styles.text}>{client}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.item_body} onPress={itemList}>
              <View style={styles.rows}>
                <Text style={styles.text}>Položky</Text>
                <Text style={styles.text_cost}>Cena: {cost}</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.item_body}>
              <View style={styles.rows}>
                <Text style={styles.text}>Je zaplacená</Text>
                <Switch
                  value={isEnabled}
                  onValueChange={() => {
                    setIsEnabled(previousState => !previousState);
                  }}
                  trackColor={{false: '#767577', true: '#81b0ff'}}
                  thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
                  ios_backgroundColor="#3e3e3e"
                />
              </View>
            </View>
            <TouchableOpacity
              style={styles.item_body}
              onPress={() => setOpen(true)}>
              <View>
                <Text style={styles.text}>
                  Datum splatnosti: {dueDate.toString().split(' ')[2]}
                  {'.'}
                  {getMonth(dueDate.toString().split(' ')[1])}
                  {'.'}
                  {dueDate.toString().split(' ')[3]}
                </Text>
              </View>
            </TouchableOpacity>
            <DatePicker
              modal
              open={open}
              date={dueDate}
              mode="date"
              locale="cs"
              title="Vyberte čas"
              confirmText="Potvrdit"
              cancelText="Zrušit"
              onConfirm={dueDate => {
                setOpen(false);
                setDueDate(dueDate);
              }}
              onCancel={() => {
                setOpen(false);
              }}
            />
            <TouchableOpacity
              style={styles.item_body}
              onPress={() => setOpenTaxable(true)}>
              <View>
                <Text style={styles.text}>
                  Zdanitelné splnění: {taxableDate.toString().split(' ')[2]}
                  {'.'}
                  {getMonth(taxableDate.toString().split(' ')[1])}
                  {'.'}
                  {taxableDate.toString().split(' ')[3]}
                </Text>
              </View>
            </TouchableOpacity>
            <DatePicker
              modal
              open={openTaxable}
              date={taxableDate}
              locale="cs"
              title="Vyberte čas"
              confirmText="Potvrdit"
              cancelText="Zrušit"
              mode="date"
              onConfirm={taxableDate => {
                setOpenTaxable(false);
                setTaxableDate(taxableDate);
              }}
              onCancel={() => {
                setOpenTaxable(false);
              }}
            />
          </View>
        </ScrollView>

        <Pressable
          onPress={deleteInvoice}
          android_ripple={{color: '#00000050'}}
          style={({pressed}) => [
            {backgroundColor: pressed ? '#dddddd' : '#b00'},
            styles.button_delete,
          ]}>
          <Text style={styles.buttonText}>Smazat</Text>
        </Pressable>

        <Pressable
          onPress={saveInvoice}
          android_ripple={{color: '#00000050'}}
          style={({pressed}) => [
            {backgroundColor: pressed ? '#dddddd' : '#0b0'},
            styles.button,
          ]}>
          <Text style={styles.buttonText}>Uložit</Text>
        </Pressable>
      </View>
    );
  };

  const InvoicePreview = () => {
    return (
      <View style={styles.body}>
        <Text>náhled</Text>
      </View>
    );
  };

  const saveInvoice = () => {
    console.log('Save');
    navigation.goBack();
  };

  const deleteInvoice = () => {
    console.log('Delete');
    navigation.goBack();
  };

  const clientList = () => {
    console.log('List client');
    navigation.navigate('Klienti');
  };

  const profilList = () => {
    console.log('Profil client');
    navigation.navigate('Profily');
  };

  const itemList = () => {
    console.log('Item client');
    navigation.navigate('Položky');
  };

  const setInvoice = () => {
    if (invoiceClient !== undefined) {
      console.log(invoiceClient);
      setClient(invoiceClient);
    } else console.log('Klient není definován');

    if (invoiceProfile !== undefined) {
      console.log(invoiceProfile);
      setProfile(invoiceProfile);
    } else console.log('Profil není definován');
  };

  const getMonth = str => {
    let month;
    switch (str) {
      case 'Jan':
        month = 1;
        break;
      case 'Feb':
        month = 2;
        break;
      case 'Mar':
        month = 3;
        break;
      case 'Apr':
        month = 4;
        break;
      case 'May':
        month = 5;
        break;
      case 'Jun':
        month = 6;
        break;
      case 'Jul':
        month = 7;
        break;
      case 'Aug':
        month = 8;
        break;
      case 'Sep':
        month = 9;
        break;
      case 'Oct':
        month = 10;
        break;
      case 'Nov':
        month = 11;
        break;
      case 'Dec':
        month = 12;
        break;
      default:
        month = 0;
        break;
    }
    return month;
  };

  useEffect(() => {
    if (isFocused) {
      setInvoice();
    }
  }, [isFocused]);

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarOptions: {
          labelStyle: {fontSize: 16, fontWeight: 'bold'},
        },
      })}>
      <Tab.Screen name="Detaily" component={InvoiceDetail} />
      <Tab.Screen name="Náhled" component={InvoicePreview} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
  rows: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  item_body: {
    flex: 1,
    margin: 10,
    paddingHorizontal: 15,
  },
  text: {},
  text_cost: {
    right: 0,
    position: 'absolute',
    paddingHorizontal: 10,
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
  },
});
