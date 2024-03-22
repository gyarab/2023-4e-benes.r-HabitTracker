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
import { NativeBaseProvider, Select, Input } from "native-base";

const Stack = createNativeStackNavigator();

export default function App() {
  const [habits, setHabits] = useState([]);
  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" options={{ title: "Home" }}>
            {({navigation}) => (<HomeScreen navigation={navigation} habits={habits}/>)}
          </Stack.Screen>
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="NewHabit">
            {({navigation}) => (<NewHabitScreen navigation={navigation} habits={habits} setHabits={setHabits}/>)}
          </Stack.Screen>
          <Stack.Screen name="HabitDetail" component={HabitDetailScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
}

const HomeScreen = ({ navigation, habits }) => {
  return (
    <ScrollView>
      <Text>Home screen</Text>
      {habits.map((r, i) => (
        <Habit name={r.name} navigation={navigation} key={i}></Habit>
      ))}
      <StatusBar style="auto" />
      <Button
        title="Go to profile"
        onPress={() => navigation.navigate("Profile")}
      />
      <Button title="New Habit" onPress={() => navigation.navigate("NewHabit")} />
    </ScrollView>
  );
};

const ProfileScreen = ({ navigation, route }) => {
  return (
    <View style={styles.container}>
      <Text>wot u look'n at, eh?</Text>
      <StatusBar style="auto" />
    </View>
  );
};

const NewHabitScreen = ({ navigation, habits, setHabits }) => {
  const [text, setText] = React.useState("");
  const [inputType, setInputType] = React.useState("");
  const [nejakToRve, setNejakToRve] = React.useState("");

  return (
    <View style={styles.container}>
      <Input
        style={styles.input}
        onChangeText={setText}
        value={text}
        placeholder="Your new habit"
      />
      <Select
        placeholder="Choose input type"
        selectedValue={inputType}
        onValueChange={itemValue => setInputType(itemValue)}>
          <Select.Item label="Amount (hours/kms/...)" value="amount" />
          <Select.Item label="Yes/No (I have/n't done it)" value="yn" />
      </Select>
      <Text>
        Set a goal!
      </Text>
      <Input
        style={styles.input}
        placeholder="amount"
      />
      <Input
        style={styles.input}
        placeholder="of what (hrs/kms/...)"
      />
      <Text>
        per...
      </Text>
      <Select
        placeholder="Day/Week/Month"
        selectedValue={nejakToRve}
        onValueChange={itemValue => setNejakToRve(itemValue)}>
          <Select.Item label="Day"/>
          <Select.Item label="Week"/>
          <Select.Item label="Month"/>
      </Select>
      <Button
        title="Save"
        onPress={() => {
          setHabits([...habits, { name: text }])
          navigation.navigate("Home");
        }}
      />
      <StatusBar style="auto" />
    </View>
  );
};

const HabitDetailScreen = ({ navigation, route }) => {
  const { name } = route.params;
  return (
    <View style={styles.container}>
      <Text>{name}</Text>
      <StatusBar style="auto" />
    </View>
  );
};

const Habit = ({ navigation, route, name }) => {
  return (
    <View>
      <Text>Habit {name}</Text>
      <StatusBar style="auto" />
      <Button
        title="Go to habit detail"
        onPress={() => navigation.navigate("HabitDetail", { name: name })}
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
