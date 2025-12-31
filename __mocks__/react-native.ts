import React from "react";

export const View = (props: any) => <div {...props} />;
export const Text = (props: any) => <span {...props} />;
export const TouchableOpacity = (props: any) => <button {...props} />;
export const SafeAreaView = View;
export const ScrollView = View;
export const FlatList = (props: any) => <div {...props} />;
export const Image = (props: any) => <img {...props} />;
export const Button = (props: any) => <button {...props} />;
export const KeyboardAvoidingView = View;
export const Platform = { OS: "web" };
