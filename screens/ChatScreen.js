import { Keyboard, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { Avatar } from 'react-native-elements'
import { AntDesign , FontAwesome , Ionicons } from "@expo/vector-icons"
import { doc, addDoc , serverTimestamp, collection, onSnapshot, orderBy } from "firebase/firestore";
import { db , auth } from '../firebase';

const ChatScreen = ({ navigation , route }) => {

  const [ input , setInput ] = useState("");
  const [ messages , setMessages ] = useState([]);
 
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Chat",
      headerBackTitleVisible: false,
      headerTitleAlign: "left",
      headerTitle: () => (
        <View style={{
          flexDirection: "row",
          alignItems: "center",
        }}>
          <Avatar 
            rounded 
            source={{
              uri: messages[0]?.data.photoURL || 
              "https://surgassociates.com/wp-content/uploads/610-6104451_image-placeholder-png-user-profile-placeholder-image-png.jpg "
            }}
          />
          <Text style={{
            color: "white",
            marginLeft: 15,
            fontWeight: "500",
            fontSize: 17,
          }}>
            {route.params.chatName}
          </Text>
        </View>
      ),
      headerLeft: () => (
        <TouchableOpacity
         style={{ marginLeft: 10 }}
         onPress={navigation.goBack}
         >
          <AntDesign name="left" size={20} color="white" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <View style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: 70,
          marginRight: 20,
        }}>
          <TouchableOpacity>
            <Ionicons name="call" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity>
            <FontAwesome name="video-camera" size={20} color="white" />
          </TouchableOpacity>
        </View>
      ),
    })
  }, [navigation,messages])

  const sendMessage = () => {
    Keyboard.dismiss();

    const docRef = doc(db,'chats',route.params.id);

    addDoc(collection(docRef,"messages"), {
      timestamp: serverTimestamp(),
      message: input,
      displayName: auth.currentUser.displayName,
      email: auth.currentUser.email,
      photoURL: auth.currentUser.photoURL,
    });
    
    setInput("");
  }

  useLayoutEffect(() => {
    const unsubscribe = onSnapshot(collection(
      doc(db,'chats',route.params.id),"messages"),
      orderBy("timestamp","desc"), 
      snapshot => {
        setMessages(
          snapshot.docs.map(doc => ({
            id: doc.id,
            data: doc.data()
          }))
        )
    }) 

    return unsubscribe;
  },[route])

  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: "white",
    }} >
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={90}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <>
            <ScrollView contentContainerStyle= {{ paddingTop: 15 }}>
              {messages.map(({ id , data }) => (
                data.email === auth.currentUser.email? (
                  <View key={id} style={styles.receiver}>
                    <Avatar  
                      position="absolute"
                      bottom={-15}
                      right={-5}
                      rounded
                      size={25}
                      source={{
                        uri: data.photoURL,
                      }}
                    />
                    <Text style={styles.receiverText}>{data.message}</Text>
                  </View>
                ) : (
                  <View key={id} style={styles.sender}>
                    <Avatar 
                    position="absolute"
                      bottom={-15}
                      left={-5}
                      rounded
                      size={25}
                      source={{
                        uri: data.photoURL,
                      }} 
                    />
                    <Text style={styles.senderText}>{data.message}</Text>
                    <Text style={styles.senderName}>{data.displayName}</Text>
                  </View>
                )
              ))}
            </ScrollView>
            <View style={styles.footer}>
              <TextInput 
                value={input}
                onChangeText={(text) =>setInput(text)}
                onSubmitEditing={sendMessage}
                placeholder='Signal Message' 
                style={styles.textInput}
              />
              <TouchableOpacity onPress={sendMessage} activeOpacity={0.5}>
                <Ionicons name="send" size={20} color="#2B68E6" />
              </TouchableOpacity>
            </View>
          </>
        </TouchableWithoutFeedback>     
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default ChatScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    padding: 15, 
  },
  textInput: {
    bottom: 0,
    height: 40,
    flex: 1,
    marginRight: 15,
    backgroundColor: "#ECECEC",
    padding: 10,
    color: "grey",
    borderRadius: 30,
  },
  receiver: {
    padding: 15,
    backgroundColor: "#ECECEC",
    alignSelf: "flex-end",
    borderRadius: 20,
    marginRight: 15,
    marginBottom: 20,
    maxWidth: "80%",
    position: "relative",
  },
  sender: {
    padding: 15,
    backgroundColor: "#2868E6",
    alignSelf: "flex-start",
    borderRadius: 20,
    margin: 15,
    maxWidth: "80%",
    position: "relative",
  },
  senderName: {
    left: 10,
    paddingRight: 10,
    fontSize: 10,
    color: "white"
  },
  senderText: {
    color: "white",
    fontWeight: "500",
    marginLeft: 10,
    marginBottom: 15,
  },
  receiverText: {
    color: "black",
    fontWeight: "500",
    marginLeft: 10,
  }
})