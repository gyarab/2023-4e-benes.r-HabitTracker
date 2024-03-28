import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, ScrollView, Button, Modal, TextInput, TouchableOpacity } from "react-native";
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
    <View style={styles.container}>
      <ScrollView>
        {Object.keys(data.habity).map((r, i) => (
          <Habit name={r} navigation={navigation} key={i}></Habit>
        ))}
        <StatusBar style="auto" />
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("NewHabit")}
        >
          <Text style={styles.buttonText}>Add Habit!</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
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
      <View style={styles.slightPadding}>
        <Input
          style={styles.newHabitForm}
          onChangeText={value => handleChange('name', value)}
          value={inputs.name}
          placeholder="Your new habit"
        />
      </View>
      <View style={styles.slightPadding}>
        <Text style={styles.setGoalText}>
          Set a goal!
        </Text>
      </View>
      <View style={styles.slightPadding}>
        <Input
          style={styles.newHabitForm}
          placeholder="Amount"
          onChangeText={value => handleChange('amount', value)}
          value={inputs.amount}
        />
      </View>
      <View style={styles.slightPadding}>
        <Input
          style={styles.newHabitForm}
          placeholder="Of what"
          onChangeText={value => handleChange('ofWhat', value)}
          value={inputs.ofWhat}
        />
      </View>
      <View style={styles.moreSlightPadding}>
        <Select
          placeholder="How often?"
          style={styles.newHabitFormSelect}
          selectedValue={inputs.dayWeekMonth}
          onValueChange={itemValue => handleChange('dayWeekMonth', itemValue)}>
          <Select.Item label="Per day" value="day" />
          <Select.Item label="Per week" value="week" />
          <Select.Item label="Per month" value="month" />
        </Select>
      </View>
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
  const { name, goalAmount } = route.params;
  let dataChart = [];
  for (const [key, value] of Object.entries(data.habity[name].data)) {
    dataChart.push({ day: key, value: value });
  }

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

  let delka = 1;
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
          tickFormat={(x) => (x < dataChart.length ? dataChart[x]["day"] : "")}
        />
        <VictoryAxis dependentAxis tickFormat={(y) => (`${y} ${data.habity[name].ofWhat}`)} />
        <VictoryBar
          cornerRadius={{ 
            topLeft: 5,
            topRight: 5
          }}
          data={dataChart}
          style={{
            data: { fill: "#8c8c8c" }
          }}
          x="day"
          y="value"
        />
        {/* Adding the VictoryLine for the goal amount */}
        <VictoryLine
          y={() => goalAmount}
          style={{
            data: { stroke: "green", strokeWidth: 2, strokeDasharray: "5, 2" },
          }}
        />
      </VictoryChart>
      <View style={styles.buttonContainer}> 
        <TouchableOpacity style={styles.addDataButton} onPress={() => setIsModalVisible(true)}>
          <Text style={styles.buttonText}>Add Data</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={() => {data.del(name); setZmena(!zmena); navigation.navigate("Home");}}>
          <Text style={styles.buttonText}>Delete Habit</Text>
        </TouchableOpacity>
      </View>
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
      <TouchableOpacity
        style={styles.habit}
        onPress={() => navigation.navigate("HabitDetail", { name: name,
          goalAmount: data.habity[name].amount
        })}
      >
        <Text style={styles.habitButtonText}>{name}</Text>
      </TouchableOpacity>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "fff",
    alignItems: "center",
    justifyContent: "center",
  },
  habit: {
    width: 700, 
    backgroundColor: "#dcdde0", 
    borderRadius: 4, 
    marginTop: 20, 
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  button: {
    width: 700, 
    backgroundColor: "#02b526", 
    borderRadius: 4, 
    marginTop: 20, 
    paddingVertical: 12, 
    paddingHorizontal: 20, 
  },
  addDataButton: {
    width: 250, 
    borderColor: "#8c8c8c", 
    borderWidth: 2,
    borderRadius: 100, 
    marginTop: -100, 
    marginRight: 5,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  deleteButton: {
    width: 250, 
    borderColor: "#e30000",
    borderWidth: 2,
    borderRadius: 100,
    marginTop: -100,
    marginLeft: 5,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  habitButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#5c5c5c",
    textAlign: "center",
    fontFamily: "Courier New"
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold", 
    color: "#ff",
    textAlign: "center",
    fontFamily: "Courier New"
  },
  setGoalText: {
    fontSize: 25,
    fontWeight: "bold", 
    color: "#ff",
    textAlign: "center",
    fontFamily: "Courier New"
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20, 
    marginTop: 10, 
  },
  newHabitForm: {
    width: 500,
    fontFamily: "Courier New",
  },
  newHabitFormSelect: {
    width: 455, 
    fontFamily: "Courier New",
  },
  slightPadding: {
    marginTop: 10
  },
  moreSlightPadding: {
    marginTop: 10,
    marginBottom: 10
  },
});