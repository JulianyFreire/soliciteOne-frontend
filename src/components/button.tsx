import { TouchableOpacity, Text } from 'react-native';

type ButtonProps = {
  title: string;
  onPress: () => void;
};

export function Button({ title, onPress }: ButtonProps) {
  return (
    <TouchableOpacity
      className="flex items-center justify-center w-36 md:w-52 h-14 mx-auto my-10 bg-secondary rounded-xl p-3"
      onPress={onPress}
    >
      <Text className="text-center text-primary font-regular">{title}</Text>
    </TouchableOpacity>
  );
}