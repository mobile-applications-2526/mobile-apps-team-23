import { Router } from "expo-router";
import { useState } from "react";
import HomeHeader from "@/components/home/HomeHeader";
import HomeFriendContent from "@/components/home/HomeFriendContent";
import HomeTimelineContent from "@/components/home/HomeTimelineContent";

export enum HomeStatus {
  FRIENDS = "FRIENDS",
  LIVE_MAP = "LIVE_MAP", // Currently unused
  TIMELINE = "TIMELINE",
  SETTINGS = "SETTINGS", // Currently unused
}

export default function HomeContent({ router }: { router: Router }) {
  const [homeStatus, setHomeStatus] = useState<HomeStatus>(HomeStatus.FRIENDS);

  return (
    <>
      <HomeHeader
        router={router}
        homeStatus={homeStatus}
        setHomeStatus={setHomeStatus}
      />
      {homeStatus == HomeStatus.FRIENDS && (
        <HomeFriendContent router={router} />
      )}
      {homeStatus == HomeStatus.TIMELINE && (
        <HomeTimelineContent router={router} />
      )}
    </>
  );
}
