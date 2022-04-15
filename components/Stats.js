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

  const getData = async () => {
    setTableData([]);
    let data = await getLastYearInvoice();
    //console.log(data);
    let payed = 0;
    let to_pay = 0;
    let total = 0;

    for (let i = 0; i < data.length; i++) {
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

    data = await getLastThreeYearInvoice();
    console.log(data);
  };

  let conf = {
    backgroundColor: '#e26a00',
    backgroundGradientFrom: '#fb8c00',
    backgroundGradientTo: '#ffa726',
    decimalPlaces: 0, // optional, defaults to 2dp
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
      width: '100',
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#ffa726',
    },
  };

  const monthsNow = () => {
    let m = [];
    for (let i = 0; i <= new Date().getMonth(); i++) {
      m.push(months[i]);
    }
    return m;
  };

  let data = {
    labels: monthsNow(),
    datasets: [
      {
        data: [0, 1, 0, 10],
      },
    ],
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
            <Row
              data={tableHead}
              flexArr={[1, 1, 1, 1]}
              style={styles.head}
              textStyle={styles.text}
            />
            {/* Řádky s daty */}
            <TableWrapper style={styles.wrapper}>
              <Col
                data={tableTitle}
                style={styles.title}
                heightArr={[28, 28]}
                textStyle={styles.text}
              />
              <Rows
                data={tableData}
                flexArr={[1, 1, 1]}
                style={styles.row}
                textStyle={styles.text}
              />
            </TableWrapper>
          </Table>
        </View>
      </View>

      <View style={styles.item_body_graph}>
        <Text style={styles.header}>
          Vydaných faktur za rok {new Date().getFullYear()}
        </Text>
        <LineChart
          data={data}
          width={Dimensions.get('window').width - 10} // from react-native
          height={220}
          yAxisLabel=""
          yAxisSuffix="ks"
          yAxisInterval={1} // optional, defaults to 1
          chartConfig={conf}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
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
  row: {height: 28},
  text: {textAlign: 'center'},
  header: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    margin: 5,
  },
  item_body: {
    backgroundColor: '#C0DDF6',
    marginVertical: 20,
    marginHorizontal: 2,
    borderColor: '#80BEF3',
    borderWidth: 1,
  },
  item_body_graph: {
    backgroundColor: '#C0DDF6',
    marginVertical: 20,
    marginHorizontal: 2,
    borderColor: '#80BEF3',
    borderWidth: 1,
    alignItems: 'center',
  },
});
