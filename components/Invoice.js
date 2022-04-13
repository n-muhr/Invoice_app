import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import SQLite from 'react-native-sqlite-storage';
import {useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import DatePicker from 'react-native-date-picker';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {useDispatch} from 'react-redux';
import {setCurrentInvoce} from '../src/redux/actions';
import {getLastInvoice, ExecuteQuery, getProfile, getClient} from './database';
import {Picker} from '@react-native-picker/picker';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import {pdfContent} from './PDFContent';

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
  const [profile, setProfile] = useState('');
  const [client, setClient] = useState('');
  const [profileName, setProfileName] = useState('');
  const [clientName, setClientName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Hotovost');
  const [payed, setPayed] = useState('');
  const [note, setNote] = useState('');

  const [isPaid, setIsPaid] = useState(false);

  const [dueDate, setDueDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  const [taxableDate, setTaxableDate] = useState(new Date());
  const [openTaxable, setOpenTaxable] = useState(false);

  const [createdDate, setCreatedDate] = useState(new Date());
  const [openCreated, setOpenCreated] = useState(false);

  const {invoiceClient, invoiceProfile, currInvoice} = useSelector(
    state => state.invoiceReducer,
  );

  const isFocused = useIsFocused();

  const dispatch = useDispatch();

  const saveInvoice = () => {
    let time_now = new Date();

    if (currInvoice === undefined) {
      db.transaction(tx => {
        tx.executeSql(
          'insert into invoice(date_of_issue, due_date, taxable_supply, payed, payment_method, paid, client_id, profile_id, note) values(?,?,?,?,?,?,?,?,?)',
          [
            createdDate.toDateString(),
            dueDate.toDateString(),
            taxableDate.toDateString(),
            payed,
            paymentMethod,
            isPaid,
            client,
            profile,
            note,
          ],
        );
      });
    } else {
      db.transaction(tx => {
        tx.executeSql(
          'update invoice set date_of_issue =?, due_date = ?, taxable_supply =?, payed = ?, payment_method = ?, paid = ?, client_id = ?, profile_id = ?, note = ? where id = ?',
          [
            createdDate.toDateString(),
            dueDate.toDateString(),
            taxableDate.toDateString(),
            payed,
            paymentMethod,
            isPaid,
            client,
            profile,
            note,
            currInvoice.id,
          ],
        );
      });
    }

    let invoice = {
      id: currInvoice.id,
      date_of_issue: currInvoice.date_of_issue,
      due_date: dueDate,
      taxable_supply: taxableDate,
      payed: payed,
      payment_method: paymentMethod,
      paid: isPaid,
      client_id: client,
      profile_id: profile,
      note: note,
    };

    dispatch(setCurrentInvoce(invoice));
    console.log('Save');
  };

  const deleteInvoice = () => {
    console.log('Delete');
    navigation.goBack();
  };

  const clientList = () => {
    navigation.navigate('Klienti');
  };

  const profilList = () => {
    navigation.navigate('Profily');
  };

  const itemList = () => {
    navigation.navigate('Položky');
  };

  const createPDF = async () => {
    let name = 'test' + currInvoice.id;
    let options = {
      html: await pdfContent(currInvoice),
      fileName: name,
      directory: 'Download',
    };

    let file = await RNHTMLtoPDF.convert(options);
  };

  const setInvoice = async () => {
    if (currInvoice !== undefined) {
      if (currInvoice.profile_id !== '') {
        let profile = await getProfile(currInvoice.profile_id);
        setProfileName(profile.name);
      }

      setProfile(currInvoice.profile_id);

      if (currInvoice.client_id !== '') {
        let client = await getClient(currInvoice.client_id);
        setClientName(client.name);
      }

      setClient(currInvoice.client_id);
      setPayed(currInvoice.payed.toString());
      setPaymentMethod(currInvoice.payment_method);
      setIsPaid(currInvoice.paid);
      setNote(currInvoice.note);
      setDueDate(new Date(currInvoice.due_date));
      setTaxableDate(new Date(currInvoice.taxable_supply));
      setCreatedDate(new Date(currInvoice.date_of_issue));
    } else {
      await ExecuteQuery(
        'insert into invoice(date_of_issue, due_date, taxable_supply, payed, payment_method, paid, client_id, profile_id, note) values(?,?,?,?,?,?,?,?,?)',
        [
          createdDate.toDateString(),
          dueDate.toDateString(),
          taxableDate.toDateString(),
          payed,
          paymentMethod,
          isPaid,
          client,
          profile,
          note,
        ],
      );

      let invoice = await getLastInvoice();
      console.log('New Invoice');
      dispatch(setCurrentInvoce(invoice));
    }

    if (invoiceClient !== undefined) {
      console.log(invoiceClient);
      setClient(invoiceClient);
      let client = await getClient(invoiceClient);
      setClientName(client.name);
    }

    if (invoiceProfile !== undefined) {
      console.log(invoiceProfile);
      setProfile(invoiceProfile);
      let profile = await getProfile(invoiceProfile);
      setProfileName(profile.name);
    }
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
    <View style={styles.body}>
      <ScrollView style={styles.body}>
        <View style={styles.body}>
          <TouchableOpacity style={styles.item_body} onPress={profilList}>
            <View style={styles.rows}>
              <Text style={styles.text}>Dodavatel: </Text>
              <Text style={styles.text}>{profileName}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.item_body} onPress={clientList}>
            <View style={styles.rows}>
              <Text style={styles.text}>Odběratel: </Text>
              <Text style={styles.text}>{clientName}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.item_body} onPress={itemList}>
            <Text style={styles.text}>Položky</Text>
          </TouchableOpacity>
          <View style={styles.item_body}>
            <View style={styles.rows}>
              <Text style={styles.text}>Je zaplacená</Text>
              <Switch
                value={isPaid}
                onValueChange={() => {
                  setIsPaid(previousState => !previousState);
                }}
                trackColor={{false: '#767577', true: '#81b0ff'}}
                thumbColor={isPaid ? '#f5dd4b' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
              />
            </View>
            {isPaid ? null : (
              <View style={styles.rows}>
                <Text style={styles.text}>Zaplaceno: </Text>
                <TextInput
                  value={payed}
                  keyboardType="numeric"
                  onChangeText={value => setPayed(value)}
                  style={styles.input}
                  placeholder="Kč"
                />
              </View>
            )}
            <TextInput
              value={note}
              onChangeText={value => setNote(value)}
              style={styles.input_note}
              placeholder="Poznámka"
              multiline
            />
          </View>
          <TouchableOpacity
            style={styles.item_body}
            onPress={() => setOpenCreated(true)}>
            <View>
              <Text style={styles.text}>
                Datum vytvoření: {createdDate.toString().split(' ')[2]}
                {'.'}
                {getMonth(createdDate.toString().split(' ')[1])}
                {'.'}
                {createdDate.toString().split(' ')[3]}
              </Text>
            </View>
          </TouchableOpacity>
          <DatePicker
            modal
            open={openCreated}
            date={createdDate}
            mode="date"
            locale="cs"
            title="Vyberte čas"
            confirmText="Potvrdit"
            cancelText="Zrušit"
            onConfirm={createdDate => {
              setOpenCreated(false);
              setCreatedDate(createdDate);
            }}
            onCancel={() => {
              setOpenCreated(false);
            }}
          />
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
          <View style={styles.item_body}>
            <Picker
              selectedValue={paymentMethod}
              style={{height: 50, width: '60%'}}
              onValueChange={(itemValue, itemIndex) =>
                setPaymentMethod(itemValue)
              }>
              <Picker.Item label="Hotovost" value="Hotovost" />
              <Picker.Item label="Platba Kartou" value="Platba Kartou" />
              <Picker.Item label="Bankovní převod" value="Bankovní převod" />
            </Picker>
          </View>
        </View>
      </ScrollView>

      <Pressable
        onPress={async () => {
          await createPDF();
          navigation.navigate('Náhled');
        }}
        android_ripple={{color: '#00000050'}}
        style={({pressed}) => [
          {backgroundColor: pressed ? '#dddddd' : '#3988d7'},
          styles.button_delete,
        ]}>
        <Text style={styles.buttonText}>Náhled</Text>
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
  text: {
    color: '#000',
    fontSize: 18,
  },
  text_cost: {
    right: 0,
    position: 'absolute',
    paddingHorizontal: 10,
    color: '#000',
    fontSize: 16,
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
  input: {
    width: '45%',
    borderColor: '#555555',
    borderRadius: 25,
    backgroundColor: '#dddddd',
    textAlign: 'left',
    fontSize: 18,
    margin: 10,
  },
  input_note: {
    width: '95%',
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
});
