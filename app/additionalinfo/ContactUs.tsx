import { Entypo } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";

const ContactUs = () => {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Entypo name="chevron-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Contact Us</Text>
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.text1}>
          If you have any questions or feedback about PioneerMart, please
          contact us at email@gmail.com.
        </Text>
        <Text style={styles.text2}>
          We'd love to hear from you about how we can improve the app!
        </Text>
      </View>
    </View>
  );
};

export default ContactUs;

const styles = StyleSheet.create({
  container: {
    flex: 1, //container takes up whole screen
    marginHorizontal: 20,
    marginVertical: 12,

    // alignItems: "center",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center", //align items vertically in the center
    // flex: 1,
    // justifyContent: "center",
    marginTop: 30,
  },
  backBtn: {
    marginRight: "auto", //push the back button to the left
    zIndex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    position: "absolute", //position the title without context to its container
    left: 0,
    right: 0,
    textAlign: "center",
    // justifyContent: "center",
    // marginBottom: 20,
  },
  contentContainer: {
    flex: 1, //take up remaining space
    justifyContent: "center",
    alignItems: "center",
  },
  text1: {
    fontSize: 16,
    marginBottom: 20,
  },
  text2: {
    fontSize: 16,
  },
});
