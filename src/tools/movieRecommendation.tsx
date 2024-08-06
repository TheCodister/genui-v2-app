import { z } from "zod";
import { useGetMovie } from "../hooks/movie/useGetMovie";
import { useGetSearchMovies } from "../hooks/movie/useGetSearchMovies";
import MovieCard from "../components/moviecard";

const fetchMovieData = async (title: string) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data: movie, error } = useGetMovie(title);
  if (error) throw new Error(error);
  return movie;
};

const fetchSearchResults = async (query: string) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data: searchResults, error } = useGetSearchMovies(query);
  if (error) throw new Error(error);
  return searchResults;
};

export const movieRecommendationTools = {
  get_movie_details: {
    description: "Get details of a specific movie",
    parameters: z
      .object({
        title: z.string().describe("The title of the movie"),
      })
      .required(),
    generate: async ({ title }: { title: string }) => {
      const movie = await fetchMovieData(title);
      if (!movie) {
        return <p>No movie found</p>;
      }
      return <MovieCard movie={movie} />;
    },
  },
  search_movies: {
    description: "Search for movies based on a query",
    parameters: z
      .object({
        query: z.string().describe("Search query for movies"),
      })
      .required(),
    generate: async ({ query }: { query: string }) => {
      const searchResults = await fetchSearchResults(query);
      if (!searchResults || searchResults.length === 0) {
        return <p>No movies found</p>;
      }
      return (
        <div>
          {searchResults.map((movie) => (
            <MovieCard key={movie.imdbID} movie={movie} />
          ))}
        </div>
      );
    },
  },
};
