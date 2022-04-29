import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  Pressable,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  getLastYearInvoice,
  getProducts,
  getLastThreeYearInvoice,
} from '../../src/database/database';
import {useIsFocused} from '@react-navigation/native';
import LineData from '../charts/LineData';
import TableData from '../charts/TableData';
import BarData from '../charts/BarData';
import {useSelector} from 'react-redux';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import {ReportPDF} from '../pdf/ReportPDF';
import RNPrint from 'react-native-print';

let tableTitle = ['Celkem'];
let tableHead = ['Měsíc', 'Vystaveno', 'Uhrazeno', 'Zbývá k uhrazení'];
let months = [
  'Leden',
  'Únor',
  'Březen',
  'Duben',
  'Květen',
  'Červen',
  'Červenec',
  'Srpen',
  'Září',
  'Říjen',
  'Listopad',
  'Prosinec',
];

export default function Stats() {
  const {currUser} = useSelector(state => state.invoiceReducer);

  const [tableData, setTableData] = useState([]);
  let tableDataTest = [];

  const [dataLine, setDataLine] = useState([]);
  const [dataBar, setDataBar] = useState([]);

  const monthsNow = () => {
    let m = [];
    for (let i = 0; i <= new Date().getMonth(); i++) {
      m.push(months[i]);
    }
    return m;
  };

  let resultLine = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  let resultBar = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  const monthInvoiceCount = num => {
    const date = new Date(num);
    resultLine[date.getMonth()] += 1;
  };

  const getData = async () => {
    setTableData([]);
    setDataBar([]);
    resultLine = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    resultBar = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let data = await getLastYearInvoice(currUser.id);

    for (let i = monthsNow().length; i >= 0; i--) {
      let payedM = 0;
      let to_payM = 0;
      let totalM = 0;
      let was_found = false;
      for (let j = 0; j < data.length; j++) {
        if (data[j].is_storno === 1) continue;
        if (new Date(data[j].date_of_issue).getMonth() === i) {
          was_found = true;
          if (!tableTitle.includes(months[i])) tableTitle.unshift(months[i]);

          let products = await getProducts(data[j].id);
          for (let p = 0; p < products.length; p++) {
            let total_prod = products[p].price * products[p].quantity;
            total_prod += (total_prod * products[p].dph) / 100;
            totalM += total_prod;
            if (data[j].paid) {
              payedM += total_prod;
            }

            resultBar[new Date(data[j].date_of_issue).getMonth()] += total_prod;
          }
          if (!data[j].paid) payedM += data[j].payed;
        }
      }
      to_payM = totalM - payedM;
      if (was_found)
        tableDataTest.unshift([
          Number(totalM),
          Number(payedM),
          Number(to_payM),
        ]);
    }

    let celkem = [0, 0, 0];
    for (let i = 0; i < tableDataTest.length; i++) {
      celkem[0] += tableDataTest[i][0];
      celkem[1] += tableDataTest[i][1];
      celkem[2] += tableDataTest[i][2];
    }
    tableDataTest.push(celkem);
    setTableData(tableDataTest);

    for (let i = 0; i < data.length; i++) {
      monthInvoiceCount(data[i].date_of_issue);
    }

    let n = monthsNow().length;
    setDataLine(resultLine.slice(0, n));
    setDataBar(resultBar.slice(0, n));
  };

  const createReport = async choice => {
    let name = 'report';
    let options = {
      html: await ReportPDF(currUser, choice),
      fileName: name,
      directory: 'Download',
    };

    let file = await RNHTMLtoPDF.convert(options);
    console.log(file);
  };

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      getData();
    }
  }, [isFocused]);

  return (
    <View style={styles.body}>
      <ScrollView style={styles.body}>
        <View style={styles.item_body}>
          <Text style={styles.header}>
            Rychlý přehled pro rok {new Date().getFullYear()}
          </Text>

          <TableData
            tableTitle={tableTitle}
            tableHead={tableHead}
            tableData={tableData}
          />
          <BarData barData={dataBar} barLabels={monthsNow()} />
        </View>

        <View style={[styles.item_body_graph, {paddingBottom: 50}]}>
          <Text style={styles.header}>
            Počet vydaných faktur za rok {new Date().getFullYear()}
          </Text>
          {/* <LineData dataLine={dataLine} months={monthsNow()} /> */}
        </View>
      </ScrollView>

      <Pressable
        onPress={async () => {
          console.log('vypis dne');
          await createReport(1);
          await RNPrint.print({
            filePath:
              '/storage/emulated/0/Android/data/com.invoiceapp/files/Download/report.pdf',
          });
        }}
        android_ripple={{color: '#00000050'}}
        style={({pressed}) => [
          {backgroundColor: pressed ? '#dddddd' : '#3988d7'},
          styles.button_month,
        ]}>
        <Text style={styles.buttonText}>Výpis za den</Text>
      </Pressable>

      <Pressable
        onPress={async () => {
          console.log('vypis mesice');
          await createReport(2);
          await RNPrint.print({
            filePath:
              '/storage/emulated/0/Android/data/com.invoiceapp/files/Download/report.pdf',
          });
        }}
        android_ripple={{color: '#00000050'}}
        style={({pressed}) => [
          {backgroundColor: pressed ? '#dddddd' : '#3988d7'},
          styles.button,
        ]}>
        <Text style={styles.buttonText}>Výpis za měsíc</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {flex: 1, backgroundColor: '#292C33'},
  container: {
    padding: 1,
    margin: 5,
    marginVertical: 10,
    backgroundColor: '#fff',
  },
  head: {height: 40, backgroundColor: '#80BEF3'},
  wrapper: {flexDirection: 'row'},
  title: {flex: 1, backgroundColor: '#f6f8fa'},
  row: {
    height: 28,
  },
  text: {textAlign: 'center'},
  header: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    margin: 5,
  },
  item_body: {
    //backgroundColor: '#C0DDF6',
    marginVertical: 20,
    marginHorizontal: 2,
    //borderColor: '#80BEF3',
    //borderWidth: 1,
  },
  item_body_graph: {
    //backgroundColor: '#C0DDF6',
    marginVertical: 20,
    marginHorizontal: 2,
    //borderColor: '#80BEF3',
    //borderWidth: 1,
    alignItems: 'center',
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
  button_month: {
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
