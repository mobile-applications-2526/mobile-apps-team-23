import MapView, { Marker } from "react-native-maps";
import { useEffect, useRef, useState } from "react";
import { View, Button, StyleSheet } from "react-native";
import * as Location from "expo-location";
import { supabase } from "../utils/supabase";

export default function MapScreen() {
  const [locations, setLocations] = useState<any[]>([]);
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    fetchLocations();
    getUserLocation();
  }, []);

  async function fetchLocations() {
    const { data, error } = await supabase.from("locations").select("*");
    if (!error) setLocations(data);
  }

  async function getUserLocation() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return;

    // haal huidige locatie één keer op
    const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
    setUserLocation(location);

    // map automatisch centreren
    if (mapRef.current) {
      mapRef.current.animateCamera({
        center: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
        zoom: 16,
      });
    }

    // realtime updates volgen
    Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High, distanceInterval: 1 },
      (loc) => setUserLocation(loc)
    );
  }

  function goToUserLocation() {
    if (userLocation && mapRef.current) {
      mapRef.current.animateCamera({
        center: {
          latitude: userLocation.coords.latitude,
          longitude: userLocation.coords.longitude,
        },
        zoom: 16,
      });
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        showsUserLocation
        followsUserLocation={false} // volg alleen als gebruiker op button drukt
      >
        {locations.map((loc) => (
          <Marker
            key={loc.id}
            coordinate={{
              latitude: loc.latitude,
              longitude: loc.longitude,
            }}
            title={loc.name}
          />
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
});
