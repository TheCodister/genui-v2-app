'use client'

import { Message, continueConversation } from './action'
import { useState } from 'react'
import { TextField, Button, Avatar } from '@radix-ui/themes'
import Markdown from 'react-markdown'

export default function Chat() {
  const [input, setInput] = useState<string>('')
  const [conversation, setConversation] = useState<Message[]>([])

  return (
    <div className="mx-auto w-full max-w-md py-24 flex flex-col stretch relative">
      <div className="flex-grow overflow-y-auto mb-24 px-4">
        {conversation.map((m, index) => (
          <div className="flex flex-col overflow-auto" key={index}>
            <div
              className={`flex my-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.role === 'assistant' ? (
                <Avatar
                  radius="full"
                  className="mr-4"
                  fallback="AI"
                  width={40}
                  height={40}
                />
              ) : null}
              <div
                className={`p-4 text-black rounded-xl w-72 text-start ${
                  m.role === 'user'
                    ? 'bg-green-100 text-left'
                    : 'bg-blue-100 text-right'
                }`}
              >
                <Markdown>{m.content}</Markdown>
              </div>
            </div>
            <div className="">{m.display}</div>
          </div>
        ))}
        {/* 
        {isLoading && (
          <div className="flex items-center justify-start my-2">
            <span>AI: </span>
            <Spinner className="ml-2" size="sm" />
          </div>
        )} */}
      </div>

      <form
        className="fixed bottom-0 w-full max-w-md p-4 flex items-center bg-white"
        onSubmit={async (e) => {
          e.preventDefault()
          const { messages } = await continueConversation([
            // exclude React components from being sent back to the server:
            ...conversation.map(({ role, content }) => ({ role, content })),
            { role: 'user', content: input },
          ])

          setConversation(messages)
          setInput('') // Clear the input after submission
        }}
      >
        <TextField.Root
          className="flex-grow mr-2"
          placeholder="Say something..."
          size="3"
          value={input}
          onChange={(event) => {
            setInput(event.target.value)
          }}
        />
        <Button type="submit" size="3" color="indigo" variant="solid">
          Send
        </Button>
      </form>
    </div>
  )
}
