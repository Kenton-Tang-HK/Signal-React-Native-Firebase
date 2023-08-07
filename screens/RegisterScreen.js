import { StyleSheet, View , KeyboardAvoidingView } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { Button , Input , Text } from 'react-native-elements'
import { auth } from "../firebase"
import { createUserWithEmailAndPassword , updateProfile } from  "firebase/auth"

const RegisterScreen = ({ navigation }) => {
    const [ name , setName ] = useState("");
    const [ email , setEmail ] = useState("");
    const [ password , setPassword ] = useState("");
    const [ imageUrl , setImageUrl ] = useState("");

    useLayoutEffect(() => {
        navigation.setOptions({
            headerBackTitle: "Login",
        });
    }, [navigation])

    const register = () => {
        createUserWithEmailAndPassword(auth,email,password)
        .then((authUser) => {
            const user = authUser.user;
            updateProfile(user, {
                displayName: name,
                photoURL: imageUrl || "https://surgassociates.com/wp-content/uploads/610-6104451_image-placeholder-png-user-profile-placeholder-image-png.jpg"
            })
        })
        .catch(error => alert(error.message))
    }

  return (
    <KeyboardAvoidingView behavior='padding' style={styles.container}>
      <StatusBar style='light' />

      <Text h3 style={{ marginBottom: 35 , marginTop: 15 }}>
        Create a Signal account
      </Text>

      <View style={styles.inputContainer}>
        <Input 
            placeholder='Full Name'
            autofocus 
            type='text' 
            value={name}
            onChangeText={(text) => setName(text)}
        />
        <Input 
            placeholder='Email'
            type='email' 
            value={email}
            onChangeText={(text) => setEmail(text)}
        />
        <Input 
            placeholder='Password'
            type='password' 
            secureTextEntry
            value={password}
            onChangeText={(text) => setPassword(text)}
        />
        <Input 
            placeholder='Profile Pic URL (Optional)'
            type='text' 
            value={imageUrl}
            onChangeText={(text) => setImageUrl(text)}
            onSubmitEditing={register}
        />
      </View>

      <Button 
        containerStyle={styles.button}
        raised 
        onPress={register} 
        title="Register"
      />
      <View style={{ height: 150 }} />
    </KeyboardAvoidingView>
  )
}

export default RegisterScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        backgroundColor: 'white',
    },
    inputContainer: {
        width: 300,
    },
    button: {
        width: 150, 
        marginTop: 10,
    },
})