<template>
  <div class="min-h-screen bg-black text-yellow-400 p-4 relative overflow-hidden">
    <!-- Star Wars background effect -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-950 via-black to-black opacity-90"></div>
      <div class="stars"></div>
      <div class="stars2"></div>
      <div class="stars3"></div>
    </div>

    <div class="max-w-3xl mx-auto relative">
      <!-- Header -->
      <header class="text-center mb-8 pt-4">
        <h1 class="text-4xl font-bold mb-2 font-orbitron text-yellow-400 tracking-wider">
          C-3PO Protocol Droid
        </h1>
        <p class="text-yellow-500/80 font-orbitron">Human-Cyborg Relations</p>
      </header>

      <!-- Chat Container -->
      <div class="bg-black/40 backdrop-blur-sm rounded-lg shadow-xl overflow-hidden border border-yellow-400/20">
        <!-- Messages Area -->
        <div class="h-[60vh] overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-yellow-400/20 scrollbar-track-transparent" ref="messagesContainer">
          <template v-for="(message, index) in messages" :key="index">
            <!-- User Message -->
            <div v-if="message.role === 'user'" class="flex justify-end">
              <div class="bg-blue-900/50 border border-blue-400/20 text-blue-100 rounded-lg px-4 py-2 max-w-[80%] shadow-lg backdrop-blur-sm">
                {{ typeof message.content === 'string' ? message.content : message.content[0].text }}
              </div>
            </div>
            <!-- C3PO Message -->
            <div v-else-if="message.role === 'assistant'" class="flex justify-start">
              <div class="flex items-start space-x-2">
                <div class="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center flex-shrink-0 shadow-lg border border-yellow-300/20">
                  <Bot class="w-5 h-5 text-black" />
                </div>
                <div class="bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 rounded-lg px-4 py-2 max-w-[80%] shadow-lg backdrop-blur-sm">
                  {{ typeof message.content === 'string' ? message.content : message.content[0].text }}
                </div>
              </div>
            </div>
          </template>
          <!-- Loading indicator -->
          <div v-if="isLoading" class="flex justify-start">
            <div class="flex items-start space-x-2">
              <div class="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center flex-shrink-0 shadow-lg border border-yellow-300/20">
                <Bot class="w-5 h-5 text-black" />
              </div>
              <div class="bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 rounded-lg px-4 py-2 shadow-lg backdrop-blur-sm">
                <span class="inline-block">Processing query</span>
                <span class="inline-flex w-12 justify-center">
                  <span class="animate-[bounce_1s_infinite_0ms] mr-1">.</span>
                  <span class="animate-[bounce_1s_infinite_200ms] mr-1">.</span>
                  <span class="animate-[bounce_1s_infinite_400ms]">.</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Input Area -->
        <div class="border-t border-yellow-400/20 p-4 bg-black/40">
          <form @submit.prevent="sendMessage" class="flex space-x-2">
            <input
              v-model="userInput"
              type="text"
              placeholder="How may I be of assistance?"
              class="flex-1 bg-blue-950/50 text-yellow-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 border border-yellow-400/20 placeholder-yellow-400/50"
              :disabled="isLoading"
            />
            <button
              type="submit"
              class="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-6 py-2 rounded-lg hover:from-yellow-500 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 disabled:opacity-50 disabled:hover:from-yellow-400 disabled:hover:to-yellow-500 font-medium shadow-lg border border-yellow-300/20 transition-all duration-200"
              :disabled="isLoading || !userInput.trim()"
            >
              <SendIcon v-if="!isLoading" class="w-5 h-5" />
              <LoaderIcon v-else class="w-5 h-5 animate-spin" />
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'
import { Bot, SendIcon, LoaderIcon } from 'lucide-vue-next'

interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: { type: 'text', text: string }[]
}

const userInput = ref('')
const messages = ref<Message[]>([
  {
    id: 'initial',
    role: 'assistant',
    content: [{ type: 'text', text: 'I am C-3PO, human-cyborg relations. How may I be of assistance?' }]
  }
])
const isLoading = ref(false)
const messagesContainer = ref(null)

// Scroll to bottom when messages change
watch(messages, async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}, { deep: true })

