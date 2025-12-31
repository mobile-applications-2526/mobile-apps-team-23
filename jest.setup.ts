import mockAsyncStorage from "@react-native-async-storage/async-storage/jest/async-storage-mock";

jest.mock("@react-native-async-storage/async-storage", () => mockAsyncStorage);

jest.mock("@rneui/themed", () => {
  return {
    __esModule: true,
    Input: (_props: any) => null,
    Button: (_props: any) => null,
  };
});
