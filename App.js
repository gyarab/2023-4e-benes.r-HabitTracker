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

export default function App() {
  const [tasks, setTasks] = useState([]);
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" options={{ title: "Home" }}>
          {({navigation}) => (<HomeScreen navigation={navigation} tasks={tasks}/>)}
        </Stack.Screen>
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="NewTask">
          {({navigation}) => (<NewTaskScreen navigation={navigation} tasks={tasks} setTasks={setTasks}/>)}
        </Stack.Screen>
        <Stack.Screen name="TaskDetail" component={TaskDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const HomeScreen = ({ navigation, tasks }) => {
  return (
    <ScrollView>
      <Text>Home screen</Text>
      {tasks.map((r, i) => (
        <Task name={r.name} navigation={navigation} key={i}></Task>
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

const NewTaskScreen = ({ navigation, tasks, setTasks }) => {
  const [text, setText] = React.useState("Useless Text");
  return (
    <View style={styles.container}>
      <Text>New Task screen</Text>
      <TextInput
        style={styles.input}
        onChangeText={setText}
        value={text}
      />
      <Button
        title="Save"
        onPress={() => {
          setTasks([...tasks, { name: text }])
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
