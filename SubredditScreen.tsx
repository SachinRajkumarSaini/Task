import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Linking
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";

interface Post {
  title: string;
  author: string;
  score: number;
  numComments: number;
  createdUtc: number;
  url: string;
}

enum TabOptions {
  NEW = "new",
  HOT = "hot",
  TOP = "top"
}

const SubredditScreen: React.FC = () => {
  const navigation = useNavigation();
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState(TabOptions.HOT);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchPosts(activeTab);
  }, [activeTab]);

  const fetchPosts = async (tab: TabOptions) => {
    try {
      setRefreshing(true);
      const url = `https://api.reddit.com/r/pics/${tab}.json`;
      const response = await fetch(url);
      const json = await response.json();
      const postsData = json.data.children.map((child: any) => {
        const { title, author, score, num_comments, created_utc, url } =
          child.data;
        return {
          title,
          author,
          score,
          numComments: num_comments,
          createdUtc: created_utc,
          url
        };
      });
      setPosts(postsData);
      setRefreshing(false);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setRefreshing(false);
    }
  };

  const renderPostItem = ({ item, index }: { item: Post; index: number }) => {
    const openLink = () => {
      navigation.navigate("PostWebView", { url: item.url });
    };

    const postKey = `${item.title}-${index}`;

    const timeAgo = moment.unix(item.createdUtc).fromNow();

    return (
      <TouchableOpacity
        style={styles.postContainer}
        onPress={openLink}
        key={postKey}
      >
        <View style={styles.timeView}>
          <Text style={styles.timeText}>{timeAgo}</Text>
        </View>
        <Text style={styles.postTitle}>{item.title}</Text>
        <View style={styles.bottomPostContainer}>
          <Text style={styles.postText}>{item.author}</Text>
          <Text style={styles.postText}>Score: {item.score}</Text>
          <Text style={styles.postText}>{item.score} comments</Text>
        </View>
      </TouchableOpacity>
    );
  };
  const renderTabButton = (tab: TabOptions) => {
    const isActive = tab === activeTab;
    return (
      <TouchableOpacity
        style={isActive ? styles.activeTabButton : styles.tabButton}
        onPress={() => setActiveTab(tab)}
      >
        <Text style={isActive ? styles.activeTabText : styles.tabText}>
          {tab}
        </Text>
      </TouchableOpacity>
    );
  };

  const onRefresh = () => {
    fetchPosts(activeTab);
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        {renderTabButton(TabOptions.NEW)}
        {renderTabButton(TabOptions.HOT)}
        {renderTabButton(TabOptions.TOP)}
      </View>
      <FlatList
        data={posts}
        renderItem={renderPostItem}
        keyExtractor={(item, index) => `${item.title}-${index}`} // Use a unique key combining title and index
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={styles.loadingText}>
            {refreshing ? "Refreshing posts..." : "No posts found."}
          </Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingTop: 16
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 16
  },
  tabContainer: {
    flexDirection: "row",
    marginBottom: 16,
    justifyContent: "space-between"
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#F0F0F0",
    borderRadius: 8
  },
  activeTabButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#007BFF",
    borderRadius: 8
  },
  tabText: {
    color: "#000000",
    fontWeight: "bold"
  },
  activeTabText: {
    color: "#FFFFFF",
    fontWeight: "bold"
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#888888",
    alignSelf: "center"
  },
  postContainer: {
    backgroundColor: "#F0F0F0",
    padding: 16,
    marginBottom: 16,
    borderRadius: 8
  },
  bottomPostContainer: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  postTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
    marginBottom: 8
  },
  postText: {
    color: "#000000"
  },
  timeView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
    marginBottom: 5
  },
  timeText: {
    color: "#000000",
    textAlign: "left"
  }
});

export default SubredditScreen;
