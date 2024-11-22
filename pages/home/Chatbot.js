import React, { useState, useEffect, useRef } from "react";
import { 
  View, Text, TextInput, Button, ScrollView, ActivityIndicator, 
  Platform, KeyboardAvoidingView, SafeAreaView, TouchableOpacity, Switch 
} from "react-native";
import { auth } from "../../firebaseConfig";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import {
  BottomBar,
  BottomBarItem,
  BottomBarText,
  StyledIonicons
} from "../../styles/bottomBarStyled";
import CustomButton from "../../styles/CustomButton";

const Chatbot = () => {
  const navigation = useNavigation();
  const [question, setQuestion] = useState("");
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dates, setDates] = useState([]); // Store available scan dates
  const [selectedDates, setSelectedDates] = useState([]); // Store selected dates (array)
  const [loadingDates, setLoadingDates] = useState(true); // Loading state for dates
  const [showDates, setShowDates] = useState(false); // Control visibility of dates list
  const scrollViewRef = useRef(); // Reference for ScrollView to manage auto-scrolling

  // Fetch available scan dates
  useEffect(() => {
    const fetchDates = async () => {
      const user = auth.currentUser;
      const email = user ? user.email : "yassine@gmail.com"; // Default email if user is not authenticated

      setLoadingDates(true);
      try {
        const response = await axios.post("https://rag-bl-6rgb.vercel.app/getdates", { "user_email": email });
        setDates(response.data.scan_dates || []); // Update dates if response contains them
      } catch (error) {
        console.error("Error fetching scan dates:", error);
      } finally {
        setLoadingDates(false);
      }
    };

    fetchDates();
  }, []);

  const handleSelectDate = (date) => {
    setSelectedDates((prevSelectedDates) => {
      if (prevSelectedDates.includes(date)) {
        return prevSelectedDates.filter((item) => item !== date); // Deselect date
      } else {
        return [...prevSelectedDates, date]; // Select date
      }
    });
  };

  const handleAskQuestion = async () => {
    if (!question) return;

    // Add the user's question immediately to the chat
    const optimisticMessage = { question, answer: "..." }; // Placeholder answer
    setResponses((prevResponses) => [...prevResponses, optimisticMessage]);
    setQuestion(""); // Clear the question input

    const user = auth.currentUser;
    const email = user ? user.email : "yassine@gmail.com"; // Default email if user is not authenticated

    const requestData = {
      "user-email": email,
      "question": question,
    };

    if (selectedDates.length === 1) {
      requestData["scan-date"] = selectedDates[0];
    } else if (selectedDates.length === 2) {
      requestData["start-date"] = selectedDates[0];
      requestData["end-date"] = selectedDates[1];
    }

    try {
      const response = await axios.post("https://rag-bl-6rgb.vercel.app/ask", requestData);
      const botAnswer = response.data.response || "No response from bot";

      // Replace placeholder answer with actual bot answer
      setResponses((prevResponses) => {
        const updatedResponses = [...prevResponses];
        updatedResponses[updatedResponses.length - 1].answer = botAnswer;
        return updatedResponses;
      });
    } catch (error) {
      console.error("Error asking question:", error);
      setResponses((prevResponses) => {
        const updatedResponses = [...prevResponses];
        updatedResponses[updatedResponses.length - 1].answer = "Error fetching response.";
        return updatedResponses;
      });
    }
  };

  // Scroll to bottom on new message
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [responses]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FDE2E2" }}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView 
          ref={scrollViewRef} 
          contentContainerStyle={{ flexGrow: 1, padding: 20, paddingBottom: 100 }} 
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ flex: 1 }}>
            <View style={{ height: 60, backgroundColor: "#F38181", borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginBottom: 10 }}>
              <Text style={{ color: "#fff", fontSize: 20 }}>Chatbot</Text>
            </View>

            <View style={{ paddingBottom: 80 }}>
              {responses.map((item, index) => (
                <View key={index} style={{ marginBottom: 10 }}>
                  <View
                    style={{
                      maxWidth: "80%",
                      backgroundColor: "#F8B4C3",
                      padding: 10,
                      borderRadius: 15,
                      marginBottom: 5,
                      alignSelf: "flex-end",
                      marginRight: 10,
                    }}
                  >
                    <Text style={{ color: "black" }}>{item.question}</Text>
                  </View>

                  <View
                    style={{
                      maxWidth: "80%",
                      backgroundColor: "#F4F4F4",
                      padding: 10,
                      borderRadius: 15,
                      marginBottom: 5,
                      alignSelf: "flex-start",
                      marginLeft: 10,
                      color: "#2C2C2C"
                    }}
                  >
                    <Text style={{ color: "#2C2C2C" }}>{item.answer}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>

        <View style={{ paddingHorizontal: 20, paddingBottom: 100, marginTop: 'auto' }}>
          <TouchableOpacity
            onPress={() => setShowDates(!showDates)}
            style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}
          >
            <Ionicons name={showDates ? "chevron-up" : "chevron-down"} size={24} color="#F38181" />
            <Text style={{ marginLeft: 10 }}>Select Scan Dates</Text>
          </TouchableOpacity>

          {showDates && (
            <View>
              {loadingDates ? (
                <ActivityIndicator size="small" color="#0000ff" />
              ) : (
                <View>
                  {dates.map((date, index) => (
                    <View key={index} style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
                      <Switch
                        value={selectedDates.includes(date)}
                        onValueChange={() => handleSelectDate(date)}
                      />
                      <Text>{date}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}

          <TextInput
            placeholder="Ask your question..."
            value={question}
            onChangeText={setQuestion}
            style={{
              borderWidth: 1,
              borderColor: "#F4C2C2",
              padding: 10,
              marginBottom: 10,
              borderRadius: 8,
            }}
          />
          <CustomButton title="Send" onPress={handleAskQuestion} />
        </View>
      </KeyboardAvoidingView>

      <BottomBar style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
        <BottomBarItem onPress={() => navigation.navigate("Home")}>
          <StyledIonicons name="home-outline" />
          <BottomBarText>Home</BottomBarText>
        </BottomBarItem>
        <BottomBarItem onPress={() => navigation.navigate("SavedProducts")}>
          <StyledIonicons name="bookmark-outline" />
          <BottomBarText>Products</BottomBarText>
        </BottomBarItem>
        <BottomBarItem onPress={() => navigation.navigate("History")}>
          <StyledIonicons name="stats-chart-outline" />
          <BottomBarText>History</BottomBarText>
        </BottomBarItem>
        <BottomBarItem onPress={() => navigation.navigate("Profile")}>
          <StyledIonicons name="person-outline" />
          <BottomBarText>Account</BottomBarText>
        </BottomBarItem>
      </BottomBar>
    </SafeAreaView>
  );
};

export default Chatbot;
