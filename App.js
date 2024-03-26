import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, ScrollView, Button, Modal, TextInput } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { NativeBaseProvider, Select, Input } from "native-base";
import { VictoryBar, VictoryChart, VictoryLine, VictoryAxis } from 'victory';
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
          navigation.navigate("Home" , { goalAmount: inputs.amount });
        }}
      />
      <StatusBar style="auto" />
    </View>
  );
};

const HabitDetailScreen = ({ navigation, route, zmena, setZmena }) => {
  let dataChart = [];
  const { name, goalAmount } = route.params
  for (const [key, value] of Object.entries(data.habity[name].data)) {
    dataChart.push({day: key, value: value})
  }
  console.log(dataChart);
  let delka = 1
  const [inputValue, setInputValue] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleAddData = () => {
    if (inputValue.trim() === "") return; 

    const today = new Date().toISOString().split("T")[0];

    data.habity[name].data[today] = (data.habity[name].data[today] || 0) + parseInt(inputValue);
    data.save();
    
    setZmena(!zmena);

    setIsModalVisible(false);
  };

  switch (data.habity[name].dayWeekMonth) {
    case "day": 
      delka = 7;
      break;
    case "week":
      delka = 8;
      break;
    case "month":
      delka = 12;
      break;
  }
  return (
    <View style={styles.container}>
      <VictoryChart domainPadding={20}>
        <VictoryAxis
          tickValues={Array.from({ length: delka }, (_, i) => i)}
          tickFormat={(x) => (`${x < dataChart.length ? dataChart[x]["day"] : ""}`)}
        />
        <VictoryAxis
          dependentAxis
          tickFormat={(y) => (`${y} ${data.habity[name].ofWhat}`)}
        />
        <VictoryBar
          data={dataChart}
          barRatio={0.8}
          style={{
            data: { fill: "#c43a31" }
          }}
          x="day"
          y="value"
        />
        <VictoryLine
          data={[{ x: 0, y: goalAmount }, { x: delka - 1, y: goalAmount }]}
          style={{ data: { stroke: "blue", strokeWidth: 2 } }}
        />
      </VictoryChart>
      <Button title="Add Data" onPress={() => setIsModalVisible(true)} />
      <Button
        title="Delete Habit"
        onPress={() => {
          data.del(name);
          setZmena(!zmena)
          navigation.navigate("Home");
        }}
      />
      <Modal visible={isModalVisible} onRequestClose={() => setIsModalVisible(false)} animationType="slide">
        <View style={styles.modalContainer}>
          <Text>Enter data for today:</Text>
          <TextInput
            style={styles.input}
            value={inputValue}
            onChangeText={setInputValue}
            placeholder="Enter data..."
          />
          <Button title="Add" onPress={handleAddData} />
          <Button title="Cancel" onPress={() => setIsModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
};

const Habit = ({ navigation, name }) => {
  return (
    <View>
      <StatusBar style="auto" />
      <Button
        title={name}
        onPress={() => navigation.navigate("HabitDetail", { name: name,
          goalAmount: data.habity[name].amount
        })}
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
