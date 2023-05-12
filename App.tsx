import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import SubredditScreen from "./SubredditScreen";
import PostWebViewScreen from "./PostWebViewScreen";

const Stack = createStackNavigator();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Reddit Posts"
          options={{
            headerTitleAlign: "center"
          }}
          component={SubredditScreen}
        />
        <Stack.Screen
          name="PostWebView"
          options={{
            headerTitleAlign: "center"
          }}
          component={PostWebViewScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
