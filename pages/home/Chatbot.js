import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
  TouchableOpacity,
  SafeAreaView,
  Switch,
  StyleSheet,
} from "react-native";
import { auth } from "../../firebaseConfig";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import {
  BottomBar,
  BottomBarItem,
  BottomBarText,
  StyledIonicons,
} from "../../styles/bottomBarStyled";
import CustomButton from "../../styles/CustomButton";

const Chatbot = () => {
  const navigation = useNavigation();
  const [question, setQuestion] = useState("");
  const [responses, setResponses] = useState([]);
  const [dates, setDates] = useState([]);
  const [selectedDates, setSelectedDates] = useState([]);
  const [loadingDates, setLoadingDates] = useState(true);
  const [showDates, setShowDates] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const scrollViewRef = useRef();

  // Fetch available scan dates
  useEffect(() => {
    const fetchDates = async () => {
      const user = auth.currentUser;
      const email = user ? user.email : "yassine@gmail.com";

      setLoadingDates(true);
      try {
        const response = await axios.post(
          "https://rag-bl-6rgb.vercel.app/getdates",
          { "user_email": email }
        );
        setDates(response.data.scan_dates || []);
      } catch (error) {
        console.error("Error fetching scan dates:", error);
      } finally {
        setLoadingDates(false);
      }
    };

    fetchDates();
  }, []);

  // Handle keyboard visibility
  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () =>
      setKeyboardVisible(true)
    );
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () =>
      setKeyboardVisible(false)
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const handleSelectDate = (date) => {
    setSelectedDates((prevSelectedDates) =>
      prevSelectedDates.includes(date)
        ? prevSelectedDates.filter((item) => item !== date)
        : [...prevSelectedDates, date]
    );
  };

  const handleAskQuestion = async () => {
    if (!question) return;

    const optimisticMessage = { question, answer: "..." };
    setResponses((prevResponses) => [...prevResponses, optimisticMessage]);
    setQuestion("");

    const user = auth.currentUser;
    const email = user ? user.email : "yassine@gmail.com";

    const requestData = {
      "user-email": email,
      question,
    };

    if (selectedDates.length === 1) {
      requestData["scan-date"] = selectedDates[0];
    } else if (selectedDates.length === 2) {
      requestData["start-date"] = selectedDates[0];
      requestData["end-date"] = selectedDates[1];
    }

    try {
      const response = await axios.post(
        "https://rag-bl-6rgb.vercel.app/ask",
        requestData
      );
      const botAnswer = response.data.response || "No response from bot";

      setResponses((prevResponses) => {
        const updatedResponses = [...prevResponses];
        updatedResponses[updatedResponses.length - 1].answer = botAnswer;
        return updatedResponses;
      });
    } catch (error) {
      console.error("Error asking question:", error);
      setResponses((prevResponses) => {
        const updatedResponses = [...prevResponses];
        updatedResponses[updatedResponses.length - 1].answer =
          "Error fetching response.";
        return updatedResponses;
      });
    }
  };

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [responses]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.header}>
          <Text style={styles.headerText}>Chatbot</Text>
        </View>

        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps="handled"
        >
          {responses.map((item, index) => (
            <View key={index} style={styles.messageContainer}>
              <View style={styles.userMessage}>
                <Text>{item.question}</Text>
              </View>
              <View style={styles.botMessage}>
                <Text style={styles.botMessageText}>{item.answer}</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TouchableOpacity
            onPress={() => setShowDates(!showDates)}
            style={styles.dateSelector}
          >
            <Ionicons
              name={showDates ? "chevron-up" : "chevron-down"}
              size={24}
              color="#F38181"
            />
            <Text style={styles.dateSelectorText}>Select Scan Dates</Text>
          </TouchableOpacity>

          {showDates && (
            <View style={styles.dateList}>
              {loadingDates ? (
                <ActivityIndicator size="small" color="#0000ff" />
              ) : (
                dates.map((date, index) => (
                  <View key={index} style={styles.dateItem}>
                    <Switch
                      value={selectedDates.includes(date)}
                      onValueChange={() => handleSelectDate(date)}
                    />
                    <Text style={styles.dateItemText}>{date}</Text>
                  </View>
                ))
              )}
            </View>
          )}

          <TextInput
            placeholder="Ask your question..."
            value={question}
            onChangeText={setQuestion}
            style={styles.textInput}
          />
          <CustomButton title="Send" onPress={handleAskQuestion} />
        </View>
      </KeyboardAvoidingView>

      {!keyboardVisible && (
        <BottomBar style={styles.bottomBar}>
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
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDE2E2",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    height: 60,
    backgroundColor: "#F38181",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 45,
    marginBottom: 10,
  },
  headerText: {
    color: "#fff",
    fontSize: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 20,
    paddingBottom: 20,
  },
  messageContainer: {
    marginBottom: 10,
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#F8B4C3",
    padding: 10,
    borderRadius: 8,
    marginBottom: 5,
  },
  botMessage: {
    maxWidth: "80%",
    backgroundColor: "#F4F4F4",
    padding: 10,
    borderRadius: 15,
    marginBottom: 5,
    alignSelf: "flex-start",
  },
  botMessageText: {
    color: "#2C2C2C",
  },
  inputContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: "#FDE2E2",
  },
  dateSelector: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  dateSelectorText: {
    marginLeft: 10,
  },
  dateList: {
    marginBottom: 10,
  },
  dateItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  dateItemText: {
    marginLeft: 10,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#F4C2C2",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default Chatbot;
