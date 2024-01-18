import { Modal, View, Text, TouchableOpacity,StyleSheet } from 'react-native';
import React from 'react'
import { Theme } from '../../constant/theme';

const BackToDashboard = ({modalVisible, handleGoToDashboard}:any) => {
  return (
    <Modal visible={modalVisible} animationType="fade" transparent={true}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}>
          <View
            style={[
              styles.modalContainer,
              { padding: 30, marginHorizontal: 40 },
            ]}>
            <Text
              style={{
                color: Theme.darkGray,
                fontSize: 16,
                fontWeight: 'bold',
                fontFamily: 'Circular Std Medium',
                lineHeight: 30,
              }}>
              You have been Verified!
            </Text>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                gap: 10,
                marginTop: 20,
                marginBottom: 20,
              }}>
              <TouchableOpacity
                onPress={handleGoToDashboard}
                activeOpacity={0.8}
                style={{
                  borderWidth: 1,
                  paddingVertical: 10,
                  borderRadius: 10,
                  borderColor: Theme.lightGray,
                  alignItems: 'center',
                  width: '90%',
                  backgroundColor: Theme.darkGray,
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontSize: 14,
                    fontFamily: 'Circular Std Medium',
                  }}>
                  Go To Dashboard
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
  )
}

export default BackToDashboard

const styles = StyleSheet.create({
    modalContainer: {
        // flex: 1,
        alignItems: 'center',
        // justifyContent: 'center',
        backgroundColor: '#fff',
        borderColor: Theme.gray,
        borderRadius: 10,
        paddingHorizontal: 10,
        borderWidth: 1,
      },
      modalText: {
        color: 'black',
        fontSize: 12,
        fontFamily: 'Poppins-Regular',
      },
})