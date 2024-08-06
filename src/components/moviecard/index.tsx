import Image from "next/image";
import { Link } from "@radix-ui/themes";
import axios from "axios";
import { MovieData } from "@/types/schema/schema";
import { BASE_URL } from "@/constants/BASE_URL";
import { IMDB_URL } from "@/constants/IMDB_URL";
import { Card, Text } from "@radix-ui/themes";

type MovieCardProps = {
  movieTitle: string;
};

export async function MovieCard({
  movieTitle,
}: MovieCardProps): Promise<JSX.Element> {
  const data = await axios.get<MovieData>(
    `${BASE_URL}?apikey=${process.env.NEXT_PUBLIC_OMDB_API_KEY}&t=${encodeURIComponent(movieTitle)}`
  );

  const movie = data.data;

  return (
    <Link href={`${IMDB_URL}${movie.imdbID}`}>
      <Card size="3" variant="surface" asChild>
        <div className="py-4 w-[300px]">
          <div className="flex gap-3 items-center">
            <Text size="2" className="uppercase font-bold">
              {movie.Genre}
            </Text>
            <Text size="1" color="gray">
              {movie.Year}
            </Text>
          </div>
          <ul className="flex gap-3">
            {movie.Ratings.slice(0, 2).map((rating, index) => (
              <Text key={index} size="1" color="gray">
                {rating.Source}: {rating.Value}
              </Text>
            ))}
          </ul>
          <Text size="4" className="font-bold">
            {movie.Title}
          </Text>
          <img
            alt={`${movie.Title} Poster`}
            className="object-cover rounded-xl"
            src={movie.Poster}
            width={270}
            height={400}
          />
          <Text size="2" className="mt-4">
            Description: {movie.Plot}
          </Text>
        </div>
      </Card>
    </Link>
  );
}
