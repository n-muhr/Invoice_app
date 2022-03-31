import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
  Pressable,
  ScrollView,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import SQLite from 'react-native-sqlite-storage';

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

export default function ProductList() {
  const [products, setProducts] = useState([
    //{description: 'Produkt 1', price: 100, quantity: 1},
  ]);
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');

  //vytvoreni table invoice pokud neexistuje
  const createTable = () => {
    db.transaction(txn => {
      txn.executeSql(
        'Create table if not exists product(id INTEGER PRIMARY KEY AUTOINCREMENT, invoice_id integer, description TEXT, price decimal(10,5), quantity integer)',
      );
    });
  };

  const addProduct = () => {
    if (
      description.length > 0 &&
      price.length > 0 &&
      quantity.length > 0 &&
      !isNaN(price) &&
      !isNaN(quantity)
    ) {
      let product = {
        description: description,
        price: Number(price),
        quantity: Number(quantity),
      };
      console.log(description);
      console.log(product);
      let newProducts = [...products, product];
      setProducts(newProducts);
    } else {
      console.log('wrong data');
    }
  };

  useEffect(() => {
    createTable();
  }, []);

  return (
    <View style={styles.body}>
      <FlatList
        data={products}
        renderItem={({item}) => (
          <View style={styles.item}>
            <Text>{item.description}</Text>
            <View style={styles.row}>
              <Text>{item.price}</Text>
              <Text>{item.quantity}</Text>
            </View>
          </View>
        )}
      />

      <View style={styles.add_item}>
        <TextInput
          value={description}
          onChangeText={value => setDescription(value)}
          style={styles.input_desc}
          placeholder="Popis produktu"
        />
        <View style={styles.row}>
          <TextInput
            value={price}
            keyboardType="numeric"
            onChangeText={value => setPrice(value)}
            style={styles.input}
            placeholder="Cena za kus"
          />
          <TextInput
            value={quantity}
            keyboardType="numeric"
            onChangeText={value => setQuantity(value)}
            style={styles.input}
            placeholder="Množství"
          />
        </View>
        <Pressable
          onPress={addProduct}
          android_ripple={{color: '#00000050'}}
          style={({pressed}) => [
            {backgroundColor: pressed ? '#dddddd' : '#00f'},
            styles.button,
          ]}>
          <Text style={styles.buttonText}>Přidat</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {flex: 1},
  rows: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  item: {
    flex: 1,
    margin: 10,
    paddingHorizontal: 15,
  },
  add_item: {
    flex: 1,
    margin: 10,
    bottom: 10,
    position: 'absolute',
  },
  input_desc: {},
  input: {},
  button: {
    width: '95%',
    height: 50,
    alignItems: 'center',
    borderRadius: 5,
    margin: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 20,
    margin: 10,
    textAlign: 'center',
  },
});
