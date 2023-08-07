import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ListItem , Avatar } from 'react-native-elements'
import { doc, collection, onSnapshot, orderBy } from "firebase/firestore";
import { db } from '../firebase';

const CustomListItem = ({ id , chatName , enterChat }) => {

  const [ chatMessages , setChatMessages ] = useState([])

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(
        doc(db,'chats',id),"messages"),
        orderBy("timestamp","desc"), 
        snapshot => {
          setChatMessages(
            snapshot.docs.map(doc => (
              doc.data()
            ))
          )
      }) 

      return unsubscribe
  })

  return (
    <ListItem key={id} bottomDivider onPress={() => enterChat(id, chatName)}>
        <Avatar 
            rounded
            source={{
                    uri: chatMessages?.[0]?.photoURL || 
                    "https://surgassociates.com/wp-content/uploads/610-6104451_image-placeholder-png-user-profile-placeholder-image-png.jpg "
                }}
        />
        <ListItem.Content>
            <ListItem.Title style={{ fontWeight: "800" }}> 
                {chatName}
            </ListItem.Title>
            <ListItem.Subtitle numberOfLines={1} ellipsizeMode='tail'>
                {chatMessages?.[0]?.displayName}: {chatMessages?.[0]?.message}
            </ListItem.Subtitle>
        </ListItem.Content>
    </ListItem>
  )
}

export default CustomListItem

const styles = StyleSheet.create({})