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
  BottomBarText
} from "../../styles/bottomBarStyled";

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
      console.log("User:", user);
      const email = user ? user.email : "yassine@gmail.com"; // Default email if user is not authenticated

      setLoadingDates(true); // Set loading to true before fetching
      try {
        const response = await axios.post("https://rag-bl-6rgb.vercel.app/getdates", { "user_email": email });
        setDates(response.data.scan_dates || []); // Update dates if response contains them
      } catch (error) {
        console.error("Error fetching scan dates:", error);
      } finally {
        setLoadingDates(false); // Set loading to false after fetching
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

    setLoading(true); // Start loading
    const user = auth.currentUser;
    const email = user ? user.email : "yassine@gmail.com"; // Default email if user is not authenticated

    // Base request data
    const requestData = {
      "user-email": email,
      "question": question,
    };

    // Check if any dates are selected
    if (selectedDates.length === 1) {
      requestData["scan-date"] = selectedDates[0]; // One date selected
      console.log("Selected Date:", selectedDates[0]);
    } else if (selectedDates.length === 2) {
      requestData["start-date"] = selectedDates[0];
      requestData["end-date"] = selectedDates[1]; // Two dates selected
      console.log("Start Date:", selectedDates[0]);
      console.log("End Date:", selectedDates[1]);
    }
          
    try {
      const response = await axios.post("https://rag-bl-6rgb.vercel.app/ask", requestData);

      const botAnswer = response.data.response || "No response from bot";

      // Add the question and answer to responses
      setResponses((prevResponses) => [
        ...prevResponses,
        { question, answer: botAnswer },
      ]);
      setQuestion(""); // Clear the question input
    } catch (error) {
      console.error("Error asking question:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Scroll to bottom on new message
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [responses]); // Trigger scroll when responses change

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* ScrollView for content area */}
        <ScrollView 
          ref={scrollViewRef} 
          contentContainerStyle={{ flexGrow: 1, padding: 20, paddingBottom: 100 }} 
          keyboardShouldPersistTaps="handled" // Ensures taps outside TextInput are handled properly
        >
          <View style={{ flex: 1 }}>
            {/* Custom Navigation Bar */}
            <View style={{ height: 60, backgroundColor: "#6200ea",borderRadius: 15, justifyContent: 'center', alignItems: 'flex-start', paddingLeft: 15 ,marginBottom: 10}}>
              <Text style={{ color: "#fff", fontSize: 20 }}>Chatbot</Text>
            </View>

            <View style={{ paddingBottom: 80 }}>
              {responses.map((item, index) => (
                <View key={index} style={{ marginBottom: 10 }}>
                  {/* User message bubble */}
                  <View
                    style={{
                      maxWidth: "80%",
                      backgroundColor: "#6200ea", // User message background color
                      padding: 10,
                      borderRadius: 15,
                      marginBottom: 5,
                      alignSelf: "flex-end", // Align user messages to the right
                      marginRight: 10,
                    }}
                  >
                    <Text style={{ color: "#fff" }}>{item.question}</Text>
                  </View>

                  {/* Bot response bubble */}
                  <View
                    style={{
                      maxWidth: "80%",
                      backgroundColor: "#e0e0e0", // Bot message background color
                      padding: 10,
                      borderRadius: 15,
                      marginBottom: 5,
                      alignSelf: "flex-start", // Align bot messages to the left
                      marginLeft: 10,
                    }}
                  >
                    <Text>{item.answer}</Text>
                  </View>
                </View>
              ))}
              {loading && <ActivityIndicator size="large" color="#0000ff" />}
            </View>
          </View>
        </ScrollView>

        {/* Input and Dates List Positioned at Bottom */}
        <View style={{ paddingHorizontal: 20, paddingBottom: 100, marginTop: 'auto' }}>
          <TouchableOpacity
            onPress={() => setShowDates(!showDates)} // Toggle visibility of the dates list
            style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}
          >
            <Ionicons name={showDates ? "chevron-up" : "chevron-down"} size={24} color="#6200ea" />
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
              borderColor: "#ccc",
              padding: 10,
              marginBottom: 10,
              borderRadius: 8,
            }}
          />
          <Button title="Send" onPress={handleAskQuestion} />
        </View>
      </KeyboardAvoidingView>

      {/* Fixed Bottom Navigation Bar */}
      <BottomBar style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
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
    </SafeAreaView>
  );
};

export default Chatbot;
