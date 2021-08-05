import React, { useState, useEffect } from "react";
import { Dimensions, Platform } from "react-native";
import { movieApi } from "../../api";
import FavsPresenter from "./FavsPresenter";

export default () => {
  const { width, height } = Dimensions.get("window");
  const [dimensions, setDimensions] = useState({ w: width, h: height });
  const [movies, setMovies] = useState({
    loading: true,
    results: [],
  });
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
        setDimensions({ w: innerWidth, h: innerHeight });
      });
      return () =>
        window.removeEventListener("resize", () => {
          setDimensions({ w: innerWidth, h: innerHeight });
        });
    }
  }, []);
  return (
    <FavsPresenter {...movies} nextPage={setPage} dimensions={dimensions} />
  );
};
