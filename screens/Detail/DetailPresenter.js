import React from "react";
import styled from "styled-components/native";
import Loaded from "../../components/Loaded";
import Poster from "../../components/Poster";
import { ScrollView, Dimensions } from "react-native";
import { apiImage } from "../../api";
import { format, trimText } from "../../utils";
import ContentsTitle from "../../components/ContentsTitle";
import Vote from "../../components/Vote";
import { TouchableOpacity } from "react-native-gesture-handler";

const { height: HEIGHT } = Dimensions.get("window");
const Container = styled.ScrollView``;
const Header = styled.View`
  width: 100%;
  height: ${HEIGHT / 3}px;
  justify-content: flex-end;
`;
const BgImage = styled.Image`
  width: 100%;
  height: 100%;
  opacity: 0.2;
  position: absolute;
`;
const HeaderContent = styled.View`
  top: 40px;
  justify-content: center;
  flex-direction: row;
`;
const Info = styled.View`
  width: 40%;
  margin-left: 20px;
  justify-content: center;
`;
const Title = styled.Text`
  color: white;
  margin-bottom: 5px;
  font-size: 17px;
  font-weight: 600;
`;
const Data = styled.View`
  margin-top: 10px;
  padding: 40px;
  opacity: 0.7;
`;
const DataContent = styled.View`
  margin-vertical: 10px;
`;
const DataText = styled.Text`
  color: white;
`;
const PosterContainer = styled.View`
  padding-horizontal: 5px;
`;
const PosterName = styled.Text`
  color: white;
  font-size: 13px;
  text-align: center;
`;
const ImdbLink = styled.Text`
  font-weight: bolder;
  background-color: #f9ca24;
  padding: 4px 8px;
  border-radius: 5px;
  width: fit-content;
  font-size: 13px;
`;

export default ({ loading, result, openUrlFn }) => {
  console.log(result);
  return (
    <Loaded loading={loading} refreshFn={null}>
      <Container showsVerticalScrollIndicator={false}>
        <Header>
          <BgImage source={{ uri: apiImage(result.backgroundImage) }} />
          <HeaderContent>
            <Poster url={result.poster} isDetail={true} />
            <Info>
              <Title>{result.title}</Title>
              <Vote vote={result.vote} />
            </Info>
          </HeaderContent>
        </Header>
        <Data>
          <DataContent>
            <ContentsTitle title={"줄거리"} />
            <DataText>
              {result.overview
                ? result.overview
                : "한국어로 된 줄거리가 등록되어 있지 않습니다."}
            </DataText>
          </DataContent>
          {result.runtime && (
            <DataContent>
              <ContentsTitle title={"상영시간"} />
              <DataText>{`${result.runtime}분`}</DataText>
            </DataContent>
          )}
          {result.release_date && (
            <DataContent>
              <ContentsTitle title={"개봉일"} />
              <DataText>{format(result.release_date)}</DataText>
            </DataContent>
          )}
          {result.first_air_date && (
            <DataContent>
              <ContentsTitle title={"첫 방송일"} />
              <DataText>{format(result.first_air_date)}</DataText>
            </DataContent>
          )}
          {result.genres && (
            <DataContent>
              <ContentsTitle title={"장르"} />
              <DataText>
                {result.genres.map((genre, i) =>
                  i === result.genres.length - 1
                    ? `${genre.name}`
                    : `${genre.name}, `
                )}
              </DataText>
            </DataContent>
          )}
          {result.seasons && (
            <DataContent>
              <ContentsTitle title={"시즌 정보"} />
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
              >
                {result.seasons.map((s) => (
                  <PosterContainer key={s.id}>
                    <Poster url={s.poster_path} />
                    <PosterName>{trimText(s.name, 6)}</PosterName>
                  </PosterContainer>
                ))}
              </ScrollView>
            </DataContent>
          )}
          {result.created_by && result.created_by.length > 0 && (
            <DataContent>
              <ContentsTitle title={"제작자"} />
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
              >
                {result.created_by.map((creator) => (
                  <PosterContainer key={creator.id}>
                    <Poster url={creator.profile_path} />
                    <PosterName style={{ width: 80 }}>
                      {creator.name}
                    </PosterName>
                  </PosterContainer>
                ))}
              </ScrollView>
            </DataContent>
          )}
          {result.imdb_id && (
            <DataContent>
              <ContentsTitle title={"IMDB 링크"} />
              <TouchableOpacity onPress={() => openUrlFn(result.imdb_id)}>
                <ImdbLink>IMDB</ImdbLink>
              </TouchableOpacity>
            </DataContent>
          )}
        </Data>
      </Container>
    </Loaded>
  );
};
