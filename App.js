import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, ScrollView, Button } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { NativeBaseProvider, Select, Input } from "native-base";
import { VictoryBar, VictoryChart, VictoryAxis } from 'victory';
const Stack = createNativeStackNavigator();

class Data {
  habity = {}

  add(name, amount, ofWhat, dayWeekMonth) {
    this.habity[name] = {
      amount: amount,
      ofWhat: ofWhat,
      dayWeekMonth: dayWeekMonth,
      data: {}
    }
    this.save()
  }
  del(jmeno) {
    delete this.habity[jmeno]
    this.save()
  }
  save() {
    localStorage.setItem("data", JSON.stringify(data.habity))
  }
  load() {
    let local = localStorage.getItem("data")
    if (local != undefined) {
      this.habity = JSON.parse(local)
    }
  }
}

const data = new Data();

export default function App() {
  let [zmena, setZmena] = useState(false)
  data.load()
  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" options={{ title: "Home" }}>
            {({ navigation }) => (<HomeScreen navigation={navigation} zmena={zmena} setZmena={setZmena} />)}
          </Stack.Screen>
          <Stack.Screen name="NewHabit">
            {({ navigation }) => (<NewHabitScreen navigation={navigation} zmena={zmena} setZmena={setZmena} />)}
          </Stack.Screen>
          <Stack.Screen name="HabitDetail" >
            {( props ) => (<HabitDetailScreen {...props} zmena={zmena} setZmena={setZmena} />)}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
}

const HomeScreen = ({ navigation, zmena, setZmena }) => {
  return (
    <ScrollView>
      {Object.keys(data.habity).map((r, i) => (
        <Habit name={r} navigation={navigation} key={i}></Habit>
      ))}
      <StatusBar style="auto" />
      <Button title="----------New Habit----------" onPress={() => navigation.navigate("NewHabit")} />
    </ScrollView>
  );
};

const NewHabitScreen = ({ navigation, zmena, setZmena }) => {
  const [inputs, setInputs] = React.useState({
    name: "",
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

  return (
    <View style={styles.container}>
      <Input
        style={styles.input}
        onChangeText={value => handleChange('name', value)}
        value={inputs.name}
        placeholder="Your new habit"
      />
      <Text>
        Set a goal!
      </Text>
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
      <Button
        title="Save"
        onPress={() => {
          data.add(inputs.name, inputs.amount, inputs.ofWhat, inputs.dayWeekMonth)
          setZmena(!zmena)
          navigation.navigate("Home");
        }}
      />
      <StatusBar style="auto" />
    </View>
  );
};

const HabitDetailScreen = ({ navigation, route, zmena, setZmena }) => {
  const { name } = route.params
  const dataChart = []
  for (const [key, value] of Object.entries(data.habity[name].data)) {
    dataChart.push({day: key, value: value})
  }
  let delka = 1
  switch (data.habity[name].dayWeekMonth) {
    case "day": 
      delka = 7;
      break;
    case "week":
      delka = 8;
      break;
    case "month":
      delka = 6;
      break;
  }
  return (
    <View style={styles.container}>
      <VictoryChart domainPadding={20}>
        <VictoryAxis
          tickValues={Array.from({ length: delka }, (_, i) => i)}
          tickFormat={(x) => (`${dataChart.length - 1 < x ? "" : dataChart[x]["day"]}`)}
        />
        <VictoryAxis
          dependentAxis
          tickFormat={(y) => (`${y} ${data.habity[name].ofWhat}`)}
        />
        <VictoryBar
          data={dataChart}
          x="quarter"
          y="earnings"
        />
      </VictoryChart>
    </View>
  );
};

const Habit = ({ navigation, route, name }) => {
  return (
    <View>
      <StatusBar style="auto" />
      <Button
        title={name}
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
