import React from "react";
import { SafeAreaView, View, ScrollView, Text, TouchableOpacity, Image, } from "react-native";
export default () => {
    return (
        
            <View  
                style={{
                    flex: 1,
                    backgroundColor: "#007AFF",
                }}>
                <View 
                    style={{
                        marginTop: 92,
                        marginBottom: 201,
                        marginHorizontal: 36,
                    }}>
                    <Text 
                        style={{
                            color: "#FFFFFF",
                            fontSize: 22,
                            fontWeight: "bold",
                            bottom:50
                        }}>
                        {"Keep consistency! "}
                    </Text>
                    <Text 
                        style={{
                            color: "#DEEAFF",
                            fontSize: 14,
              bottom:50
                        }}>
                        {"Be regular, Be honest with yourself. "}
                    </Text>
                </View>
                <View 
                    style={{
                        flexDirection: "row",
                        bottom:50,
                        left:145
                    }}>
                    <Image
                        source = {{uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Imam9Ji2yK/k8j6n7s8_expires_30_days.png"}} 
                        resizeMode = {"stretch"}
                        style={{
                            width: 85,
                            height: 85,
              bottom:70
                        }}
                    />
        
                </View>
                <View 
                    style={{
                        marginBottom: 67,
                        marginHorizontal: 36,
                    }}>
                    <Text 
                        style={{
                            color: "#FFFFFF",
                            fontSize: 28,
                            fontWeight: "bold",
                            marginBottom: 15,
                        }}>
                        {"Habit can't be built overnight"}
                    </Text>
                    <Text 
                        style={{
                            color: "#DEEAFF",
                            fontSize: 14,
                        }}>
                        {"...Keep doing journaling routine. you’ll see the life changing effects in a few weeks"}
                    </Text>
                </View>
                <TouchableOpacity 
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 58,
                        marginLeft: 186,
                    }} >
                    <Text 
                        style={{
                            color: "#DEEAFF",
                            fontSize: 16,
                            fontWeight: "bold",
                            marginRight: 4,
                        }}>
                        {"Next"}
                    </Text>
                    <Image
                        source = {{uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Imam9Ji2yK/qsv3kzf9_expires_30_days.png"}} 
                        resizeMode = {"stretch"}
                        style={{
                            width: 24,
                            height: 30,
                        }}
                    />
                </TouchableOpacity>
            </View>

    )
}