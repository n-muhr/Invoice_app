import {StyleSheet, Text, View, Dimensions} from 'react-native';
import React from 'react';
import {StackedBarChart} from 'react-native-chart-kit';

export default function StackedBarData() {
  let date = new Date();
  const data = {
    labels: [
      String(date.getFullYear() - 2),
      String(date.getFullYear() - 1),
      String(date.getFullYear()),
    ],
    legend: ['Vystaveno', 'Uhrazeno', 'K úhradě'],
    data: [
      [60, 60, 60],
      [30, 30, 60],
      [30, 30, 60],
    ],
    barColors: ['#dfe4ea', '#ced6e0', '#a4b0be'],
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

  return (
    <View>
      <StackedBarChart
        data={data}
        width={Dimensions.get('window').width - 10}
        height={220}
        chartConfig={conf}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
