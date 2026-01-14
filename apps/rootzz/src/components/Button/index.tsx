import { Pressable, PressableProps, StyleSheet } from 'react-native';

const Button: React.FC<PressableProps> = (props) => {
  return <Pressable style={styles.container} {...props} />
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: 'red',
    borderRadius: 5,
  }
})


export default Button;