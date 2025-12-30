import MapView, { Marker, Callout, PROVIDER_GOOGLE } from "react-native-maps";
import { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import * as Location from "expo-location";
import { supabase } from "../utils/supabase";
import { Ionicons } from "@expo/vector-icons";

type LocationItem = {
  user_id: string;
  latitude: number;
  longitude: number;
  updated_at?: string;
  userinfo?: {
    name?: string;
    posts?: {
      id: number;
      title: string | null;
      description: string | null;
      image_url: string | null;
      created_at: string;
    }[];
  };
};

export default function MapScreen() {
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [userLocation, setUserLocation] =
    useState<Location.LocationObject | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [openMarkerId, setOpenMarkerId] = useState<string | null>(null);
  const [isZoomedIn, setIsZoomedIn] = useState(true);

  const mapRef = useRef<MapView>(null);
  const locationSub = useRef<Location.LocationSubscription | null>(null);
  const markerRefs = useRef<Record<string, Marker | null>>({});
  const suppressNextMarkerPress = useRef(false);

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) return;

      setUserId(data.session.user.id);
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
                  : l
              );
            }

            return [...prev, newLoc];
          });
        }
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
      `
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
      500
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
      }
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
      500
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
          .filter((loc) => loc.user_id !== userId)
          .map((loc) => {
            const latestPost = loc.userinfo?.posts?.[0];

            return (
              <Marker
                key={`${loc.user_id}-${isZoomedIn}`}
                ref={(ref) => (markerRefs.current[loc.user_id] = ref)}
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
                  tooltip
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

const styles = StyleSheet.create({
  fabContainer: {
    position: "absolute",
    bottom: 30,
    right: 20,
    elevation: 6,
  },
  fabButton: {
    backgroundColor: "#2ecc71",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },

  friendMarkerContainer: {
    alignItems: "center",
    elevation: 4,
  },
  friendNameBubble: {
    backgroundColor: "rgba(255,255,255,0.95)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  friendNameText: {
    fontSize: 13,
    fontWeight: "600",
  },
  friendDotWrapper: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
  friendDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#2ecc71",
  },

  callout: {
    width: 240,
    backgroundColor: "white",
    padding: 14,
    borderRadius: 16,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  calloutName: {
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 6,
  },
  calloutTitle: {
    fontWeight: "600",
    marginBottom: 4,
    fontSize: 14,
  },
  calloutDescription: {
    fontSize: 13,
    color: "#555",
  },
  calloutImage: {
    width: "100%",
    height: 120,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: "#eee",
  },
});
