import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, ScrollView, ActivityIndicator, Platform, KeyboardAvoidingView, SafeAreaView, TouchableOpacity, Switch } from "react-native";
import { auth } from "../../firebaseConfig";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const Chatbot = () => {
  const navigation = useNavigation();
  const [question, setQuestion] = useState("");
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dates, setDates] = useState([]); // Store available scan dates
  const [selectedDates, setSelectedDates] = useState([]); // Store selected dates (array)
  const [loadingDates, setLoadingDates] = useState(true); // Loading state for dates

  // Fetch available scan dates
  useEffect(() => {
    const fetchDates = async () => {
      const user = auth.currentUser;
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
    // Add or remove date from selectedDates
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
      // Possibility 2: One date selected - send as `scan-date`
      requestData["scan-date"] = selectedDates[0];
    } else if (selectedDates.length === 2) {
      // Possibility 3: Two dates selected - send as `start-date` and `end-date`
      requestData["start-date"] = selectedDates[0];
      requestData["end-date"] = selectedDates[1];
    }

    // Log the final request data
    console.log("Request Data Before Sending:", requestData);

    try {
      const response = await axios.post("https://rag-bl-6rgb.vercel.app/ask", requestData);

      // Assuming the response is in the form: { "response": "your answer" }
      const botAnswer = response.data.response || "No response from bot";

      // Add the question and answer to responses
      setResponses((prevResponses) => [
        ...prevResponses,
        { question, answer: botAnswer },
      ]);
      setQuestion(""); // Clear the question input
    } catch (error) {
      if (error.response) {
        console.error("Error Response Data:", error.response.data);
        console.error("Error Response Status:", error.response.status);
      } else {
        console.error("Error asking question:", error.message);
      }
    } finally {
      setLoading(false); // Stop loading
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
          {/* Custom Navigation Bar */}
          <View style={{ height: 60, backgroundColor: '#6200ea', justifyContent: 'center', alignItems: 'flex-start', paddingLeft: 15 }}>
            <Ionicons
              name="arrow-back"
              size={30}
              color="#fff"
              onPress={() => navigation.navigate("Home")}
              style={{ position: 'absolute', left: 15 }}
            />
            <Text style={{ color: "#fff", fontSize: 20 }}>Chatbot</Text>
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
            <Text style={{ marginBottom: 10 }}>Select Scan Dates (can select 1 or 2 dates):</Text>
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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Chatbot;
