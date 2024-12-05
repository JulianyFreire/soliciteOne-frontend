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
                    <Image source={require('../assets/banner1.png')}
                    className='max-h-56 max-w-full'
                    resizeMode="contain"/>
                </View>
                <View>
                    <Image source={require('../assets/banner2.png')}
                    className='max-h-56 max-w-full'
                    resizeMode="contain"/>
                </View>
            </Swiper>
        </View>
    )
}