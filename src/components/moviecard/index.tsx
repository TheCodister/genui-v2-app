import { Link } from '@radix-ui/themes'
import axios from 'axios'
import { MovieData } from '@/types/schema/schema'
import { BASE_URL } from '@/constants/BASE_URL'
import { IMDB_URL } from '@/constants/IMDB_URL'
import { Card, Text } from '@radix-ui/themes'

type MovieCardProps = {
  movieTitle: string
}

export async function MovieCard({
  movieTitle,
}: MovieCardProps): Promise<JSX.Element> {
  const data = await axios.get<MovieData>(
    `${BASE_URL}?apikey=${process.env.NEXT_PUBLIC_OMDB_API_KEY}&t=${encodeURIComponent(movieTitle)}`,
  )
  // const { data } = useGetMovie(movieTitle);

  const movie = data.data

  return (
    <Link href={`${IMDB_URL}${movie.imdbID}`}>
      <Card
        size="4"
        variant="surface"
        asChild
        className="flex flex-col min-w-[380px]"
      >
        <div className="py-4">
          <div className="flex gap-3 items-center">
            <Text size="2" className="uppercase font-bold">
              {movie.Genre}
            </Text>
            <Text size="1" color="gray">
              {movie.Year}
            </Text>
          </div>
          <ul className="flex gap-3">
            {(movie.Ratings.length > 2
              ? movie.Ratings.slice(0, 2)
              : movie.Ratings
            ).map((rating, index) => (
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
            className="w-full object-cover rounded-xl self-center"
            src={movie.Poster}
          />
          {
            //Have to use img tag because Image component doesn't support external images
          }
          <Text size="2" className="mt-4">
            Description: {movie.Plot}
          </Text>
        </div>
      </Card>
    </Link>
  )
}
