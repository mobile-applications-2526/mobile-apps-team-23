import { KeyboardAvoidingView, Modal, Text, View } from "react-native";
import { Button, Input } from "@rneui/themed";
import { useEffect, useState } from "react";
import FriendService from "@/services/FriendService";
import UserService from "@/services/UserService";
import * as Clipboard from "expo-clipboard";
import BaseDialog from "@/components/dialogs/BaseDialog";

export default function AddFriendDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [ownCode, setOwnCode] = useState<string | undefined>(undefined);
  const [friendCode, setFriendCode] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    UserService.getOwnUserinfo().then((userinfo) => {
      setOwnCode(userinfo.user_code);
    });
  }, []);

  const onSendRequest = () => {
    if (!friendCode || friendCode.trim() === "") {
      setStatus("Please enter a friend code.");
      return;
    }

    FriendService.sendFriendRequest(friendCode!)
      .then(() => {
        setStatus("Friend request sent!");
      })
      .catch((err) => {
        setStatus(`Error: ${err.message}`);
      });
  };

  return (
    <BaseDialog
      open={open}
      onClose={() => {
        setStatus(null);
        setFriendCode(null);
        onClose();
      }}
    >
      <Text style={{ fontSize: 16, marginBottom: 12, fontWeight: "bold" }}>
        Add new friend
      </Text>
      <Input
        placeholder="Friend's code"
        value={friendCode ?? ""}
        onChangeText={setFriendCode}
      />
      {status && (
        <Text style={{ marginBottom: 12, fontStyle: "italic", color: "gray" }}>
          {status}
        </Text>
      )}
      {ownCode && (
        <Text
          style={{ marginBottom: 12, fontStyle: "italic", color: "gray" }}
          onPress={() => {
            Clipboard.setStringAsync(ownCode)
              .then(() => {
                setStatus("Code copied");
              })
              .catch(() => {
                setStatus("Copy failed");
              });
            setTimeout(() => setStatus(null), 3000);
          }}
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
    </BaseDialog>
  );
}
