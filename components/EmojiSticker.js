import {View, Image} from "react-native"
import { TapGestureHandler } from 'react-native-gesture-handler';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    useAnimatedGestureHandler,
    withSpring,
  } from 'react-native-reanimated'; // this is what will animate the style on the `<AnimatedImage/>` component

// the `createAnimatedComponent()` can wrap any component
// determines which value is animated
const AnimatedImage = Animated.createAnimatedComponent(Image); // this is to make double tap work 



const EmojiSticker = ({imageSize, stickerSource}) => {

    // takes the value of `imageSize`
    // helps to mutate a piece of data and allows running animations based on the current value
    // shared value can be accessed and modified using the `.value` property which we will use in the `onDoubleTap()` function 
    const scaleImage = useSharedValue(imageSize); 

    // the `useAnimatedGestureHandler()` hook is used to animate the transition 
    const onDoubleTap = useAnimatedGestureHandler({
        onActive: () =>{
            if (scaleImage.value !== imageSize * 2){
                scaleImage.value = scaleImage.value * 2;
            }
        }
    })

    // the `useAnimatedStyle()` hook updates styles when animation happens
    const imageStyle = useAnimatedStyle(()=> {
        return{
            width: withSpring(scaleImage.value), // kinda optional I think- `withSpring()` just gives it a lively look
            height: withSpring(scaleImage.value)
        }
    })

  return (
    <View style={{top: -350}}>
        <TapGestureHandler onGestureEvent={onDoubleTap} numberOfTaps={2}>
            <AnimatedImage 
                source={stickerSource}
                resizeMode="contain"
                style={[imageStyle, {width: imageSize, height: imageSize}]}
            />
        </TapGestureHandler>

    </View>
  )
}

export default EmojiSticker