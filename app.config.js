export default ({ config }) => {
  return {
    ...config,
    android: {
      ...config.android,
      config: {
        // NOTE: The Google Maps API key must be provided via the EXPO_PUBLIC_GOOGLE_MAPS_API_KEY
        // environment variable (for example from a .env file or CI secret). Make sure this
        // variable is documented for other developers, e.g. in a README or .env.example file.
        googleMaps: {
          apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
        },
      },
    },
  };
};
