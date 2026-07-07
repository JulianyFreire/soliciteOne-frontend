import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';

type InputProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  options?: { label: string; value: string }[];
  isPassword?: boolean;
  isMultiline?: boolean;
};

export function InputBase({ label, value, onChangeText, placeholder, options, isPassword, isMultiline }: InputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <View className="w-5/6 md:w-80">
      <Text className="text-sm font-medium text-primary mb-2">{label}</Text>

      {options ? (
        <View className="border border-primary bg-inputBg bg-inputBorder rounded-2xl mb-2 p-3">
          <Picker selectedValue={value} onValueChange={onChangeText} mode="dropdown">
            <Picker.Item label="Selecione" value="" enabled={false} />
            {options.map((option) => (
              <Picker.Item key={option.value} label={option.label} value={option.value} />
            ))}
          </Picker>
        </View>
      ) : (
        <View>
          <TextInput
            className={`border border-background bg-inputBg rounded-md p-3 mb-2 ${isMultiline ? 'h-24' : ''}`}
            placeholder={placeholder || ''}
            value={value}
            onChangeText={onChangeText}
            secureTextEntry={isPassword && !isPasswordVisible}
            multiline={isMultiline}
            numberOfLines={isMultiline ? 4 : 1}
            textAlignVertical={isMultiline ? 'top' : 'center'}
          />
          {isPassword && (
            <TouchableOpacity
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              className="absolute right-4 top-6 -translate-y-1/2"
            >
              <Ionicons
                name={isPasswordVisible ? 'eye' : 'eye-off'}
                size={20}
                color="#90CAF9"
              />
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}