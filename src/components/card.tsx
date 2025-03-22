import React, { ReactNode, useState } from 'react';
import { View, Text, Image, Animated, TouchableWithoutFeedback, Pressable, TouchableOpacity, Linking } from 'react-native';

interface UseScaleAnimation {
  scaleAnim: Animated.Value;
  onPressIn: () => void;
  onPressOut: () => void;
}

const useScaleAnimation = (initialValue: number = 1, scaleValue: number = 0.95): UseScaleAnimation => {
  const scaleAnim = useState(new Animated.Value(initialValue))[0];

  const onPressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: scaleValue,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: initialValue,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return { scaleAnim, onPressIn, onPressOut };
};

interface AnimatedCardProps {
  imageSource: any; 
  title: string;
  description: string;
  highlightText?: ReactNode;
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({ imageSource, title, description, highlightText }) => {
  const { scaleAnim, onPressIn, onPressOut } = useScaleAnimation();

  return (
    <Pressable onPressIn={onPressIn} onPressOut={onPressOut} className='w-1/2 p-2 md:p-5 max-w-44 bg-neutral-50 rounded-lg shadow-md'>
      <Animated.View
        className="flex-col w-44 h-60 p-2"
        style={{ transform: [{ scale: scaleAnim }] }}
      >
        <Image source={imageSource} style={{ width: 100, height: 100 }} className="mx-auto" resizeMode='cover'/>
        <View className="p-2">
          <Text className="text-md font-semibold text-center text-primary mb-2">
            {title}
          </Text>
          <Text className="text-justify text-xs font-light">
            {description}{' '}
            {highlightText && (
              <Text className="text-tertiary">{highlightText}</Text>
            )}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
};

export const Card: React.FC = () => {
  return (
    <View>
      <View className="w-96 mx-auto px-3">
        <Text className="text-xl font-regular text-primary mt-8 mb-3">Como Funciona?</Text>
      </View>
      
      <View className="flex-row justify-center gap-4 p-4">
        <AnimatedCard
          imageSource={require('../assets/Banners/banner-card-one.png')}
          title="Solicitação"
          description="Escolha o serviço que você precisa, iremos recomendar um dos nossos profissionais e faça sua solicitação."
        />
        <AnimatedCard
          imageSource={require('../assets/Banners/banner-card-two.png')}
          title="Dúvidas?"
          description="Entre em contato com o nosso atendimento online através do nosso"
          highlightText={
            <TouchableOpacity onPress={() => Linking.openURL("https://wa.me/558496166382")}>
              <Text className="text-primary font-medium">Whatsapp.</Text>
            </TouchableOpacity>
          }
        />
      </View>
    </View>
  );
};