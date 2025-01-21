import { View, Text, Image } from 'react-native';
import Swiper from 'react-native-swiper';

export function Slider() {
    return (
        <View className='w-full h-56 p-4 my-3'>
            <Swiper
                autoplay={true}
                autoplayTimeout={4}
                loop={true}
                showsPagination={false}
            >
                <View>
                    <Image source={require('../assets/Banners/banner-card-one.png')}
                    className='h-60 w-full rounded-lg'
                    resizeMode="contain"/>
                </View>
                <View>
                    <Image source={require('../assets/Banners/banner-card-two.png')}
                    className='h-60 w-full rounded-lg'
                    resizeMode="contain"/>
                </View>
            </Swiper>
        </View>
    )
}