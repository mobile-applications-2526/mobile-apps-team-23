import { View, TouchableOpacity, Text } from "react-native";
import { usePathname, useRouter } from "expo-router";
import { Icon } from "@rneui/themed";
import NavTab from "@/components/navBar/NavTab";

export const TABS = [
  {
    label: "Home",
    route: "/home",
    icon: { name: "users", type: "font-awesome" },
  },
  {
    label: "Map",
    route: "/map",
    icon: { name: "map-marker", type: "font-awesome" },
  },
  {
    label: "Messages",
    route: "/privateMessages",
    icon: { name: "comments", type: "font-awesome" },
  },
  {
    label: "Account",
    route: "/account",
    icon: { name: "user", type: "font-awesome" },
  },
  {
    label: "Settings",
    route: "/settings",
    icon: { name: "cog", type: "font-awesome" },
  },
] as const;

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        paddingVertical: 12,
        paddingBottom: 18,
        borderTopWidth: 0,
        backgroundColor: "#5cceb2", // groene/turquoise achtergrond
      }}
    >
      {TABS.map((tab) => {
        return (
          <NavTab
            key={`${tab.route}-${tab.label}`}
            pathName={pathname}
            router={router}
            tab={tab}
          />
        );
      })}
    </View>
  );
}
