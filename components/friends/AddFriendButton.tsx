import { StyleProp, ViewStyle } from "react-native";
import { Button } from "@rneui/themed";
import { useState } from "react";
import AddFriendDialog from "@/components/dialogs/AddFriendDialog";

export default function AddFriendButton({
  containerStyle,
  buttonStyle,
}: {
  containerStyle?: StyleProp<ViewStyle>;
  buttonStyle?: StyleProp<ViewStyle>;
}) {
  const [addFriendDialogOpen, setAddFriendDialogOpen] = useState(false);

  return (
    <>
      <Button
        containerStyle={containerStyle}
        buttonStyle={buttonStyle}
        title="Add friend"
        onPress={() => setAddFriendDialogOpen(true)}
      />
      <AddFriendDialog
        open={addFriendDialogOpen}
        onClose={() => setAddFriendDialogOpen(false)}
      />
    </>
  );
}
