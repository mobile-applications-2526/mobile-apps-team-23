import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
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
  buttonContainer: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: "center",
  },
});
