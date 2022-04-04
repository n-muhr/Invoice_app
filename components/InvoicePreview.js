import {StyleSheet, Text, View, Dimensions, Pressable} from 'react-native';
import React, {useState, useEffect} from 'react';
import Pdf from 'react-native-pdf';
import {useSelector} from 'react-redux';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import {pdfContent} from './PDFContent';

export default function InvoicePreview() {
  const source = {
    uri: 'file:///storage/emulated/0/Android/data/com.invoiceapp/files/Download/test1.pdf',
  };

  const {currInvoice} = useSelector(state => state.invoiceReducer);

  const [PDFPath, setPDFPath] = useState('');

  const createPDF = async id => {
    let name = 'test' + currInvoice.id;
    let options = {
      html: pdfContent(currInvoice),
      fileName: name,
      directory: 'Download',
    };

    let file = await RNHTMLtoPDF.convert(options);
    setPDFPath(item => (item = file.filePath));
  };

  return (
    <View style={styles.container}>
      <Pdf
        source={source}
        onLoadComplete={(numberOfPages, filePath) => {
          console.log(`Number of pages: ${numberOfPages}`);
        }}
        onError={error => {
          console.log(error);
        }}
        onPressLink={uri => {
          console.log(`Link pressed: ${uri}`);
        }}
        style={styles.pdf}
      />
      <Pressable
        onPress={() => {
          createPDF();
          console.log(PDFPath);
        }}
        android_ripple={{color: '#00000050'}}
        style={({pressed}) => [
          {backgroundColor: pressed ? '#dddddd' : '#0b0'},
          styles.button,
        ]}>
        <Text style={styles.buttonText}>Poslat na email</Text>
      </Pressable>
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
    width: '95%',
    height: 50,
    alignItems: 'center',
    borderRadius: 5,
    margin: 10,
    position: 'absolute',
    bottom: 0,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 20,
    margin: 10,
    textAlign: 'center',
  },
});
