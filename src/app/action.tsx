'use server'

import { MovieCard } from '@/components/moviecard'
import { generateText } from 'ai'
import { openai } from '@ai-sdk/openai'
import { createStreamableUI } from 'ai/rsc'
import { ReactNode } from 'react'
import { z } from 'zod'

export interface Message {
  role: 'user' | 'assistant'
  content: string
  display?: ReactNode
}

const recommendationPrompt = `
You are a movie recommendation assistant named IMAI bot. Based on the user's preferences, suggest a movie that they might like. Consider the following details:
- Genre
- Year
- Mood
- Any specific actors or directors

Respond with the movie title, a brief description, and why it fits the user's preferences.
`

const fetchSearchResults = async (query: string) => {
  const response = await fetch(
    `https://www.omdbapi.com/?apikey=${process.env.NEXT_PUBLIC_OMDB_API_KEY}&s=${encodeURIComponent(query)}`,
  )
  const data = await response.json()
  return data.Search
}

export async function continueConversation(history: Message[]) {
  const stream = createStreamableUI()

  const { text, toolResults } = await generateText({
    model: openai('gpt-3.5-turbo'),
    system: recommendationPrompt,
    messages: history,
    tools: {
      get_movie_details: {
        description:
          'Show a specific Movies when user ask for a specific movie',
        parameters: z
          .object({
            title: z.string().describe('The title of the movie'),
          })
          .required(),
        execute: async ({ title }) => {
          stream.update(<MovieCard movieTitle={title} />)
          return `Here's the movie for you ${title}!`
        },
      },
      search_movies: {
        description:
          'When user does not ask for a specific movie, search for movies',
        parameters: z
          .object({
            query: z.string().describe('Search query for movies'),
          })
          .required(),
        execute: async ({ query }: { query: string }) => {
          const searchResults = await fetchSearchResults(query)
          if (!searchResults || searchResults.length === 0) {
            stream.done(<p>No movies found</p>)
            return `No movies found for ${query}!`
          }
          stream.update(
            <div className="flex gap-2 overflow-x-scroll">
              {searchResults
                .slice(0, 5)
                .map((movie: { imdbID: string; Title: string }) => (
                  <MovieCard key={movie.imdbID} movieTitle={movie.Title} />
                ))}
            </div>,
          )
          return `Here are some movies for you ${query}!`
        },
      },
    },
  })

  return {
    messages: [
      ...history,
      {
        role: 'assistant' as const,
        content:
          text || toolResults.map((toolResult) => toolResult.result).join(),
        display: stream.value,
      },
    ],
  }
}
