import {
  KeyboardAvoidingView,
  Modal,
  StyleProp,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { Button, Input } from "@rneui/themed";
import { useEffect, useState } from "react";
import FriendService from "@/services/FriendService";
import UserService from "@/services/UserService";
import { mutate } from "swr";

export default function AddFriendDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  const [ownCode, setOwnCode] = useState<string | undefined>(undefined);
  const [email, setEmail] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    UserService.getOwnUserinfo().then((userinfo) => {
      setOwnCode(userinfo.user_code);
    });
  }, []);

  const onSendRequest = () => {
    FriendService.sendFriendRequest(email!)
      .then(() => {
        setStatus("Friend request sent!");
      })
      .catch((err) => {
        setStatus(`Error: ${err.message}`);
      });
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
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0,0,0,0.1)",
        }}
        behavior="padding"
      >
        <View
          style={{
            width: "90%",
            backgroundColor: "white",
            borderRadius: 8,
            padding: 16,
            elevation: 5,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
          }}
        >
          <Text style={{ fontSize: 16, marginBottom: 12, fontWeight: "bold" }}>
            Add new friend
          </Text>
          <Input placeholder="Friend's code" onChangeText={setEmail} />
          {status && (
            <Text
              style={{ marginBottom: 12, fontStyle: "italic", color: "gray" }}
            >
              {status}
            </Text>
          )}
          {ownCode && (
            <Text
              style={{ marginBottom: 12, fontStyle: "italic", color: "gray" }}
            >
              Your code: {ownCode}
            </Text>
          )}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Button title="Cancel" type="outline" onPress={onClose} />
            <Button
              title="Send Request"
              containerStyle={{ marginLeft: 8 }}
              onPress={onSendRequest}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
