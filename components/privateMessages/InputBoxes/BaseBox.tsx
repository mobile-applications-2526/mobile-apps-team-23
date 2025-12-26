import { View } from "react-native";
import { Button, Input } from "@rneui/themed";

export default function BaseBox({
  onButtonPress,
  content,
  setContent,
  iconName = "send",
  autoFocus = false,
  allowEmptyContent = false,
  defaultColor = "#2089dc",
  placeholder = "Type a message...",
}: {
  onButtonPress: () => void;
  content: string;
  setContent: (content: string) => void;
  iconName?: string;
  autoFocus?: boolean;
  allowEmptyContent?: boolean;
  defaultColor?: string;
  placeholder?: string;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        padding: 8,
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderTopColor: "#e0e0e0",
        marginHorizontal: 8,
        borderRadius: 20,
      }}
    >
      <Input
        placeholder={placeholder}
        multiline={true}
        renderErrorMessage={false}
        containerStyle={{ flex: 1, paddingHorizontal: 0 }}
        inputContainerStyle={{
          borderBottomWidth: 0,
          minHeight: 40,
          paddingHorizontal: 10,
        }}
        value={content}
        onChangeText={setContent}
        autoFocus={autoFocus}
      />
      <Button
        type="clear"
        icon={{
          name: iconName,
          type: "font-awesome",
          size: 20,
          color:
            !allowEmptyContent && content.trim().length === 0
              ? "#bdbdbd"
              : defaultColor,
        }}
        disabled={!allowEmptyContent && content.trim().length === 0}
        onPress={onButtonPress}
      />
    </View>
  );
}
