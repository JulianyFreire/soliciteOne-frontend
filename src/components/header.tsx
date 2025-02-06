import { View, Text, Image, TouchableOpacity} from 'react-native';
import { Link } from "expo-router";

type HeaderProps = {
  title: string;
};

export function Header({ title }: HeaderProps) {
  return (
    <View className="flex-row items-center p-5 mt-2 justify-center">
      <Text className="text-4xl text-primary w-64 font-light">{title}</Text>
        <Link href="/">
            <Image 
            source={require('../assets/Image/Logo.png')} 
            className="w-16 h-16 max-w-16 max-h-16" 
            resizeMode="contain"
            />
        </Link>
       
    </View>
  );
}
