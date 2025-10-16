import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function ListaRegistros({ registros, onEdit, onDelete }) {
  return (
    <View style={styles.card}>
      <Text style={styles.subtitulo}>Registros Salvos (Read, Update, Delete)</Text>
      {registros.length > 0 ? (
        [...registros].reverse().map(reg => (
          <View key={reg.id} style={styles.itemHistorico}>
            <Text style={styles.itemTexto}>
              {reg.data ? `${reg.data} - ` : ''}Exercício: {reg.exercicio}h, Estudo: {reg.estudo}h, Celular: {reg.celular}h
            </Text>
            <View style={styles.botoesAcao}>
              <TouchableOpacity style={styles.botaoEditar} onPress={() => onEdit(reg)}>
                <Text style={styles.botaoTextoAcao}>✎</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.botaoDelete} onPress={() => onDelete(reg.id)}>
                <Text style={styles.botaoTextoAcao}>X</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      ) : (
        <Text style={styles.itemTexto}>Nenhum registro encontrado.</Text>
      )}
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
    subtitulo: { 
      fontSize: 22, 
      fontWeight: 'bold', 
      marginBottom: 18, 
      color: '#34495e' 
    },
    itemHistorico: { 
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      paddingVertical: 12, 
      borderBottomWidth: 1, 
      borderColor: '#F0F4F7', 
    },
    itemTexto: { 
      fontSize: 16, 
      color: '#34495e', 
      flex: 1, 
      marginRight: 10, 
    },
    botoesAcao: { 
      flexDirection: 'row', 
      gap: 8, 
    },
    botaoEditar: { 
      backgroundColor: '#F39C12', 
      borderRadius: 18, 
      width: 36, 
      height: 36, 
      justifyContent: 'center', 
      alignItems: 'center', 
    },
    botaoDelete: { 
      backgroundColor: '#E74C3C', 
      borderRadius: 18, 
      width: 36, 
      height: 36, 
      justifyContent: 'center', 
      alignItems: 'center' 
    },
    botaoTextoAcao: { 
      color: 'white', 
      fontWeight: 'bold', 
      fontSize: 18, 
    },
});


