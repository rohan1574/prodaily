import React from "react";
import { View, Text, TouchableOpacity, Image, } from "react-native";
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
                        {"Unlock!"}
                    </Text>
                    <Text 
                        style={{
                            color: "#DEEAFF",
                            fontSize: 14,
              bottom:50
                        }}>
                        {"Your Potential Productivity: By the Power of Routine Journaling"}
                    </Text>
                </View>
                <View 
                    style={{
                        flexDirection: "row",
                        bottom:50,
                        marginLeft: 48,
                    }}>
                    <TouchableOpacity >
                        <Image
                            source = {{uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Imam9Ji2yK/cjjm2wat_expires_30_days.png"}} 
                            resizeMode = {"stretch"}
                            style={{
                                width: 40,
                                height: 40,
                                bottom:50,
                                marginRight: 79,
                            }}
                        />
                    </TouchableOpacity>
                    <Image
                        source = {{uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Imam9Ji2yK/k8j6n7s8_expires_30_days.png"}} 
                        resizeMode = {"stretch"}
                        style={{
                            width: 85,
                            height: 85,
                            marginRight: 56,
              bottom:70
                        }}
                    />
                    <TouchableOpacity >
                        <Image
                            source = {{uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Imam9Ji2yK/m4gaf2aw_expires_30_days.png"}} 
                            resizeMode = {"stretch"}
                            style={{
                                width: 40,
                                height: 40,
                bottom:50
                            }}
                        />
                    </TouchableOpacity>
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
                        {"Imagine a life where you..."}
                    </Text>
                    <Text 
                        style={{
                            color: "#DEEAFF",
                            fontSize: 14,
                        }}>
                        {"...start every day with clarity, purpose, and an organized custom schedule."}
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