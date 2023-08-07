import { StyleSheet, View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Button, Input, Image } from 'react-native-elements'
import { StatusBar } from 'expo-status-bar'
import { KeyboardAvoidingView } from 'react-native'
import { auth } from '../firebase'
import { signInWithEmailAndPassword } from "firebase/auth"

const LoginScreen = ({ navigation }) => {

    const [ email , setEmail ] = useState('');
    const [ password , setPassword ] = useState('');
    
    useEffect(()=> {
        const unsubscribe = auth.onAuthStateChanged((authUser) => {
            if (authUser) {
                navigation.replace("Home");
            }
        });

        return unsubscribe;
    },[])

    const signIn  = () => {
        signInWithEmailAndPassword(auth, email, password)
        .catch((error) => alert(error.message))
    }

    return (
    <KeyboardAvoidingView behavior='padding' style={styles.container}>
        <StatusBar style ='light'/>
        <Image 
            source={{
                uri: "https://seeklogo.com/images/S/signal-logo-899FCAD070-seeklogo.com.png",
            }}
            style={{width: 150, height:150, margin:20 }}
        />
        <View style={styles.inputContainer}>
            <Input 
                placeholder='Email' 
                autoFocus 
                type='email'
                value={email}
                onChangeText={(text) => setEmail(text)}
            />
            <Input 
                placeholder='Password' 
                secureTextEntry 
                type='password'
                value={password}
                onChangeText={(text) => setPassword(text)}
                onSubmitEditing={signIn}
            />

            <Button containerStyle={styles.button} onPress={signIn} title="Login" />
            <Button 
                onPress={() => navigation.navigate('Register')} 
                containerStyle={styles.button} 
                type='outline' 
                title="Register" 
            />
            <View style={{ height: 120 }} />
        </View>
    </KeyboardAvoidingView>
    )
}

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        backgroundColor: 'white',
    },
    inputContainer: {
        width: 250,
    },
    button: {
        width: 250, 
        marginTop: 10,
    },
});