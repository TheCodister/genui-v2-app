'use client'
import useSWR from 'swr'
import { BASE_URL } from '../../constants/BASE_URL'
import { MovieData } from '../../types/schema/schema'
import axios from 'axios'

const fetcher = async (url: string): Promise<MovieData> => {
  const response = await axios.get(url)
  if (response.data.Response === 'False') {
    throw new Error(response.data.Error)
  }
  return response.data
}

export const useGetMovie = (movieTitle: string) => {
  const { data, error } = useSWR<MovieData>(
    movieTitle
      ? `${BASE_URL}?apikey=${process.env.NEXT_PUBLIC_OMDB_API_KEY}&t=${encodeURIComponent(movieTitle)}`
      : null,
    fetcher,
  )

  return {
    data,
    loading: !error && !data,
    error: error ? error.message : null,
  }
}
