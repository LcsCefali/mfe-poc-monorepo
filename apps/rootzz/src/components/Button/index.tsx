import { PropsWithChildren } from 'react';
import { Pressable, StyleSheet } from 'react-native';

const Button: React.FC<PropsWithChildren> = ({ children }) => {
  return <Pressable style={styles.container}>{children}</Pressable>
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: 'red',
    borderRadius: 5,
  }
})


export default Button;