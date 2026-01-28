import { Pressable, type PressableProps, StyleSheet } from 'react-native';

import Title from './components/Title';

const Button: React.FC<PressableProps> & { Title: typeof Title } = props => {
  return <Pressable style={styles.container} {...props} />;
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#713951',
    borderRadius: 5
  }
});

Button.Title = Title;

export default Button;
