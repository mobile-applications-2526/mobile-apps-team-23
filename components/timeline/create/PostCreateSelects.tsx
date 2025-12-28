import {
  StyleProp,
  Switch,
  Text,
  TextInput,
  TextStyle,
  View,
} from "react-native";

export default function PostCreateSelects({
  isImageEnabled,
  onSwitchImageToggle,
  isLocationEnabled,
  onSetLocationToggle,
  setImageUrl,
  textInputStyle,
}: {
  isImageEnabled: boolean;
  onSwitchImageToggle: (value: boolean) => void;
  isLocationEnabled: boolean;
  onSetLocationToggle: (enabled: boolean) => void;
  setImageUrl: (imageUrl: string) => void;
  textInputStyle?: StyleProp<TextStyle>;
}) {
  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 12,
          height: 40,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            marginRight: 8,
            alignSelf: "center",
          }}
        >
          Set Location?
        </Text>
        <Switch
          value={isLocationEnabled}
          onValueChange={onSetLocationToggle}
          style={{ alignSelf: "center" }}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 12,
          height: 40,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            marginRight: 8,
            alignSelf: "center",
          }}
        >
          Image?
        </Text>
        <Switch
          value={isImageEnabled}
          onValueChange={onSwitchImageToggle}
          style={{ alignSelf: "center" }}
        />
        {isImageEnabled && (
          <TextInput
            placeholder="Image URL"
            placeholderTextColor="#888"
            style={[
              textInputStyle,
              {
                height: 40,
                marginLeft: 12,
                flex: 1,
                alignSelf: "center",
                fontSize: 14,
              },
            ]}
            onChangeText={(imageUrl) => setImageUrl(imageUrl)}
          />
        )}
      </View>
    </View>
  );
}
