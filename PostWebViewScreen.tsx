import React from "react";
import { View, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

interface PostWebViewScreenProps {
  route: {
    params: {
      url: string;
    };
  };
}

const PostWebViewScreen: React.FC<PostWebViewScreenProps> = ({ route }) => {
  const { url } = route.params;

  return (
    <View style={styles.container}>
      <WebView source={{ uri: url }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default PostWebViewScreen;
