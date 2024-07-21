import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Path, Svg } from 'react-native-svg'

const TutorProfileIcon = () => {
    return (
        <Svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <Path d="M11 2.75C6.4625 2.75 2.75 6.4625 2.75 11C2.75 15.5375 6.4625 19.25 11 19.25C15.5375 19.25 19.25 15.5375 19.25 11C19.25 6.4625 15.5375 2.75 11 2.75ZM11 5.95833C12.0083 5.95833 12.8333 6.78333 12.8333 7.79167C12.8333 8.8 12.0083 9.625 11 9.625C9.99167 9.625 9.16667 8.8 9.16667 7.79167C9.16667 6.78333 9.99167 5.95833 11 5.95833ZM6.41667 15.5833C6.41667 13.0625 8.47917 11 11 11C13.5208 11 15.5833 13.0625 15.5833 15.5833H6.41667Z" fill="#333333" />
        </Svg>
    )
}

export default TutorProfileIcon

const styles = StyleSheet.create({})