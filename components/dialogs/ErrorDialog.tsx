import {
  KeyboardAvoidingView,
  Modal,
  Text,
  View,
  Pressable,
  Platform,
  StyleSheet,
} from "react-native";

export default function ErrorDialog({
  errorMessage,
  open,
  onClose,
}: {
  errorMessage: string;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Pressable style={styles.backdrop} onPress={onClose}>
          <Pressable style={styles.dialog} onPress={() => {}}>
            <View style={styles.header}>
              <Text style={styles.icon}>⚠️</Text>
              <Text style={styles.title}>An Error Occurred</Text>
              <Pressable
                onPress={onClose}
                style={({ pressed }) => [
                  styles.closeButton,
                  pressed && styles.closeButtonPressed,
                ]}
                android_ripple={{ color: "#ddd", radius: 20 }}
                accessibilityLabel="Close"
                accessibilityRole="button"
              >
                <Text style={styles.closeText}>✖️</Text>
              </Pressable>
            </View>
            <Text style={styles.message}>{errorMessage}</Text>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.1)",
    width: "100%",
  },
  dialog: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  icon: { fontSize: 24, marginRight: 8 },
  title: { fontSize: 20, fontWeight: "bold" },
  closeButton: {
    marginLeft: "auto",
    padding: 4,
    borderRadius: 16,
  },
  closeButtonPressed: {
    opacity: 0.7,
  },
  closeText: { fontSize: 16 },
  message: {
    marginBottom: 12,
    fontStyle: "italic",
    color: "gray",
    fontSize: 16,
  },
});
