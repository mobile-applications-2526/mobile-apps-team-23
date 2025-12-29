import { Router } from "expo-router";
import { useState } from "react";
import HomeHeader from "@/components/home/HomeHeader";
import HomeFriendContent from "@/components/home/content/HomeFriendContent";
import HomeTimelineContent from "@/components/home/content/HomeTimelineContent";
import HomeMapContent from "@/components/home/content/HomeMapContent";

export enum HomeStatus {
  FRIENDS = "FRIENDS",
  LIVE_MAP = "LIVE_MAP",
  TIMELINE = "TIMELINE",
  SETTINGS = "SETTINGS", // Currently unused
  LOGOUT = "LOGOUT",
}

export default function HomeContent({ router }: { router: Router }) {
  const [homeStatus, setHomeStatus] = useState<HomeStatus>(HomeStatus.FRIENDS);

  return (
    <>
      <HomeHeader homeStatus={homeStatus} setHomeStatus={setHomeStatus} />
      {homeStatus == HomeStatus.FRIENDS && (
        <HomeFriendContent router={router} />
      )}
      {homeStatus == HomeStatus.LIVE_MAP && <HomeMapContent />}
      {homeStatus == HomeStatus.TIMELINE && (
        <HomeTimelineContent router={router} />
      )}
    </>
  );
}
