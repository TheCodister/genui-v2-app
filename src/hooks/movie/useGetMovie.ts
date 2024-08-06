// import { useState, useEffect } from 'react';
import axios from "axios";
import { BASE_URL } from "../../constants/BASE_URL";
import { MovieData } from "../../types/schema/schema";
import { useEffect, useState } from "react";

export const useGetMovie = (movieTitle: string) => {
  const [data, setData] = useState<MovieData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!movieTitle) return;

    const fetchMovie = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get<MovieData>(
          `${BASE_URL}?apikey=${process.env.NEXT_PUBLIC_OMDB_API_KEY}&t=${encodeURIComponent(movieTitle)}`
        );

        if (response.data.Response === "False") {
          throw new Error("No movie found");
        }

        setData(response.data);
      } catch (err) {
        setError("No movie found");
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [movieTitle]);

  return {
    data,
    loading,
    error,
  };
};
