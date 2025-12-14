import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Container } from '../../src/components/Container';
export default function HomeScreen({ navigation }: any) {
  return (
    <Container>
    <View style={styles.container}>
      <Text style={styles.text}>Màn hình chính (Home)</Text>
      <Button 
        title="Đi tới Chi tiết" 
        onPress={() => navigation.navigate('Detail')} 
      />
    </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 20, marginBottom: 20 }
});
