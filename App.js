import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Platform,
  TouchableOpacity,
  Alert,
  Button,
} from 'react-native';

import * as Database from './services/Database';
import Formulario from './components/Formulario';
import ListaRegistros from './components/ListaRegistros';
import Grafico from './components/Grafico'; 
import * as Sharing from 'expo-sharing';

export default function App() {
  const [registros, setRegistros] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [ordenacao, setOrdenacao] = useState('recentes');
  const [graficoAtivo, setGraficoAtivo] = useState('exercicio'); 

  useEffect(() => {
    const init = async () => {
      const dados = await Database.carregarDados();
      setRegistros(dados);
      setCarregando(false);
    };
    init();
  }, []);

  useEffect(() => {
    if (!carregando) {
      Database.salvarDados(registros);
    }
  }, [registros, carregando]);

  const handleSave = (horasExercicio, horasEstudo, horasCelular) => {
    const exercicioNum = parseFloat(String(horasExercicio).replace(',', '.')) || 0;
    const estudoNum = parseFloat(String(horasEstudo).replace(',', '.')) || 0;
    const celularNum = parseFloat(String(horasCelular).replace(',', '.')) || 0;

    if (exercicioNum < 0 || estudoNum < 0 || celularNum < 0) {
      Alert.alert("Erro de Validação", "Nenhum valor pode ser negativo. Por favor, corrija.");
      return;
    }

    if (editingId) {
      const registrosAtualizados = registros.map(reg =>
        reg.id === editingId
          ? { ...reg, exercicio: exercicioNum, estudo: estudoNum, celular: celularNum } 
          : reg
      );
      setRegistros(registrosAtualizados);
      Alert.alert('Sucesso!', 'Registro atualizado!');
    } else {
      const novoRegistro = {
        id: new Date().getTime(),
        data: new Date().toLocaleDateString('pt-BR'),
        exercicio: exercicioNum,
        estudo: estudoNum,
        celular: celularNum,
      };
      setRegistros([...registros, novoRegistro]);
      Alert.alert('Sucesso!', 'Seu registro foi salvo!');
    }
    setEditingId(null);
  };

  const handleDelete = (id) => {
    setRegistros(registros.filter(reg => reg.id !== id));
    Alert.alert('Sucesso!', 'O registro foi deletado.');
  };

  const handleEdit = (registro) => {
    setEditingId(registro.id);
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const exportarDados = async () => {
      const fileUri = Database.fileUri;
      if (Platform.OS === 'web') {
          const jsonString = JSON.stringify(registros, null, 2);
          if (registros.length === 0) { return Alert.alert("Aviso", "Nenhum dado para exportar."); }
          const blob = new Blob([jsonString], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a'); a.href = url; a.download = 'dados.json'; a.click();
          URL.revokeObjectURL(url);
      } else {
          const fileInfo = await FileSystem.getInfoAsync(fileUri);
          if (!fileInfo.exists) { return Alert.alert("Aviso", "Nenhum dado para exportar."); }
          if (!(await Sharing.isAvailableAsync())) { return Alert.alert("Erro", "Compartilhamento não disponível."); }
          await Sharing.shareAsync(fileUri);
      }
  };

  let registrosExibidos = [...registros];
  if (ordenacao === 'maior_exercicio') {
    registrosExibidos.sort((a, b) => b.exercicio - a.exercicio);
  } else if (ordenacao === 'maior_estudo') {
    registrosExibidos.sort((a, b) => b.estudo - a.estudo);
  } else if (ordenacao === 'maior_celular') {
    registrosExibidos.sort((a, b) => b.celular - a.celular);
  } else {
    registrosExibidos.sort((a, b) => b.id - a.id);
  }

  if (carregando) {
    return <View style={styles.loadingContainer}><ActivityIndicator size="large" color="#4A90E2" /></View>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.titulo}>Minhas Horas do Dia 📊</Text>
        <Text style={styles.subtituloApp}>Acompanhe seu tempo</Text>

        <View style={styles.graficoSelecaoContainer}>
          <Button title="Exercício" onPress={() => setGraficoAtivo('exercicio')} color={graficoAtivo === 'exercicio' ? '#4A90E2' : '#7F8C8D'} />
          <Button title="Estudo" onPress={() => setGraficoAtivo('estudo')} color={graficoAtivo === 'estudo' ? '#4A90E2' : '#7F8C8D'} />
          <Button title="Celular" onPress={() => setGraficoAtivo('celular')} color={graficoAtivo === 'celular' ? '#4A90E2' : '#7F8C8D'} />
        </View>

        <Grafico registros={registrosExibidos} tipoGrafico={graficoAtivo} />

        <Formulario
          onSave={handleSave}
          onCancel={handleCancel}
          registroEmEdicao={registros.find(r => r.id === editingId) || null}
        />

        <View style={styles.ordenacaoContainer}>
          <Button title="Mais Recentes" onPress={() => setOrdenacao('recentes')} color={ordenacao === 'recentes' ? '#4A90E2' : '#7F8C8D'} />
          <Button title="Mais Exercício" onPress={() => setOrdenacao('maior_exercicio')} color={ordenacao === 'maior_exercicio' ? '#4A90E2' : '#7F8C8D'} />
          <Button title="Mais Estudo" onPress={() => setOrdenacao('maior_estudo')} color={ordenacao === 'maior_estudo' ? '#4A90E2' : '#7F8C8D'} />
          <Button title="Mais Celular" onPress={() => setOrdenacao('maior_celular')} color={ordenacao === 'maior_celular' ? '#4A90E2' : '#7F8C8D'} />
        </View>

        <ListaRegistros
          registros={registrosExibidos}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <View style={styles.card}>
            <Text style={styles.subtitulo}>Exportar Dados</Text>
            <TouchableOpacity style={styles.botaoExportar} onPress={exportarDados}>
                <Text style={styles.botaoTexto}>Exportar arquivo dados.json</Text>
            </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    paddingTop: Platform.OS === 'android' ? 25 : 0, 
    backgroundColor: '#F0F4F7', 
  },
  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  titulo: { 
    fontSize: 30, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginVertical: 25, 
    color: '#34495e', 
  },
  subtituloApp: { 
    textAlign: 'center', 
    fontSize: 18, 
    color: '#7F8C8D', 
    marginTop: -15, 
    marginBottom: 25, 
    fontStyle: 'italic' 
  },
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
  subtitulo: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    marginBottom: 18, 
    color: '#34495e' 
  },
  botaoExportar: { 
    backgroundColor: '#2ECC71', 
    padding: 15, 
    borderRadius: 8, 
    alignItems: 'center', 
    marginTop: 10, 
  },
  botaoTexto: { 
    color: 'white', 
    fontSize: 17, 
    fontWeight: 'bold' 
  },
  ordenacaoContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    marginHorizontal: 15, 
    marginBottom: 15, 
    flexWrap: 'wrap', 
    gap: 8, 
  },
  graficoSelecaoContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    marginHorizontal: 15, 
    marginBottom: 15, 
    marginTop: 10, 
    flexWrap: 'wrap', 
    gap: 8, 
  },
});

