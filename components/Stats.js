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
    //console.log(result);
  };

  const getData = async () => {
    setTableData([]);
    let data = await getLastYearInvoice();
    //console.log(data);
    let payed = 0;
    let to_pay = 0;
    let total = 0;

    for (let i = 0; i < data.length; i++) {
      monthInvoiceCount(data[i].date_of_issue);
      let products = await getProducts(data[i].id);
      for (let j = 0; j < products.length; j++) {
        //console.log(products[j]);
        let total_prod = products[j].price * products[j].quantity;
        total_prod += (total_prod * products[j].dph) / 100;
        total += total_prod;
        if (data[i].isPaid) {
          payed += total_prod;
        }
      }
      if (!data[i].isPaid) payed += data[i].payed;
    }

    to_pay = total - payed;

    setTableData(previousState => [...previousState, [total, payed, to_pay]]);

    let n = monthsNow().length;
    setDataLine(resultLine.slice(0, n));

    console.log(dataLine);

    //data = await getLastThreeYearInvoice();
    //console.log(data);
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

        <View style={styles.container}>
          <Table borderStyle={{borderWidth: 1}}>
            <Row data={tableHead} flexArr={[1, 1, 1, 1]} style={styles.head} />
            {/* Řádky s daty */}
            <TableWrapper style={styles.wrapper}>
              <Col
                data={tableTitle}
                style={styles.title}
                heightArr={[28, 28]}
              />
              <Rows data={tableData} flexArr={[1, 1, 1]} style={styles.row} />
            </TableWrapper>
          </Table>
        </View>
      </View>

      <View style={styles.item_body_graph}>
        <Text style={styles.header}>
          Vydaných faktur za rok {new Date().getFullYear()}
        </Text>

        <LineData dataLine={dataLine} months={monthsNow()} />
      </View>

      <View style={styles.item_body_graph}>
        <Text style={styles.header}>Přijem za poslední 3 roky</Text>
        <BarChart
          data={barData}
          width={Dimensions.get('window').width - 10}
          height={260}
          yAxisLabel="Kč"
          chartConfig={barChartConfig}
          verticalLabelRotation={30}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  body: {flex: 1},
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
    color: '#000',
    margin: 5,
  },
  item_body: {
    //backgroundColor: '#C0DDF6',
    marginVertical: 20,
    marginHorizontal: 2,
    borderColor: '#80BEF3',
    borderWidth: 1,
  },
  item_body_graph: {
    //backgroundColor: '#C0DDF6',
    marginVertical: 20,
    marginHorizontal: 2,
    borderColor: '#80BEF3',
    borderWidth: 1,
    alignItems: 'center',
  },
});
