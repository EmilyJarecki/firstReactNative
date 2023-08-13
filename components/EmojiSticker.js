import {View, Image} from "react-native"
import { TapGestureHandler, PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    useAnimatedGestureHandler,
    withSpring,
  } from 'react-native-reanimated'; // this is what will animate the style on the `<AnimatedImage/>` component

// the `createAnimatedComponent()` can wrap any component
// determines which value is animated

//THESE ARE BOTH COMPONENTS
const AnimatedImage = Animated.createAnimatedComponent(Image); // this is to make double tap work 
const AnimatedView = Animated.createAnimatedComponent(View);



const EmojiSticker = ({imageSize, stickerSource}) => {

    // takes the value of `imageSize`
    // helps to mutate a piece of data and allows running animations based on the current value
    // shared value can be accessed and modified using the `.value` property which we will use in the `onDoubleTap()` function 
    const scaleImage = useSharedValue(imageSize); 

    // translation values and need two seperate ones because it will be moving across the entire screen
    // the `usedSharedValue()` hook decides initial position
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);

    // the `useAnimatedGestureHandler()` hook is used to animate the transition 
    const onDoubleTap = useAnimatedGestureHandler({
        onActive: () =>{
            if (scaleImage.value !== imageSize * 2){
                scaleImage.value = scaleImage.value * 2;
            }
        }
    })

    const onDrag = useAnimatedGestureHandler({
        // when the gesture starts and its original position
        onStart: (event, context) => {
            // context will store the initial values of `translateX` and `translateY`
            context.translateX = translateX.value;
            context.translateY = translateY.value;
        },

        // when the gesture is moving
        onActive: (event, context) => {
            // `event` to get the current position of the pan gesture
            // `context` to get the previously stored values of `translateX` and `translateY`
            translateX.value = event.translationX + context.translateX;
            translateY.value = event.translationY + context.translateY;
          },
    })


    // the `useAnimatedStyle()` hook updates styles when animation happens
    const imageStyle = useAnimatedStyle(()=> {
        return{
            width: withSpring(scaleImage.value), // kinda optional I think- `withSpring()` just gives it a lively look
            height: withSpring(scaleImage.value)
        }
    })

    // the `useAnimatedStyle()` hook returns an array of transforms
    const containerStyle = useAnimatedStyle(() => {
        return {
          transform: [
            {
              translateX: translateX.value,
            },
            {
              translateY: translateY.value,
            },
          ],
        };
      });
      

  return (
    <PanGestureHandler onGestureEvent={onDrag}>
        <AnimatedView style={[containerStyle, {top: -350}]}>
            <TapGestureHandler onGestureEvent={onDoubleTap} numberOfTaps={2}>
                <AnimatedImage 
                    source={stickerSource}
                    resizeMode="contain"
                    style={[imageStyle, {width: imageSize, height: imageSize}]}
                />
            </TapGestureHandler>
        </AnimatedView>
    </PanGestureHandler>
  )
}

export default EmojiSticker