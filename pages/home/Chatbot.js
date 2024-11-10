import React, { useState } from "react";
import { View, Text, TextInput, Button, ScrollView, ActivityIndicator, Platform, KeyboardAvoidingView, SafeAreaView } from "react-native";
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
    const user = auth.currentUser;
    const email = user ? user.email : "yassine@gmail.com"; // Default email if user is not authenticated
    const scanDate = new Date().toISOString(); // Use current date for scan date

    try {
      const response = await axios.post("https://rag-bl-6rgb.vercel.app/ask", {
        question,
        "user-email": email,
        "scan-date": scanDate,
      });

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
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <View style={{ flex: 1 }}>
          <View style={{ padding: 20 }}>
            <Ionicons 
              name="arrow-back" 
              size={24} 
              color="#333" 
              onPress={() => navigation.navigate("Home")} 
              style={{ position: 'absolute', top: 20, left: 20 }} 
            />
            <Text style={{ fontSize: 24, textAlign: 'center', marginBottom: 20, marginTop: 20 }}>Chatbot</Text>
          </View>
          <ScrollView style={{ flex: 1, padding: 20, paddingBottom: 100 }}>
            {responses.map((item, index) => (
              <View key={index} style={{ marginBottom: 10 }}>
                <Text style={{ fontWeight: "bold" }}>You: {item.question}</Text>
                <Text>Bot: {item.answer}</Text>
              </View>
            ))}
            {loading && <ActivityIndicator size="large" color="#0000ff" />}
          </ScrollView>
          <View style={{ padding: 20, paddingBottom: 80 }}>
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
          </View>
        </View>
        <BottomBar style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Chatbot;
