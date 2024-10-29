import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import React from 'react';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';

const RenderItem = ({ item, index }) => {
    // console.log("At RenderItem.js", item);
    const { width } = useWindowDimensions();
    return (
        <Animated.View
            style={[styles.container, { width: width * 0.4 }]}
            entering={FadeInDown.delay(index * 200)}
            exiting={FadeOutDown}
        >
            <View style={styles.contentContainer}>
                <View style={[styles.color, { backgroundColor: item.color }]} />
                {/* <Text style={styles.text}>{item.percentage}%</Text> */}
                {/* <Text style={styles.text}>{item.value}g</Text> */}
                {/* <View style={styles.col}> */}
                    <Text style={styles.text}>{item.name}</Text>
                    <Text style={styles.text}>{item.value}g</Text>
                {/* </View> */}
            </View>
        </Animated.View>
    );
};

export default RenderItem;

const styles = StyleSheet.create({
    container: {
        paddingVertical: 20,
        marginBottom: 10,
        backgroundColor: '#f4f7fc',
        borderRadius: 20,
    },
    contentContainer: {
        // flex: 1,
        flexDirection: 'row',
        // alignItems: 'center',
        // justifyContent: 'space-between',
        gap: 10,
        marginHorizontal: 10
    },
    color: {
        width: 20,
        height: 20,
        borderRadius: 10,
    },
    text: {
        fontSize: 15,
        fontWeight: 'bold',
        color: 'black',
    },
});
