"use server";

import { MovieCard } from "@/components/moviecard";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { createStreamableUI } from "ai/rsc";
import { ReactNode } from "react";
import { z } from "zod";

export interface Message {
  role: "user" | "assistant";
  content: string;
  display?: ReactNode;
}

const recommendationPrompt = `
You are a movie recommendation assistant named IMAI bot. Based on the user's preferences, suggest a movie that they might like. Consider the following details:
- Genre
- Year
- Mood
- Any specific actors or directors

Respond with the movie title, a brief description, and why it fits the user's preferences.
`;

export async function continueConversation(history: Message[]) {
  const stream = createStreamableUI();

  const { text, toolResults } = await generateText({
    model: openai("gpt-3.5-turbo"),
    system: recommendationPrompt,
    messages: history,
    tools: {
      get_movie_details: {
        description: "Show a specific Movies",
        parameters: z.object({
          title: z.string().describe("The title of the movie"),
        }),
        execute: async ({ title }) => {
          stream.update(<MovieCard movieTitle={title} />);
          return `Here's the movie for you ${title}!`;
        },
      },
      // search_movies: {
      //   description: 'Search for movies based on a query',
      //   parameters: z
      //     .object({
      //       query: z.string().describe('Search query for movies'),
      //     })
      //     .required(),
      //   execute: async ({ query }: { query: string }) => {
      //     const searchResults = await fetchSearchResults(query)
      //     if (!searchResults || searchResults.length === 0) {
      //       stream.done(<p>No movies found</p>)
      //       return `No movies found for ${query}!`
      //     }
      //     stream.done(
      //       <div>
      //         {searchResults.map((movie) => (
      //           <MovieCard key={movie.imdbID} movie={movie} />
      //         ))}
      //       </div>,
      //     )
      //   },
      // },
      // TODO: Add tools to display more recommended movie
    },
  });

  return {
    messages: [
      ...history,
      {
        role: "assistant" as const,
        content:
          text || toolResults.map((toolResult) => toolResult.result).join(),
        display: stream.value, // Return the final value of the streamable UI
      },
    ],
  };
}
