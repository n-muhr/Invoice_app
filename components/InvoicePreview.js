import {StyleSheet, Text, View, Dimensions, Pressable} from 'react-native';
import React, {useState, useEffect} from 'react';
import Pdf from 'react-native-pdf';
import {useSelector} from 'react-redux';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import {pdfContent} from './PDFContent';
import {useIsFocused} from '@react-navigation/native';
import RNPrint from 'react-native-print';

export default function InvoicePreview() {
  const {currInvoice} = useSelector(state => state.invoiceReducer);

  const [PDFPath, setPDFPath] = useState('');
  let source = {uri: ''};
  currInvoice !== undefined
    ? (source = {
        uri:
          'file:///storage/emulated/0/Android/data/com.invoiceapp/files/Download/test' +
          currInvoice.id +
          '.pdf',
      })
    : (source = {
        uri: 'file:///storage/emulated/0/Android/data/com.invoiceapp/files/Download/test1.pdf',
      });

  const createPDF = async id => {
    let name = 'test' + currInvoice.id;
    let options = {
      html: await pdfContent(currInvoice),
      fileName: name,
      directory: 'Download',
    };

    let file = await RNHTMLtoPDF.convert(options);
    setPDFPath(item => (item = file.filePath));
    //console.log(PDFPath);
  };

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      createPDF();
    }
  }, [PDFPath, isFocused]);

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
      <Pressable
        onPress={async () => {
          console.log(source);
          await RNPrint.print({filePath: source.uri});
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
          await RNPrint.print({filePath: source.uri});
        }}
        android_ripple={{color: '#00000050'}}
        style={({pressed}) => [
          {backgroundColor: pressed ? '#dddddd' : '#3988d7'},
          styles.button,
        ]}>
        <Text style={styles.buttonText}>Poslat email</Text>
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
