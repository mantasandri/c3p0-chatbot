import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"
import { defineEventHandler, readBody, createError, setHeader } from "h3"

interface Message {
  id: string
  role: "user" | "assistant" | "system"
  content: { type: "text"; text: string }[]
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { messages }: { messages: Message[] } = body

    // Set headers for streaming
    setHeader(event, "Content-Type", "text/event-stream")
    setHeader(event, "Cache-Control", "no-cache")
    setHeader(event, "Connection", "keep-alive")

    const result = await streamText({
      model: openai("gpt-4-turbo"),
      messages: messages.map((msg) => ({
        role: msg.role,
        content: msg.content.map((c) => c.text).join(" "),
      })),
    })

    // Create a readable stream from the text chunks
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Consume the text stream
          for await (const chunk of result.textStream) {
            // Send each chunk as a server-sent event
            const data = `data: ${JSON.stringify({ text: chunk })}\n\n`
            controller.enqueue(new TextEncoder().encode(data))
          }
          controller.close()
        } catch (error) {
          controller.error(error)
        }
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    })
  } catch (error) {
    console.error("Chat API Error:", error)
    throw createError({
      statusCode: 500,
      message: "Oh my! Something seems to have gone wrong with my circuits!",
    })
  }
})

