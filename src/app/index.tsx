import { Link } from 'expo-router'
import { Text, View, Image, TextInput, TouchableOpacity} from 'react-native'

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center min-h-screen bg-purple-800">
      <View>
        <Image source={require('../assets/logo.png')}/>
      </View>       
      
      <View className="px-10 mt-4 w-full">
        <Text className="text-sm font-semibold text-white p-2">Login</Text>
        <TextInput className="border-b border-gray-300 rounded-xl p-3 mb-2"></TextInput>
        <Text className="text-sm font-semibold text-white p-2">Senha</Text>
        <TextInput className="border-b border-gray-300 rounded-xl p-3 mb-2"></TextInput>
      </View>
      
      <View className= "flex flex-row gap-x-10 mx-auto"> 
          <TouchableOpacity className= "flex items-center justify-center w-40 h-14 mx-auto my-10 bg-purple-300 rounded-xl p-3">
            <Link href="/home" className="text-center">Entrar</Link>
          </TouchableOpacity>
      
          <TouchableOpacity className="flex items-center justify-center w-40 h-14 mx-auto my-10 bg-purple-300 rounded-xl p-3">
            <Link href="/cadastro" className="text-center">Cadastro</Link>
          </TouchableOpacity>
      </View>

      {/* Link de recuperação */}
      <View className="flex justify-start "> 
        <Link className="text-sm text-purple-300 hover:text-purple-200" href="/">Recuperar Senha</Link>
      </View>

    </View>
  )
}
