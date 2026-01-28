import { type PropsWithChildren } from 'react';
import { StyleSheet, Text } from 'react-native';

const Title: React.FC<PropsWithChildren> = ({ children }) => {
  return <Text style={styles.title}>{children}</Text>;
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF'
  }
});

export default Title;
