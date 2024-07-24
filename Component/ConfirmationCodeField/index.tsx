import { Dimensions, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import {
    CodeField,
    Cursor,
    useBlurOnFulfill,
    useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { Theme } from '../../constant/theme';

const ConfirmationCodeField = ({ onCodeChange }:any) => {
    const CELL_COUNT = 5;
    const [value, setValue] = useState('');
    const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue,
    });

    const handleCodeEntered = (enteredCode:any) => {
        setValue(enteredCode);
        onCodeChange(enteredCode); // Call the callback with the new value
    };

    return (
        <CodeField
            ref={ref}
            {...props}
            value={value}
            onChangeText={handleCodeEntered} // Update value and notify parent
            cellCount={CELL_COUNT}
            rootStyle={styles.codeFieldRoot}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            renderCell={({ index, symbol, isFocused }) => (
                <Text
                    key={index}
                    style={[styles.cell, isFocused && styles.focusCell]}
                    onLayout={getCellOnLayoutHandler(index)}>
                    {symbol || (isFocused ? <Cursor /> : null)}
                </Text>
            )}
        />
    );
};

export default ConfirmationCodeField;

const styles = StyleSheet.create({
    codeFieldRoot: {
        marginTop: 40,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cell: {
        width: 60,
        height: 65,
        paddingTop: 12,
        alignItems: 'center',
        fontFamily: 'Circular Std Bold',
        fontSize: 33,
        borderWidth: 1,
        borderRadius: 12,
        borderColor: Theme.GhostWhite,
        textAlign: 'center',
        backgroundColor: Theme.white,
        color: 'black',
        justifyContent: 'space-between'
    },
    focusCell: {
        borderColor: Theme.jobticketBG,
    }
});
