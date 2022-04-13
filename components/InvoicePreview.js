import {StyleSheet, Text, View, Dimensions, Pressable} from 'react-native';
import React, {useState, useEffect} from 'react';
import Pdf from 'react-native-pdf';
import {useSelector} from 'react-redux';
import RNPrint from 'react-native-print';
import Mailer from 'react-native-mail';

export default function InvoicePreview() {
  const {currInvoice} = useSelector(state => state.invoiceReducer);

  let source = {uri: ''};
  currInvoice !== undefined
    ? (source = {
        uri:
          'file:///storage/emulated/0/Android/data/com.invoiceapp/files/Download/test' +
          currInvoice.id +
          '.pdf',
        filePath:
          '/storage/emulated/0/Android/data/com.invoiceapp/files/Download/test' +
          currInvoice.id +
          '.pdf',
      })
    : (source = {
        uri: '',
      });

  const handleEmail = () => {
    Mailer.mail(
      {
        subject: 'Send help',
        recipients: [''],
        ccRecipients: [],
        bccRecipients: [],
        body: '',
        isHTML: true,
        attachment: {
          //path: '/storage/emulated/0/Download/test1.pdf',
          uri: 'file:///storage/emulated/0/Download//test1.pdf',
          type: 'pdf',
          name: 'Faktura',
        },
      },
      (error, event) => {
        Alert.alert(
          error,
          event,
          [
            {
              text: 'Ok',
              onPress: () => console.log('OK: Email Error Response'),
            },
            {
              text: 'Cancel',
              onPress: () => console.log('CANCEL: Email Error Response'),
            },
          ],
          {cancelable: true},
        );
      },
    );
  };

  return (
    <View style={styles.container}>
      <Pdf
        source={source}
        onLoadComplete={(numberOfPages, filePath) => {
          //console.log(`Number of pages: ${numberOfPages}`);
        }}
        onError={error => {
          console.log(error);
        }}
        onPressLink={uri => {
          //console.log(`Link pressed: ${uri}`);
        }}
        style={styles.pdf}
      />
      <View style={styles.rows}>
        <Pressable
          onPress={async () => {
            console.log(source);
            await RNPrint.print({filePath: source.filePath});
          }}
          android_ripple={{color: '#00000050'}}
          style={({pressed}) => [
            {backgroundColor: pressed ? '#dddddd' : '#3988d7'},
            styles.button,
          ]}>
          <Text style={styles.buttonText}>Tisk</Text>
        </Pressable>
        <Pressable
          onPress={async () => {
            console.log(source);
            handleEmail();
          }}
          android_ripple={{color: '#00000050'}}
          style={({pressed}) => [
            {backgroundColor: pressed ? '#dddddd' : '#3988d7'},
            styles.button,
          ]}>
          <Text style={styles.buttonText}>Poslat email</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 25,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  button: {
    width: '45%',
    height: 50,
    alignItems: 'center',
    borderRadius: 5,
    margin: 10,
    bottom: 0,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 20,
    margin: 10,
    textAlign: 'center',
  },
  rows: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
