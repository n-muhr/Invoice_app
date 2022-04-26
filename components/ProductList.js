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
import {
  createTableProduct,
  addProductDatabase,
  deleteProduct,
  ExecuteQuery,
} from './database';
import {useSelector} from 'react-redux';
import {Picker} from '@react-native-picker/picker';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [dph, setDPH] = useState('21');

  const {currInvoice} = useSelector(state => state.invoiceReducer);

  const addProduct = () => {
    if (
      description.length > 0 &&
      price.length > 0 &&
      quantity.length > 0 &&
      !isNaN(price) &&
      !isNaN(quantity)
    ) {
      let product = {
        invoice_id: currInvoice.id,
        description: description,
        price: Number(price),
        quantity: Number(quantity),
        dph: Number(dph),
      };
      let newProducts = [...products, product];
      //setProducts(newProducts);
      addProductDatabase(product);
      getProducts();
    } else {
      console.log('wrong data');
    }
  };

  const delProduct = id => {
    deleteProduct(id);
    getProducts();
  };

  const getProducts = async () => {
    try {
      setProducts([]);
      let selectQuery = await ExecuteQuery(
        'select id, invoice_id,description, price, quantity, dph from product where invoice_id = ?',
        [currInvoice.id],
      );
      var rows = selectQuery.rows;
      for (let i = 0; i < rows.length; i++) {
        let item = rows.item(i);
        let product = {
          id: item.id,
          invoice_id: item.invoice_id,
          description: item.description,
          price: item.price,
          quantity: item.quantity,
          dph: item.dph,
        };
        setProducts(Products => [...Products, product]);
        console.log(product);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    createTableProduct();
    getProducts();
  }, []);

  return (
    <View style={styles.body}>
      <FlatList
        data={products}
        style={{flexGrow: 0, maxHeight: '60%'}}
        renderItem={({item}) => (
          <View style={styles.item}>
            <Text style={styles.text}>Popis: {item.description}</Text>
            <View style={styles.rows}>
              <Text style={styles.text}>Cena: {item.price}</Text>
              <Text style={styles.text}>Množství: {item.quantity}</Text>
              <Text style={styles.text}>DPH: {item.dph}%</Text>
            </View>
            <Pressable
              onPress={() => {
                delProduct(item.id);
              }}
              android_ripple={{color: '#00000050'}}
              style={({pressed}) => [
                {backgroundColor: pressed ? '#dddddd' : '#b00'},
                styles.button,
              ]}>
              <Text style={styles.buttonText}>Odebrat</Text>
            </Pressable>
          </View>
        )}
      />
      <View style={styles.add_item}>
        <TextInput
          value={description}
          onChangeText={value => setDescription(value)}
          style={styles.input_desc}
          placeholder="Popis produktu"
          placeholderTextColor={'grey'}
        />
        <View style={styles.rows}>
          <TextInput
            value={price}
            keyboardType="numeric"
            onChangeText={value => setPrice(value)}
            style={styles.input}
            placeholder="Cena za ks"
            placeholderTextColor={'grey'}
          />
          <TextInput
            value={quantity}
            keyboardType="numeric"
            onChangeText={value => setQuantity(value)}
            style={styles.input}
            placeholder="Množství"
            placeholderTextColor={'grey'}
          />
          <Picker
            selectedValue={dph}
            style={{height: 20, width: '33%', backgroundColor: '#dddddd'}}
            onValueChange={(itemValue, itemIndex) => setDPH(itemValue)}>
            <Picker.Item label="21%" value="21" />
            <Picker.Item label="15%" value="15" />
            <Picker.Item label="10%" value="10" />
            <Picker.Item label="0%" value="0" />
          </Picker>
        </View>
        <Pressable
          onPress={() => {
            addProduct();
          }}
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
  body: {flex: 1, backgroundColor: '#292C33'},
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
    maxHeight: '80%',
  },
  input_desc: {borderBottomWidth: 1, color: '#fff', margin: 5},
  input: {
    width: '25%',
    color: '#fff',
    marginHorizontal: 15,
    borderBottomWidth: 1,
  },
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
  text: {color: '#ffffff', marginHorizontal: 10, marginVertical: 5},
});
