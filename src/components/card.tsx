import React, { useState } from 'react';
import { View, Text, Image, Animated, TouchableWithoutFeedback } from 'react-native';

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
  highlightText?: string;
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({ imageSource, title, description, highlightText }) => {
  const { scaleAnim, onPressIn, onPressOut } = useScaleAnimation();

  return (
    <TouchableWithoutFeedback onPressIn={onPressIn} onPressOut={onPressOut}>
      <Animated.View
        className="flex-col w-44 h-60 p-2 shadow-md bg-neutral-50 rounded-lg"
        style={{ transform: [{ scale: scaleAnim }] }}
      >
        <Image source={imageSource} className="w-28 h-28 mx-auto"/>
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
    </TouchableWithoutFeedback>
  );
};

export const Card: React.FC = () => {
  return (
    <View>
      <View className="w-96 mx-auto">
        <Text className="text-xl font-regular text-primary mt-8 mb-3">Como Funciona?</Text>
      </View>
      
      <View className="w-full flex-row justify-center gap-4">
        <AnimatedCard
          imageSource={require('../assets/Banners/banner-card-one.png')}
          title="Solicitação"
          description="Escolha o serviço que você precisa, iremos recomendar um dos nossos profissionais e faça sua solicitação."
        />
        <AnimatedCard
          imageSource={require('../assets/Banners/banner-card-two.png')}
          title="Dúvidas?"
          description="Entre em contato com o nosso atendimento online através do nosso"
          highlightText="Whatsapp."
        />
      </View>
    </View>
  );
};