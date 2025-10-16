import * as FileSystem from 'expo-file-system';
import { Alert } from 'react-native';

export const fileUri = FileSystem.documentDirectory + 'dados.json';

export const carregarDados = async () => {
  console.log("Serviço de DB: Carregando dados...");
  try {
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    if (fileInfo.exists) {
      const jsonString = await FileSystem.readAsStringAsync(fileUri, { encoding: 'utf8' });
      return JSON.parse(jsonString); 
    }
  } catch (e) {
    console.error("Erro ao carregar dados:", e);
    Alert.alert("Erro", "Falha ao carregar os dados do arquivo.");
  }
  return []; 
};

export const salvarDados = async (registros) => {
  console.log("Serviço de DB: Salvando dados...");
  try {
    const jsonString = JSON.stringify(registros, null, 2);
    await FileSystem.writeAsStringAsync(fileUri, jsonString, { encoding: 'utf8' });
  } catch (e) {
    console.error("Erro ao salvar dados:", e);
    Alert.alert("Erro", "Falha ao salvar os dados no arquivo.");
  }
};
