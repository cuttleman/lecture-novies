import React, { useState } from "react";
import styled from "styled-components/native";
import { Dimensions, PanResponder, Animated } from "react-native";
import { apiImage } from "../../api";

const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");

const Container = styled.View`
  flex: 1;
  background-color: black;
  align-items: center;
  justify-content: center;
`;

const Poster = styled.Image`
  border-radius: 30px;
  width: 100%;
  height: 100%;
`;

export default ({ loading, results, nextPage, dimension }) => {
  const [topIndex, setTopIndex] = useState(0);
  const styles = {
    position: "absolute",
    width: dimension.w / 1.2,
    height: dimension.h / 1.4,
  };
  const nextCard = () => setTopIndex((currentIndex) => currentIndex + 1);
  const position = new Animated.ValueXY();
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, { dx, dy }) => {
      position.setValue({ x: dx, y: dy });
    },
    onPanResponderRelease: (evt, { dx, dy }) => {
      if (topIndex === results.length - 2) {
        nextPage((currentPage) => currentPage + 1);
      }
      if (dx >= 200) {
        Animated.spring(position, {
          toValue: {
            x: WIDTH + 100,
            y: dy,
          },
        }).start(nextCard);
      } else if (dx <= -200) {
        Animated.spring(position, {
          toValue: {
            x: -WIDTH - 100,
            y: dy,
          },
        }).start(nextCard);
      } else {
        Animated.spring(position, {
          toValue: {
            x: 0,
            y: 0,
          },
        }).start();
      }
    },
  });
  const rotationValue = position.x.interpolate({
    inputRange: [-300, 0, 300],
    outputRange: ["-10deg", "0deg", "10deg"],
    extrapolate: "clamp",
  });
  const secondCardOpacity = position.x.interpolate({
    inputRange: [-300, 0, 300],
    outputRange: [1, 0.1, 1],
    extrapolate: "clamp",
  });
  const secondCardScale = position.x.interpolate({
    inputRange: [-300, 0, 300],
    outputRange: [1, 0.85, 1],
    extrapolate: "clamp",
  });
  return (
    <Container>
      {results.map((result, index) => {
        if (index < topIndex) {
          return null;
        } else if (index === topIndex) {
          return (
            <Animated.View
              key={result.id}
              style={{
                ...styles,
                zIndex: 1,
                transform: [
                  { rotate: rotationValue },
                  ...position.getTranslateTransform(),
                ],
              }}
              {...panResponder.panHandlers}
            >
              <Poster source={{ uri: apiImage(result.poster_path) }} />
            </Animated.View>
          );
        } else if (index === topIndex + 1) {
          return (
            <Animated.View
              key={result.id}
              style={{
                ...styles,
                opacity: secondCardOpacity,
                transform: [{ scale: secondCardScale }],
              }}
              {...panResponder.panHandlers}
            >
              <Poster source={{ uri: apiImage(result.poster_path) }} />
            </Animated.View>
          );
        }
      })}
    </Container>
  );
};
