import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleProp,
  ViewStyle,
} from "react-native";
import { ReactNode } from "react";
import { Icon } from "@rneui/themed";
import { HEADER_HEIGHT } from "@/constants/ui";

export default function BaseDialog({
  open,
  onClose,
  children,
  closeOnBackdropPress = false,
  customDialogStyle,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  closeOnBackdropPress?: boolean;
  customDialogStyle?: StyleProp<ViewStyle>;
}) {
  const handleBackdropPress = () => {
    if (closeOnBackdropPress) {
      onClose();
    }
  };

  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={HEADER_HEIGHT}
      >
        <Pressable
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.1)",
          }}
          onPress={handleBackdropPress}
          android_disableSound
        >
          <Pressable
            onPress={(e) => e.stopPropagation()} // Prevents closing when clicking inside the dialog
            style={[
              {
                width: "90%",
                backgroundColor: "white",
                borderRadius: 8,
                padding: 16,
                elevation: 5,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                position: "relative",
              },
              customDialogStyle, // Apply and override with custom styles if provided
            ]}
            android_disableSound
          >
            {children}
            <Icon
              type="font-awesome"
              name="close"
              size={22}
              color="#333"
              onPress={onClose}
              containerStyle={{
                position: "absolute",
                top: 12,
                right: 12,
                zIndex: 99,
              }}
              accessibilityLabel="Close"
              accessibilityRole="button"
            />
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}
