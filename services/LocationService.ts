import * as Location from "expo-location";

type LocationType = { latitude: number; longitude: number } | null;

const getLocationPermissionStatus = async (): Promise<boolean> => {
  const { status } = await Location.getForegroundPermissionsAsync();
  return status === "granted";
};

const requestLocationPermission = async (): Promise<boolean> => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === "granted";
};

const getClientLocation = async (): Promise<LocationType> => {
  try {
    // Ask for location permissions
    const hasPermission = await getLocationPermissionStatus();
    if (!hasPermission) {
      const granted = await requestLocationPermission();
      if (!granted) return null;
    }

    // Try to get the "Last Known" position first (extremely fast and usually works on emulators)
    let location = await Location.getLastKnownPositionAsync();

    // If there is no last known position, request current position
    if (!location) {
      location = await Location.getCurrentPositionAsync({
        // Lowering accuracy slightly helps the emulator return a result faster
        accuracy: Location.Accuracy.Balanced,
      });
    }

    // Return the latitude and longitude
    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  } catch (error) {
    console.error("Error getting location:", error);
    return null;
  }
};

const LocationService = {
  getLocationPermissionStatus,
  requestLocationPermission,
  getClientLocation,
};

export default LocationService;
