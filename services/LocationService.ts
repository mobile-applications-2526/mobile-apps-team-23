import * as Location from "expo-location";

type LocationType = { latitude: number; longitude: number } | null;

const getLocationPermissionStatus = async (): Promise<boolean> => {
  const { status } = await Location.getForegroundPermissionsAsync();
  return status === "granted";
};

const getClientLocation = async (): Promise<LocationType> => {
  try {
    // Ask for location permissions
    const hasPermission = await getLocationPermissionStatus();
    if (!hasPermission) {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.warn("Location permission not granted.");
        return null;
      }
    }

    // Get the current location
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

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
  getClientLocation,
};

export default LocationService;
