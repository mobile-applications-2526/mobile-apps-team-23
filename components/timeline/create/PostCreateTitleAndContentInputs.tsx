import { TextInput, View } from "react-native";

export default function PostCreateTitleAndContentInputs({
  setTitle,
  setContent,
  textInputStyle,
}: {
  setTitle: (title: string) => void;
  setContent: (content: string) => void;
  textInputStyle?: object;
}) {
  return (
    <View style={{ flex: 1, marginBottom: 12 }}>
      <TextInput
        placeholder="Title"
        placeholderTextColor="#888"
        style={[
          textInputStyle,
          {
            marginBottom: 12,
            height: 48,
            fontSize: 18,
          },
        ]}
        onChangeText={(title) => setTitle(title)}
      />

      <TextInput
        placeholder="What's on your mind?"
        placeholderTextColor="#888"
        multiline
        scrollEnabled
        style={[
          textInputStyle,
          {
            minHeight: 100,
            flex: 1,
            textAlignVertical: "top",
            fontSize: 16,
          },
        ]}
        onChangeText={(content) => setContent(content)}
      />
    </View>
  );
}
