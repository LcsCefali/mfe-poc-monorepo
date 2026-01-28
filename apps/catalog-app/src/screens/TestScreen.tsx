import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Button from '~/components/Button';

const TestScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>TestScreen</Text>

      <Button>
        <Button.Title>botão federado</Button.Title>
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16
  },
  text: {
    fontSize: 24,
    color: '#333'
  }
});

export default TestScreen;
