import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { Link, Stack } from "expo-router";
import React from "react";

type Props = {};

const WelcomeScreen = (props: Props) => {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <View style={styles.bottomContainer}>
          <Link href={"/signin"} asChild>
            <TouchableOpacity>
              <Text>Go to SignIn Screen</Text>
            </TouchableOpacity>
          </Link>
          <Link href={"/signup"} asChild>
            <TouchableOpacity>
              <Text>Go to SignUp Screen</Text>
            </TouchableOpacity>
          </Link>
          {/* <Link href={"/(tabs)" as any} asChild>
            <TouchableOpacity>
              <Text>Go to Tabs Index</Text>
            </TouchableOpacity>
          </Link> */}
        </View>
      </View>
    </>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end", // push content to the bottom
  },
  bottomContainer: {
    alignItems: "center", // center horizontally
    paddingBottom: 50, // add bottom padding
  },
  background: {
    flex: 1,
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "flex-end",
  },
});
