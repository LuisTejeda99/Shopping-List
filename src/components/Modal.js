import React from "react";
import { StyleSheet, View, Dimensions, Modal } from "react-native";

export default ({ children, visibility }) => {
  return (
    <Modal animationType="slide" transparent={true} visible={visibility}>
      <View style={styles.center}>
        <View style={styles.modal}>{children}</View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },

  modal: {
    padding: 15,
    backgroundColor: "#fff",
    maxWidth: Dimensions.get("window").width - 50,
    width: Dimensions.get("window").width - 50,
    borderRadius: 4,
    shadowColor: "#000",
    shadowOffset: {
      height: 0,
      width: 3,
    },
  },
});