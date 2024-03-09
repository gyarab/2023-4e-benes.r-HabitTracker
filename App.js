import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Button,
  TextInput,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useState, useEffect } from "react";

const Stack = createNativeStackNavigator();
var tasks = [
  { name: "ondřejssusamogus" },
  { name: "bainossusamogus" },
  { name: "hrushkasusamogus" },
  { name: "egisusamogus" },
  { name: "fajrususamogus" },
];

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Home" }}
        />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="NewTask" component={NewTaskScreen} />
        <Stack.Screen name="TaskDetail" component={TaskDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const HomeScreen = ({ navigation }) => {
  return (
    <ScrollView>
      <Text>Home screen</Text>
      {tasks.map((r) => (
        <Task name={r.name} navigation={navigation}></Task>
      ))}
      <StatusBar style="auto" />
      <Button
        title="Go to profile"
        onPress={() => navigation.navigate("Profile")}
      />
      <Button title="New Task" onPress={() => navigation.navigate("NewTask")} />
    </ScrollView>
  );
};

const ProfileScreen = ({ navigation, route }) => {
  return (
    <View style={styles.container}>
      <Text>Profile screen</Text>
      <StatusBar style="auto" />
    </View>
  );
};

const NewTaskScreen = ({ navigation, route }) => {
  const [text, onChangeText] = React.useState("Useless Text");
  return (
    <View style={styles.container}>
      <Text>New Task screen</Text>
      <TextInput
        style={styles.input}
        onChangeText={onChangeText}
        value={text}
      />
      <Button
        title="Save"
        onPress={() => {
          tasks.push({ name: name });
          navigation.navigate("Home");
        }}
      />
      <StatusBar style="auto" />
    </View>
  );
};

const TaskDetailScreen = ({ navigation, route }) => {
  const { name } = route.params;
  return (
    <View style={styles.container}>
      <Text>{name}</Text>
      <StatusBar style="auto" />
    </View>
  );
};

const Task = ({ navigation, route, name }) => {
  return (
    <View>
      <Text>Task {name}</Text>
      <StatusBar style="auto" />
      <Button
        title="Go to task detail"
        onPress={() => navigation.navigate("TaskDetail", { name: name })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
