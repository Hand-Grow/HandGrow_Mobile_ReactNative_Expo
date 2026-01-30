import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { Container } from "../components/common/Container";
export default function DetailScreen({ navigation }: any) {
  return (
    <Container>
      <View style={styles.container}>
        <Text style={styles.text}>Đây là màn hình Chi tiết</Text>
        <Button title="Quay lại" onPress={() => navigation.goBack()} />
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e0f7fa",
  },
  text: { fontSize: 20, marginBottom: 20 },
});
