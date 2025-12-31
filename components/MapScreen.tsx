import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  Button,
} from "react-native";
import * as Location from "expo-location";
import { supabase } from "@/utils/supabase";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./MapScreen.styles";
import { LocationItem } from "@/types/models";
import FriendService from "../services/FriendService";
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from "./NativeMap";

export default function MapScreen() {
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [userLocation, setUserLocation] =
    useState<Location.LocationObject | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [friendIds, setFriendIds] = useState<string[]>([]);
  const [openMarkerId, setOpenMarkerId] = useState<string | null>(null);
  const [isZoomedIn, setIsZoomedIn] = useState(true);

  const mapRef = useRef<MapView>(null);
  const locationSub = useRef<Location.LocationSubscription | null>(null);
  const markerRefs = useRef<
    Record<string, { showCallout: () => void; hideCallout: () => void } | null>
  >({});
  const suppressNextMarkerPress = useRef(false);

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) return;

      setUserId(data.session.user.id);
      try {
        const friends = await FriendService.getMyFriends();
        setFriendIds(friends.map((f) => f.id!));
      } catch (error) {
        console.error("Failed to fetch friends for map:", error);
      }
      fetchLocations();
      startTracking();
    };

    init();

    return () => {
      locationSub.current?.remove();
    };
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel("locations-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "locations" },
        (payload) => {
          if (!payload.new) return;

          setLocations((prev) => {
            const newLoc = payload.new as LocationItem;
            const existing = prev.find((l) => l.user_id === newLoc.user_id);

            if (existing) {
              return prev.map((l) =>
                l.user_id === newLoc.user_id
                  ? { ...newLoc, userinfo: existing.userinfo }
                  : l,
              );
            }

            return [...prev, newLoc];
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchLocations() {
    const { data, error } = await supabase
      .from("locations")
      .select(
        `
        user_id,
        latitude,
        longitude,
        updated_at,
        userinfo (
          name,
          posts (
            id,
            title,
            description,
            image_url,
            created_at
          )
        )
      `,
      )
      .order("created_at", {
        foreignTable: "userinfo.posts",
        ascending: false,
      })
      .limit(1, { foreignTable: "userinfo.posts" });

    if (error) {
      console.log("Fetch locations error:", error);
      return;
    }

    setLocations(data as LocationItem[]);
  }

  async function startTracking() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return;

    const { data } = await supabase.auth.getUser();
    const user = data.user;
    if (!user) return;

    const initial = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });
    setUserLocation(initial);

    mapRef.current?.animateToRegion(
      {
        latitude: initial.coords.latitude,
        longitude: initial.coords.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      },
      500,
    );

    locationSub.current = await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High, distanceInterval: 5 },
      async (loc) => {
        setUserLocation(loc);
        await supabase.from("locations").upsert({
          user_id: user.id,
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          updated_at: new Date().toISOString(),
        });
      },
    );
  }

  function goToUserLocation() {
    if (!userLocation || !mapRef.current) return;

    mapRef.current.animateToRegion(
      {
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      },
      500,
    );
  }

  function closeOpenPopup() {
    if (openMarkerId) {
      markerRefs.current[openMarkerId]?.hideCallout();
      setOpenMarkerId(null);
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={{ flex: 1 }}
        showsUserLocation
        onPress={closeOpenPopup}
        onRegionChangeComplete={(region) =>
          setIsZoomedIn(region.latitudeDelta <= 0.05)
        }
      >
        {locations
          .filter(
            (loc) => loc.user_id !== userId && friendIds.includes(loc.user_id),
          )
          .map((loc) => {
            const latestPost = loc.userinfo?.posts?.[0];

            return (
              <Marker
                key={`${loc.user_id}-${isZoomedIn}`}
                ref={(ref) => {
                  markerRefs.current[loc.user_id] = ref;
                }}
                coordinate={{
                  latitude: loc.latitude,
                  longitude: loc.longitude,
                }}
                anchor={{ x: 0.5, y: 0.5 }}
                onPress={() => {
                  if (suppressNextMarkerPress.current) {
                    suppressNextMarkerPress.current = false;
                    return;
                  }

                  if (openMarkerId === loc.user_id) {
                    markerRefs.current[loc.user_id]?.hideCallout();
                    setOpenMarkerId(null);
                  } else {
                    if (openMarkerId) {
                      markerRefs.current[openMarkerId]?.hideCallout();
                    }
                    markerRefs.current[loc.user_id]?.showCallout();
                    setOpenMarkerId(loc.user_id);
                  }
                }}
              >
                <View style={styles.friendMarkerContainer}>
                  {isZoomedIn && (
                    <View style={styles.friendNameBubble}>
                      <Text style={styles.friendNameText}>
                        {loc.userinfo?.name ?? "Onbekend"}
                      </Text>
                    </View>
                  )}
                  <View style={styles.friendDotWrapper}>
                    <View style={styles.friendDot} />
                  </View>
                </View>

                <Callout
                  tooltip={Platform.OS === "ios"}
                  onPress={() => {
                    suppressNextMarkerPress.current = true;
                    markerRefs.current[loc.user_id]?.hideCallout();
                    setOpenMarkerId(null);
                  }}
                >
                  <View style={styles.callout}>
                    <Text style={styles.calloutName}>
                      {loc.userinfo?.name ?? "Onbekend"}
                    </Text>

                    {latestPost ? (
                      <>
                        {latestPost.image_url && (
                          <Image
                            source={{ uri: latestPost.image_url }}
                            style={styles.calloutImage}
                          />
                        )}
                        {latestPost.title && (
                          <Text style={styles.calloutTitle}>
                            {latestPost.title}
                          </Text>
                        )}
                        {latestPost.description && (
                          <Text style={styles.calloutDescription}>
                            {latestPost.description}
                          </Text>
                        )}
                      </>
                    ) : (
                      <Text style={styles.calloutDescription}>
                        Geen recente post
                      </Text>
                    )}
                  </View>
                </Callout>
              </Marker>
            );
          })}
      </MapView>

      {/* Modern Floating Action Button */}
      <View style={styles.fabContainer}>
        <TouchableOpacity
          style={styles.fabButton}
          onPress={goToUserLocation}
          activeOpacity={0.8}
        >
          <Ionicons name="location-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      {Platform.OS === "ios" && (
        <View style={styles.buttonContainer}>
          <Button title="My location" onPress={goToUserLocation} />
        </View>
      )}
    </View>
  );
}
