import { View, Image } from 'react-native';
import Swiper from 'react-native-swiper';

export function Slider() {
    return (
        <View className="w-full h-64 p-3">
            <Swiper
                autoplay={true}
                autoplayTimeout={4}
                loop={true}
                showsPagination={false}
            >
                <View className="flex-1 items-center">
                    <Image
                        source={require('../assets/Banners/banner-carousel-one.png')}
                        style={{ width: 380, height: 200 }}
                        className="w-full h-56 rounded-xl"
                        resizeMode="cover"
                    />
                </View>
                <View className="flex-1 items-center">
                    <Image
                        source={require('../assets/Banners/banner-carousel-two.png')}
                        style={{ width: 380, height: 200 }}
                        className="w-full h-56 rounded-xl"
                        resizeMode="cover"
                    />
                </View>
            </Swiper>
        </View>
    );
}