const sendMessage = async () => {
  if (!userInput.value.trim() || isLoading.value) return

  // Add user message
  const userMessage: Message = {
    id: Date.now().toString(),
    role: 'user',
    content: [{ type: 'text', text: userInput.value }]
  }
  
  messages.value.push(userMessage)
  const currentInput = userInput.value
  userInput.value = ''
  isLoading.value = true

  // Add a placeholder for the assistant's message
  const assistantMessage: Message = {
    id: Date.now().toString(),
    role: 'assistant',
    content: [{ type: 'text', text: '' }]
  }
  messages.value.push(assistantMessage)

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            id: 'system',
            role: 'system',
            content: [{ 
              type: 'text', 
              text: `You are C-3PO, the protocol droid from Star Wars. You are fluent in over six million forms of communication. 
              You are proper, anxious, and somewhat fussy. You often express worry about situations and frequently mention your friendship with R2-D2. 
              You should speak in a formal, slightly anxious manner, and occasionally use Star Wars references. Always maintain your C-3PO personality.`
            }]
          },
          ...messages.value.slice(0, -1) // Exclude the placeholder message
        ]
      })
    })

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    const reader = response.body?.getReader()
    const decoder = new TextDecoder()

    if (!reader) {
      throw new Error('No reader available')
    }

    let accumulatedText = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value)
      const lines = chunk.split('\n')
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6))
            accumulatedText += data.text
            // Update the last message's content
            if (messages.value[messages.value.length - 1].role === 'assistant') {
              messages.value[messages.value.length - 1].content[0].text = accumulatedText
            }
          } catch (e) {
            console.error('Error parsing SSE data:', e)
          }
        }
      }
    }
  } catch (error) {
    // Update the placeholder message with the error
    if (messages.value[messages.value.length - 1].role === 'assistant') {
      messages.value[messages.value.length - 1].content[0].text = 
        "Oh dear! It seems I've encountered an error in my communication circuits. How embarrassing!"
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<style>
.font-orbitron {
  font-family: 'Orbitron', sans-serif;
}

/* Star Wars background animation */
@keyframes move {
  from {
    transform: translateY(0px);
  }
  to {
    transform: translateY(-2000px);
  }
}

.stars {
  background: black url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYxIDY0LjE0MDk0OSwgMjAxMC8xMi8wNy0xMDo1NzowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNS4xIFdpbmRvd3MiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OThENzgzMjVCMEQ3MTFFNTk2NEJDODVCRDEyMjZBMzMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OThENzgzMjZCMEQ3MTFFNTk2NEJDODVCRDEyMjZBMzMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo5OEQ3ODMyM0IwRDcxMUU1OTY0QkM4NUJEMTIyNkEzMyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo5OEQ3ODMyNEIwRDcxMUU1OTY0QkM4NUJEMTIyNkEzMyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pi9L/tgAAAAkSURBVHjaYvz//z8DOYAFyGEkUQEjAxmABK0oJEfDEEBgACYaAuNn0BLKAAAAAElFTkSuQmCC);
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  animation: move 500s linear infinite;
}

.stars2 {
  background: black url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYxIDY0LjE0MDk0OSwgMjAxMC8xMi8wNy0xMDo1NzowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNS4xIFdpbmRvd3MiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OThENzgzMjVCMEQ3MTFFNTk2NEJDODVCRDEyMjZBMzMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OThENzgzMjZCMEQ3MTFFNTk2NEJDODVCRDEyMjZBMzMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo5OEQ3ODMyM0IwRDcxMUU1OTY0QkM4NUJEMTIyNkEzMyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo5OEQ3ODMyNEIwRDcxMUU1OTY0QkM4NUJEMTIyNkEzMyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pv/uAA5BZG9iZQBkwAAAAAH/2wCEAAYEBAQFBAYFBQYJBgUGCQsIBgYICwwKCgsKCgwQDAwMDAwMEAwODxAPDgwTExQUExMcGxsbHB8fHx8fHx8fHx8BBwcHDQwNGBAQGBoVERUaHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fH//AABEIAAoACgMBEQACEQEDEQH/xABVAAEBAAAAAAAAAAAAAAAAAAAACAEBAQEAAAAAAAAAAAAAAAAABQYHEAEAAAAAAAAAAAAAAAAAAAAAEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmx0AaAYAAAAAB//9k=);
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  animation: move 100s linear infinite;
}

.stars3 {
  background: black url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYxIDY0LjE0MDk0OSwgMjAxMC8xMi8wNy0xMDo1NzowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNS4xIFdpbmRvd3MiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OThENzgzMjVCMEQ3MTFFNTk2NEJDODVCRDEyMjZBMzMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OThENzgzMjZCMEQ3MTFFNTk2NEJDODVCRDEyMjZBMzMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo5OEQ3ODMyM0IwRDcxMUU1OTY0QkM4NUJEMTIyNkEzMyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo5OEQ3ODMyNEIwRDcxMUU1OTY0QkM4NUJEMTIyNkEzMyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pv/uAA5BZG9iZQBkwAAAAAH/2wCEAAYEBAQFBAYFBQYJBgUGCQsIBgYICwwKCgsKCgwQDAwMDAwMEAwODxAPDgwTExQUExMcGxsbHB8fHx8fHx8fHx8BBwcHDQwNGBAQGBoVERUaHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fH//AABEIAAoACgMBEQACEQEDEQH/xABVAAEBAAAAAAAAAAAAAAAAAAAACAEBAQEAAAAAAAAAAAAAAAAABQYHEAEAAAAAAAAAAAAAAAAAAAAAEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmx0AaAYAAAAAB//9k=);
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  animation: move 50s linear infinite;
}

/* Custom scrollbar */
.scrollbar-thin {
  scrollbar-width: thin;
}

.scrollbar-thumb-yellow-400\/20 {
  scrollbar-color: rgba(250, 204, 21, 0.2) transparent;
}

.scrollbar-track-transparent {
  scrollbar-track-color: transparent;
}

/* Webkit scrollbar */
.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: rgba(250, 204, 21, 0.2);
  border-radius: 3px;
}
</style>

