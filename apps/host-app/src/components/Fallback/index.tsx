import { StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface FallbackProps {
  label: string;
}

const Fallback: React.FC<FallbackProps> = ({ label }) => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>{label}</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    color: '#5637DD',
  },
});

export default Fallback;