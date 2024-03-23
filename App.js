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
  const [newHabitName, setNewHabitName] = React.useState("");
  const [inputType, setInputType] = React.useState("");
  const [inputs, setInputs] = React.useState({
    amount: "",
    ofWhat: "",
    dayWeekMonth: ""
  });

  const handleChange = (name, value) => {
    setInputs(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const renderInputComponent = () => {
    switch (inputType) {
      case 'amount':
        return <AmountInput inputs={inputs} handleChange={handleChange} />;
      case 'yn':
        return <YesNoInput inputs={inputs} handleChange={handleChange} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Input
        style={styles.input}
        onChangeText={setNewHabitName}
        value={newHabitName}
        placeholder="Your new habit"
      />
      <Select
        placeholder="Choose input type"
        selectedValue={inputType}
        onValueChange={itemValue => setInputType(itemValue)}>
          <Select.Item label="Amount" value="amount" />
          <Select.Item label="Yes/No" value="yn" />
      </Select>
      <Text>
        Set a goal!
      </Text>

      {renderInputComponent()}

      <Button
        title="Save"
        onPress={() => {
          setHabits([...habits, { name: newHabitName }]);
          navigation.navigate("Home");
        }}
      />
      <StatusBar style="auto" />
    </View>
  );
};

const AmountInput = ({ inputs, handleChange }) => (
  <View>
    <Input
      style={styles.input}
      placeholder="Amount"
      onChangeText={value => handleChange('amount', value)}
      value={inputs.amount}
    />
    <Input
      style={styles.input}
      placeholder="Of what"
      onChangeText={value => handleChange('ofWhat', value)}
      value={inputs.ofWhat}
    />
    <Select
      placeholder="How often?"
      selectedValue={inputs.dayWeekMonth}
      onValueChange={itemValue => handleChange('dayWeekMonth', itemValue)}>
        <Select.Item label="Per day" value="day" />
        <Select.Item label="Per week" value="week" />
        <Select.Item label="Per month" value="month" />
    </Select>
  </View>
);

const YesNoInput = ({ inputs, handleChange }) => (
  <View>
    <Input
      style={styles.input}
      placeholder="Amount"
      onChangeText={value => handleChange('amount', value)}
      value={inputs.amount}
    />
    <Text>
      times
    </Text>
    <Select
      placeholder="How often?"
      selectedValue={inputs.dayWeekMonth}
      onValueChange={itemValue => handleChange('dayWeekMonth', itemValue)}>
        <Select.Item label="Per day" value="day" />
        <Select.Item label="Per week" value="week" />
        <Select.Item label="Per month" value="month" />
    </Select>
  </View>
);

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
