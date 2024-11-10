import React, { useState } from "react";
import { View, Text, TextInput, Button, ScrollView, ActivityIndicator } from "react-native";
import { auth } from "../../firebaseConfig";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { BottomBar, BottomBarItem, BottomBarText } from "../../styles/home/HomeStyled";

const Chatbot = () => {
  const navigation = useNavigation();
  const [question, setQuestion] = useState("");
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAskQuestion = async () => {
    if (!question) return;

    setLoading(true);
    // const user = auth.currentUser;
    const email = "yassine@gmail.com"; // Default email if user is not authenticated
    // const scanDate = new Date().toISOString(); // Use current date for scan date

    try {
      const response = await axios.post("https://rag-bl-6rgb.vercel.app/ask", {
        question,
        "user-email": email,
        "scan-date": "",
      });

      // Ensure the response is correctly handled
      const botAnswer = response.data || "No response from bot"; // Default message if no answer
      setResponses((prevResponses) => [
        ...prevResponses,
        { question, answer: botAnswer }, // Store both question and answer
      ]);
      setQuestion("");
    } catch (error) {
      console.error("Error asking question:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Ionicons 
        name="arrow-back" 
        size={24} 
        color="#333" 
        onPress={() => navigation.navigate("Home")} 
        style={{ position: 'absolute', top: 20, left: 20 }} 
      />
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Chatbot</Text>
      <ScrollView style={{ flex: 1 }}>
        {responses.map((item, index) => (
          <View key={index} style={{ marginBottom: 10 }}>
            <Text style={{ fontWeight: "bold" }}>You: {item.question}</Text>
            <Text>Bot: {item.answer}</Text>
          </View>
        ))}
        {loading && <ActivityIndicator size="large" color="#0000ff" />}
        <TextInput
          placeholder="Ask your question..."
          value={question}
          onChangeText={setQuestion}
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            padding: 10,
            marginBottom: 10,
          }}
        />
        <Button title="Send" onPress={handleAskQuestion} />
      </ScrollView>
      <BottomBar>
        <BottomBarItem onPress={() => navigation.navigate("Home")}>
          <Ionicons name="home-outline" size={24} color="#333" />
          <BottomBarText>Home</BottomBarText>
        </BottomBarItem>
        <BottomBarItem onPress={() => navigation.navigate("SavedProducts")}>
          <Ionicons name="bookmark-outline" size={24} color="#333" />
          <BottomBarText>Saved</BottomBarText>
        </BottomBarItem>
        <BottomBarItem onPress={() => navigation.navigate("History")}>
          <Ionicons name="stats-chart-outline" size={24} color="#333" />
          <BottomBarText>History</BottomBarText>
        </BottomBarItem>
        <BottomBarItem onPress={() => navigation.navigate("Profile")}>
          <Ionicons name="person-outline" size={24} color="#333" />
          <BottomBarText>Profile</BottomBarText>
        </BottomBarItem>
      </BottomBar>
    </View>
  );
};

export default Chatbot;
