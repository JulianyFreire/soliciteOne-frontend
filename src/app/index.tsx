import { Link } from 'expo-router'
import { Text, View} from 'react-native'

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center">
        <Text>Hello Solicite</Text>
        <Link href="/cadastro">Cadastro</Link>
    </View>
  )
}
