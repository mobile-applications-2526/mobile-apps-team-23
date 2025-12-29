import MapView, { Marker } from "react-native-maps";
import { useEffect, useRef, useState } from "react";
import { View, Button, StyleSheet, Text } from "react-native";
import * as Location from "expo-location";
import { supabase } from "../utils/supabase";

// TypeScript type voor locatie
type LocationItem = {
  user_id: string;
  latitude: number;
  longitude: number;
  updated_at?: string;
  userinfo?: {
    name?: string;
  };
};

export default function MapScreen() {
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [userLocation, setUserLocation] =
    useState<Location.LocationObject | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const mapRef = useRef<MapView>(null);
  const locationSub = useRef<Location.LocationSubscription | null>(null);

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

          setLocations((prev: LocationItem[]) => {
            const newLoc = payload.new as LocationItem; // cast payload naar LocationItem
            const existing = prev.find((l) => l.user_id === newLoc.user_id);

            if (existing) {
              return prev.map((l) =>
                l.user_id === newLoc.user_id
                  ? { ...newLoc, userinfo: existing.userinfo } // nu is type correct
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
    const { data, error } = await supabase.from("locations").select(`
        user_id,
        latitude,
        longitude,
        updated_at,
        userinfo (
          name
        )
      `);

    if (error) {
      console.log("Fetch locations error:", error);
      return;
    }

    setLocations((data as LocationItem[]) ?? []);
  }

  async function startTracking() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return;

    const { data: authData } = await supabase.auth.getUser();
    const user = authData.user;
    if (!user) return;

    const initial = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });
    setUserLocation(initial);

    mapRef.current?.animateCamera({
      center: {
        latitude: initial.coords.latitude,
        longitude: initial.coords.longitude,
      },
      zoom: 16,
    });

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

  /** Haal locatie op via service */
  async function getUserLocation() {
    try {
      const location = await LocationService.getClientLocation();

      if (
        !location ||
        location.latitude == null ||
        location.longitude == null
      ) {
        setUserLocation(null);
        return;
      }

      const locationObject: Location.LocationObject = {
        coords: {
          latitude: location.latitude,
          longitude: location.longitude,
          altitude: null,
          accuracy: null,
          altitudeAccuracy: null,
          heading: null,
          speed: null,
        },
        timestamp: Date.now(),
        mocked: false,
      };

      setUserLocation(locationObject);
    } catch (err) {
      console.log("Failed to get user location:", err);
    }
  }

  function goToUserLocation() {
    if (!userLocation || !mapRef.current) return;

    mapRef.current.animateCamera({
      center: {
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
      },
      zoom: 16,
    });
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        showsUserLocation
        followsUserLocation={false}
      >
        {locations
          .filter((loc) => loc.user_id !== userId)
          .map((loc) => (
            <Marker
              key={loc.user_id}
              coordinate={{ latitude: loc.latitude, longitude: loc.longitude }}
            >
              <View style={{ alignItems: "center" }}>
                <View style={styles.nameBubble}>
                  <Text style={styles.nameText}>
                    {loc.userinfo?.name ?? "Onbekend"}
                  </Text>
                </View>
                <View style={styles.pin} />
              </View>
            </Marker>
          ))}
      </MapView>

      <View style={styles.buttonContainer}>
        <Button title="Mijn locatie" onPress={goToUserLocation} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 130,
    borderRadius: 8,
    overflow: "hidden",
  },
  nameBubble: {
    backgroundColor: "white",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 4,
    elevation: 2,
  },
  nameText: {
    fontWeight: "600",
    fontSize: 12,
  },
  pin: {
    width: 10,
    height: 10,
    backgroundColor: "red",
    borderRadius: 5,
  },
});
