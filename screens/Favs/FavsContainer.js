import React, { useState, useEffect } from "react";
import { Dimensions, Platform } from "react-native";
import { movieApi } from "../../api";
import FavsPresenter from "./FavsPresenter";

const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");

export default () => {
  const [movies, setMovies] = useState({
    loading: true,
    results: [],
  });
  const [dimension, setDimention] = useState({ w: WIDTH, h: HEIGHT });
  const [page, setPage] = useState(1);
  const getData = async (pageNum) => {
    const [getMovies, getMoviesError] = await movieApi.discover(pageNum);
    setMovies({
      loading: false,
      results: [...movies.results, ...getMovies],
    });
  };
  useEffect(() => {
    getData(page);
  }, [page]);

  useEffect(() => {
    if (Platform.OS === "web") {
      window.addEventListener("resize", () => {
        setDimention({ w: innerWidth, h: innerHeight });
      });
      return () =>
        window.removeEventListener("resize", () => {
          setDimention({ w: innerWidth, h: innerHeight });
        });
    }
  }, []);

  return <FavsPresenter {...movies} nextPage={setPage} dimension={dimension} />;
};
