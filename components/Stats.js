import {StyleSheet, Text, View, Dimensions, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from 'react-native-chart-kit';
import {
  getLastYearInvoice,
  getProducts,
  getLastThreeYearInvoice,
} from './database';
import {
  Table,
  TableWrapper,
  Row,
  Rows,
  Col,
  Cols,
  Cell,
} from 'react-native-table-component';
import {useIsFocused} from '@react-navigation/native';
import LineData from './charts/LineData';
import TableData from './charts/TableData';
import StackedBarData from './charts/StackedBarData';

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

let barData = {
  labels: months,
  datasets: [
    {
      data: [20, 45, 28, 80, 99, 43, 20, 45, 28, 80, 99, 43],
    },
  ],
};

const barChartConfig = {
  backgroundGradientFrom: '#fff',
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: '#fff',
  backgroundGradientToOpacity: 0.5,

  color: (opacity = 1) => `#023047`,
  labelColor: (opacity = 1) => `#333`,
  strokeWidth: 2,

  barPercentage: 0.5,
  useShadowColorFromDataset: false,
  decimalPlaces: 0,
};

export default function Stats() {
  const [tableData, setTableData] = useState([]);
  let tableDataTest = [];

  const [dataLine, setDataLine] = useState([]);

  const monthsNow = () => {
    let m = [];
    for (let i = 0; i <= new Date().getMonth(); i++) {
      m.push(months[i]);
    }
    return m;
  };

  let resultLine = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  const monthInvoiceCount = num => {
    const date = new Date(num);
    resultLine[date.getMonth()] += 1;
  };

  const getData = async () => {
    setTableData([]);
    let data = await getLastYearInvoice();

    for (let i = monthsNow().length; i >= 0; i--) {
      let payedM = 0;
      let to_payM = 0;
      let totalM = 0;
      let was_found = false;
      for (let j = 0; j < data.length; j++) {
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

    //console.log('Table data: ', tableData);

    for (let i = 0; i < data.length; i++) {
      monthInvoiceCount(data[i].date_of_issue);
    }

    let n = monthsNow().length;
    setDataLine(resultLine.slice(0, n));
  };

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      getData();
    }
  }, [isFocused]);

  return (
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
      </View>

      <View style={styles.item_body_graph}>
        <Text style={styles.header}>
          Vydaných faktur za rok {new Date().getFullYear()}
        </Text>
        {/* <StackedBarData /> */}
        {/* <LineData dataLine={dataLine} months={monthsNow()} /> */}
      </View>

      {/* <View style={styles.item_body_graph}>
        <Text style={styles.header}>Přijem za poslední 3 roky</Text>
        <BarChart
          data={barData}
          width={Dimensions.get('window').width - 10}
          height={260}
          yAxisLabel="Kč"
          chartConfig={barChartConfig}
          verticalLabelRotation={30}
        />
      </View> */}
    </ScrollView>
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
  head: {height: 40, backgroundColor: '#f1f8ff'},
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
});
