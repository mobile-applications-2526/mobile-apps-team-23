import FriendList from "@/components/friends/FriendList";
import FriendRequestList from "@/components/friends/FriendRequestList";
import { SafeAreaView, ScrollView, View } from "react-native";
import AddFriendButton from "@/components/friends/AddFriendButton";
import LogoutButton from "@/components/LogoutButton";
import { Router } from "expo-router";
import { useState } from "react";
import { Button } from "@rneui/themed";
import PostsList from "@/components/timeline/PostsList";
import PostCreateButton from "@/components/timeline/PostCreateButton";

export default function HomeContent({ router }: { router: Router }) {
  const [isTimeline, setIsTimeline] = useState(false);

  return (
    <>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 12,
        }}
      >
        <Button
          title="Friends"
          type={isTimeline ? "outline" : "solid"}
          onPress={() => setIsTimeline(false)}
          containerStyle={{ flex: 1, marginRight: 6 }}
          buttonStyle={{ borderRadius: 12 }}
          icon={{
            name: "users",
            type: "font-awesome",
            color: isTimeline ? "#2089dc" : "#ffffff",
          }}
        />
        <Button
          title="Timeline"
          type={isTimeline ? "solid" : "outline"}
          onPress={() => setIsTimeline(true)}
          containerStyle={{ flex: 1, marginLeft: 6 }}
          buttonStyle={{ borderRadius: 12 }}
          icon={{
            name: "comments",
            type: "font-awesome",
            color: isTimeline ? "#ffffff" : "#2089dc",
          }}
        />
      </View>

      {!isTimeline && (
        <ScrollView>
          <FriendList router={router} />
          <FriendRequestList style={{ marginTop: 12 }} />
          <View style={{ flexDirection: "row", marginTop: 12 }}>
            <View style={{ flex: 1, marginRight: 12 }}>
              <AddFriendButton buttonStyle={{ borderRadius: 12 }} />
            </View>
            <View style={{ flex: 1 }}>
              <LogoutButton buttonStyle={{ borderRadius: 12 }} />
            </View>
          </View>
        </ScrollView>
      )}
      {isTimeline && (
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView
            style={{
              flex: 1,
            }}
            contentContainerStyle={{ flexGrow: 1 }}
          >
            <PostsList />
          </ScrollView>
          <PostCreateButton
            router={router}
            containerStyle={{ marginTop: 12 }}
            buttonStyle={{ borderRadius: 12 }}
          />
        </SafeAreaView>
      )}
    </>
  );
}
