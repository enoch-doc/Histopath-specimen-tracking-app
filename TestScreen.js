import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';

export default function TestScreen() {
  const [text, setText] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Test Input:</Text>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder="Type here"
      />
      <Text style={styles.output}>You typed: {text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: 'black',
    padding: 10,
    fontSize: 16,
    backgroundColor: 'white',
  },
  output: {
    marginTop: 20,
    fontSize: 16,
    color: 'blue',
  },
});