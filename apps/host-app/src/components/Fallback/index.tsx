import { ActivityIndicator, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface FallbackProps {
  label: string;
}

const Fallback: React.FC<FallbackProps> = ({ label }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ActivityIndicator size='large' />
      <Text style={styles.text}>{label}</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  text: {
    fontSize: 18,
    color: '#333',
  },
});

export default Fallback;