import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function Formulario({ onSave, onCancel, registroEmEdicao }) {
  const [horasExercicio, setHorasExercicio] = useState('');
  const [horasEstudo, setHorasEstudo] = useState('');
  const [horasCelular, setHorasCelular] = useState('');

  useEffect(() => {
    if (registroEmEdicao) {
      setHorasExercicio(String(registroEmEdicao.exercicio));
      setHorasEstudo(String(registroEmEdicao.estudo));
      setHorasCelular(String(registroEmEdicao.celular));
    } else {
      setHorasExercicio('');
      setHorasEstudo('');
      setHorasCelular('');
    }
  }, [registroEmEdicao]);

  const handleSaveClick = () => {
    onSave(horasExercicio, horasEstudo, horasCelular);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.subtitulo}>
        {registroEmEdicao ? 'Editando Registro (Update)' : 'Novo Registro (Create)'}
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Horas de exercício"
        keyboardType="numeric"
        value={horasExercicio}
        onChangeText={setHorasExercicio}
      />
      <TextInput
        style={styles.input}
        placeholder="Horas de estudo"
        keyboardType="numeric"
        value={horasEstudo}
        onChangeText={setHorasEstudo}
      />
      <TextInput
        style={styles.input}
        placeholder="Horas no celular"
        keyboardType="numeric"
        value={horasCelular}
        onChangeText={setHorasCelular}
      />

      <TouchableOpacity style={styles.botao} onPress={handleSaveClick}>
        <Text style={styles.botaoTexto}>
          {registroEmEdicao ? 'Atualizar Registro' : 'Gravar no Arquivo'}
        </Text>
      </TouchableOpacity>

      {registroEmEdicao && (
        <TouchableOpacity style={styles.botaoCancelar} onPress={onCancel}>
          <Text style={styles.botaoTexto}>Cancelar Edição</Text>
        </TouchableOpacity>
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
    input: { 
      borderWidth: 1, 
      borderColor: '#CCCCCC', 
      borderRadius: 8, 
      padding: 14, 
      fontSize: 16, 
      marginBottom: 12, 
      color: '#34495e', 
    },
    botao: { 
      backgroundColor: '#4A90E2', 
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
    botaoCancelar: { 
      backgroundColor: '#7F8C8D', 
      padding: 12, 
      borderRadius: 8, 
      alignItems: 'center', 
      marginTop: 10, 
    },
});
