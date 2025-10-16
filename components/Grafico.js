import React from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

export default function Grafico({ registros, tipoGrafico }) {
  if (!registros || registros.length < 2) {
    return (
      <View style={styles.card}>
        <Text style={styles.mensagemGrafico}>Adicione pelo menos 2 registros para ver o gráfico.</Text>
      </View>
    );
  }

  let titulo = "";
  let unidade = "";
  let dadosParaGrafico = [];

  switch (tipoGrafico) {
    case 'exercicio':
      titulo = "Evolução (Horas de Exercício)";
      unidade = "h";
      dadosParaGrafico = registros.map(reg => reg.exercicio);
      break;
    case 'estudo':
      titulo = "Evolução (Horas de Estudo)";
      unidade = "h";
      dadosParaGrafico = registros.map(reg => reg.estudo);
      break;
    case 'celular':
      titulo = "Evolução (Horas no Celular)";
      unidade = "h";
      dadosParaGrafico = registros.map(reg => reg.celular);
      break;
    default:
      titulo = "Evolução (Horas de Exercício)";
      unidade = "h";
      dadosParaGrafico = registros.map(reg => reg.exercicio);
      break;
  }

  const labels = registros.map(reg => {
    if (reg.data) {
      const [dia, mes] = reg.data.split('/');
      return `${dia}/${mes}`;
    }
    return '';
  }).reverse();

  const datasets = [
    {
      data: dadosParaGrafico.reverse(),
    },
  ];

  const data = {
    labels: labels,
    datasets: datasets,
  };

  return (
    <View style={styles.card}>
      <Text style={styles.tituloGrafico}>{titulo}</Text>
      <LineChart
        data={data}
        width={screenWidth - 40}
        height={220}
        yAxisSuffix={` ${unidade}`}
        chartConfig={{
          backgroundColor: '#4A90E2',
          backgroundGradientFrom: '#6FA8DC',
          backgroundGradientTo: '#4A90E2',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: { borderRadius: 16 },
        }}
        bezier
        style={styles.estiloGrafico}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { 
    backgroundColor: '#FFFFFF', 
    borderRadius: 12, 
    padding: 20, 
    marginHorizontal: 15, 
    marginBottom: 20, 
    elevation: 5, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, 
    shadowRadius: 4, 
  },
  mensagemGrafico: { 
    textAlign: 'center', 
    margin: 10, 
    color: '#7F8C8D', 
    fontSize: 16, 
  },
  tituloGrafico: { 
    textAlign: 'center', 
    fontWeight: 'bold', 
    fontSize: 20, 
    marginBottom: 15, 
    color: '#34495e' 
  },
  estiloGrafico: { 
    marginVertical: 8, 
    borderRadius: 16, 
  },
});
