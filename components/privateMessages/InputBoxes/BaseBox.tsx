import { View } from "react-native";
import { Button, Input } from "@rneui/themed";

export default function BaseBox({
  onButtonPress,
  content,
  setContent,
  iconName,
  autoFocus = false,
}: {
  onButtonPress: () => void;
  content: string;
  setContent: (content: string) => void;
  iconName?: string;
  autoFocus?: boolean;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "flex-end", // Aligns items to the bottom
        padding: 8,
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderTopColor: "#e0e0e0",
        marginHorizontal: 8,
        borderRadius: 20,
      }}
    >
      <Input
        placeholder="Type a message..."
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
          name: iconName ?? "send",
          type: "font-awesome",
          size: 20,
          color: "#2089dc",
        }}
        containerStyle={{ marginLeft: 8, marginBottom: 4 }}
        onPress={onButtonPress}
      />
    </View>
  );
}
