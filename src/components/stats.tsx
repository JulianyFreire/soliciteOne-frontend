import { Text, View } from "react-native";

export function Stats() {
    return (
        <View className="flex-col gap-5 w-96 bg-neutral-50 h-24 mx-auto rounded-3xl p-5 shadow-md">
            <Text>status da solicitação:</Text>
            <View className="w-full bg-gray-200 rounded-full h-2.5">
                <View className="bg-purple-500 h-2.5 rounded-full w-[45%]"></View>
            </View>
        </View>
    )
}