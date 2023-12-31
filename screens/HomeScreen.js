import { StyleSheet , SafeAreaView, Text, ScrollView , View, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomListItem from '../components/CustomListItem';
import { useLayoutEffect } from 'react';
import { Avatar } from 'react-native-elements';
import { auth , db } from "../firebase"
import { AntDesign , SimpleLineIcons } from "@expo/vector-icons"
import { signOut } from "firebase/auth";
import { onSnapshot , collection } from 'firebase/firestore';

const HomeScreen = ({ navigation }) => {

  const [ chats , setChats ] = useState([]);

  const signOutUser = () => {
    signOut(auth).then(() => {
      navigation.replace('Login')
    })
  }

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db,'chats'), snapshot => {
      setChats(snapshot.docs.map(doc => ({
        id: doc.id,
        data: doc.data()
      }))
      )
    })

    return unsubscribe;
  },[])

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Signal",
      headerStyle: { backgroundColor: "#fff" },
      headerTitleStyle: { color: "black" },
      headerTintColor: "black", 
      headerLeft: () => (
        <View style={{ marginLeft: 20 }}>
          <TouchableOpacity onPress={signOutUser} activeOpacity={0.5}>
            <Avatar rounded source={{ uri: auth?.currentUser?.photoURL }}/>
          </TouchableOpacity>
        </View>
      ),
      headerRight: () => (
        <View style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: 70,
          marginRight: 20,
        }}>
          <TouchableOpacity activeOpacity={0.5}>
            <AntDesign name="camerao" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity 
            activeOpacity={0.5}
            onPress={() => navigation.navigate("AddChat")}
          >
            <SimpleLineIcons name="pencil" size={24} color="black" />
          </TouchableOpacity>
        </View>
      ),
    });
  },[navigation]);

  const enterChat = (id, chatName) => [
    navigation.navigate("Chat", {
      id: id,
      chatName: chatName,
    })
  ]

  return (
    <SafeAreaView>
      <ScrollView style={styles.container}>
        { chats.map(({id, data: {chatName }}) => (
          <CustomListItem 
          key={id} 
          id={id} 
          chatName={chatName} 
          enterChat={enterChat}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        height: "100%"
    },
    inputContainer: {
        width: 250,
    },
    button: {
        width: 250, 
        marginTop: 10,
    },
});