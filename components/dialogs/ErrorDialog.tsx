import { Text, View } from "react-native";
import BaseDialog from "@/components/dialogs/BaseDialog";

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
    <BaseDialog open={open} onClose={onClose} closeOnBackdropPress>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <Text style={{ fontSize: 24, marginRight: 8 }}>⚠️</Text>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
          An Error Occurred
        </Text>
      </View>
      <Text
        style={{
          marginBottom: 12,
          fontStyle: "italic",
          color: "gray",
          fontSize: 16,
        }}
      >
        {errorMessage}
      </Text>
    </BaseDialog>
  );
}
