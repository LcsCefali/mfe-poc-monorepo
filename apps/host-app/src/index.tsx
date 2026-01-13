import { Federated } from '@callstack/repack/client';
import React, { Suspense } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const Button = React.lazy(() => 
  Federated.importModule('rootzz', './Button')
);

const App: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Hello from Microfrontend!</Text>

      <Suspense fallback={<Text>Loading Button...</Text>}>
        <Button>
          <Text>I'm a federated Button component!</Text>
        </Button>
      </Suspense>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ADD8E6'
  },
  welcomeText: {
    fontSize: 24,
    marginBottom: 20,
  },
})

export default App;