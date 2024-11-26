import { Text, View } from "react-native";
import { Navbar } from "../components/navbar";

export default function Home() {
    return (
        <View className="flex-1 items-center justify-center">
            <Text>Home</Text>
            <Navbar />
        </View>
    );
}