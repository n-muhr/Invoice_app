import {StyleSheet, Text, View, Dimensions} from 'react-native';
import React from 'react';
import {LineChart} from 'react-native-chart-kit';

export default function LineData({dataLine, months}) {
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

  let lineData = {
    labels: months,
    datasets: [
      {
        data: dataLine,
      },
    ],
  };

  //console.log('Line :', dataLine);

  return (
    <View>
      <LineChart
        data={lineData}
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
  );
}

const styles = StyleSheet.create({});
