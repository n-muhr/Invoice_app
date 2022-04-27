import {StyleSheet, Text, View, Dimensions} from 'react-native';
import React from 'react';
import {BarChart} from 'react-native-chart-kit';

export default function BarData({barData, barLabels}) {
  const data = {
    labels: barLabels,
    datasets: [
      {
        data: barData,
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientFromOpacity: 1,
    backgroundGradientTo: '#fff',
    backgroundGradientToOpacity: 1,

    color: (opacity = 1) => `#80BEF3`,
    labelColor: (opacity = 1) => `#000`,
    strokeWidth: 2,

    barPercentage: 0.8,
    useShadowColorFromDataset: false,
    decimalPlaces: 2,
  };

  return (
    <View style={styles.container}>
      <BarChart
        style={{margin: 2}}
        data={data}
        width={Dimensions.get('window').width - 10}
        height={260}
        yAxisLabel=""
        chartConfig={chartConfig}
        verticalLabelRotation={0}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 5,
    marginVertical: 10,
    marginHorizontal: 4,
    backgroundColor: '#fff',
  },
});
