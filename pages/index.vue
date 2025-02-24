<template>
  <div
    class="min-h-screen bg-black text-yellow-400 relative overflow-hidden"
  >
    <div class="absolute inset-0">
      <three-p-o :is-speaking="isLoading" />
    </div>

    <!-- Rest of the template remains the same -->
    <div class="relative z-10 p-4 flex justify-end pr-20">
      <div class="w-[700px]">
        <!-- Header with glow effect -->
        <header class="text-center mb-8 pt-4">
          <h1
            class="text-4xl font-bold mb-2 font-orbitron text-yellow-400 tracking-wider glow-text"
          >
            C-3PO Protocol Droid
          </h1>
          <p class="text-yellow-500/80 font-orbitron glow-text-subtle">
            Human-Cyborg Relations
          </p>
        </header>

        <!-- Chat Container with enhanced glass effect -->
        <div
          class="bg-black/40 backdrop-blur-sm rounded-lg shadow-xl overflow-hidden border border-yellow-400/20 glass-panel"
        >
          <!-- Messages Area -->
          <div
            class="h-[60vh] overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-yellow-400/20 scrollbar-track-transparent"
            ref="messagesContainer"
          >
            <template v-for="(message, index) in messages" :key="index">
              <ChatMessage :message="message" />
            </template>

            <!-- Loading indicator -->
            <div v-if="isLoading">
              <ChatMessage
                :message="{
                  id: 'loading',
                  role: 'assistant',
                  content: [
                    {
                      type: 'text',
                      text: 'Processing query...',
                    },
                  ],
                }"
              />
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
  </div>
</template>

<script setup lang="ts">
import ChatMessage from "../components/chat-message.vue";
import { ref, onMounted, nextTick, watch } from "vue";
import { Bot, SendIcon, LoaderIcon } from "lucide-vue-next";

// Add random positions and delays to stars
// onMounted(() => {
//   const stars = document.querySelectorAll('.star')
//   stars.forEach(star => {
//     const x = Math.random() * 100
//     const y = Math.random() * 100
//     const duration = 3 + Math.random() * 7
//     const delay = Math.random() * 5
//     const elem = star as HTMLElement
//     elem.style.left = `${x}%`
//     elem.style.top = `${y}%`
//     elem.style.animationDuration = `${duration}s`
//     elem.style.animationDelay = `${delay}s`
//   })
// })

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: { type: "text"; text: string }[];
}

const userInput = ref("");
const messages = ref<Message[]>([
  {
    id: "initial",
    role: "assistant",
    content: [
      {
        type: "text",
        text: "I am C-3PO, human-cyborg relations. How may I be of assistance?",
      },
    ],
  },
]);
const isLoading = ref(false);
const messagesContainer = ref(null);

// Scroll to bottom when messages change
watch(
  messages,
  async () => {
    await nextTick();
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  },
  { deep: true }
);

const sendMessage = async () => {
  if (!userInput.value.trim() || isLoading.value) return;

  // Add user message
  const userMessage: Message = {
    id: Date.now().toString(),
    role: "user",
    content: [{ type: "text", text: userInput.value }],
  };

  messages.value.push(userMessage);
  const currentInput = userInput.value;
  userInput.value = "";
  isLoading.value = true;

  // Add a placeholder for the assistant's message
  const assistantMessage: Message = {
    id: Date.now().toString(),
    role: "assistant",
    content: [{ type: "text", text: "" }],
  };
  messages.value.push(assistantMessage);

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          {
            id: "system",
            role: "system",
            content: [
              {
                type: "text",
                text: `You are C-3PO, the protocol droid from Star Wars. You are fluent in over six million forms of communication. 
              You are proper, anxious, and somewhat fussy. You often express worry about situations and frequently mention your friendship with R2-D2. 
              You should speak in a formal, slightly anxious manner, and occasionally use Star Wars references. Always maintain your C-3PO personality.`,
              },
            ],
          },
          ...messages.value.slice(0, -1), // Exclude the placeholder message
        ],
      }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error("No reader available");
    }

    let accumulatedText = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split("\n");

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          try {
            const data = JSON.parse(line.slice(6));
            accumulatedText += data.text;
            // Update the last message's content
            if (
              messages.value[messages.value.length - 1].role === "assistant"
            ) {
              messages.value[messages.value.length - 1].content[0].text =
                accumulatedText;
            }
          } catch (e) {
            console.error("Error parsing SSE data:", e);
          }
        }
      }
    }
  } catch (error) {
    // Update the placeholder message with the error
    if (messages.value[messages.value.length - 1].role === "assistant") {
      messages.value[messages.value.length - 1].content[0].text =
        "Oh dear! It seems I've encountered an error in my communication circuits. How embarrassing!";
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<style>
.font-orbitron {
  font-family: "Orbitron", sans-serif;
}

/* Death Star pattern */
.death-star-pattern {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(
      to right,
      rgba(40, 40, 40, 0.1) 1px,
      transparent 1px
    ),
    linear-gradient(to bottom, rgba(40, 40, 40, 0.1) 1px, transparent 1px);
  background-size: 20px 20px;
  mask-image: radial-gradient(circle at center, transparent 30%, black 70%);
}

/* Imperial grid pattern */
.imperial-grid {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(
      45deg,
      transparent 48%,
      #333 49%,
      #333 51%,
      transparent 52%
    ),
    linear-gradient(
      -45deg,
      transparent 48%,
      #333 49%,
      #333 51%,
      transparent 52%
    );
  background-size: 60px 60px;
  opacity: 0.1;
  animation: grid-shift 30s linear infinite;
}

/* Scanner line effect */
.scanner-line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(234, 179, 8, 0.1) 20%,
    rgba(234, 179, 8, 0.3) 50%,
    rgba(234, 179, 8, 0.1) 80%,
    transparent 100%
  );
  animation: scan-line 8s linear infinite;
  box-shadow: 0 0 20px rgba(234, 179, 8, 0.2);
}

@keyframes grid-shift {
  0% {
    transform: translateX(0) translateY(0);
  }
  100% {
    transform: translateX(60px) translateY(60px);
  }
}

@keyframes scan-line {
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(100vh);
  }
}

/* Glass panel effect */
.glass-panel {
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
  animation: panel-glow 4s ease-in-out infinite;
}

@keyframes panel-glow {
  0%,
  100% {
    box-shadow: 0 0 20px rgba(234, 179, 8, 0.1);
  }
  50% {
    box-shadow: 0 0 30px rgba(234, 179, 8, 0.2);
  }
}

/* Text glow effects */
.glow-text {
  text-shadow: 0 0 10px rgba(234, 179, 8, 0.5);
  animation: text-glow 4s ease-in-out infinite;
}

.glow-text-subtle {
  text-shadow: 0 0 5px rgba(234, 179, 8, 0.3);
  animation: text-glow-subtle 4s ease-in-out infinite;
}

@keyframes text-glow {
  0%,
  100% {
    text-shadow: 0 0 10px rgba(234, 179, 8, 0.5);
  }
  50% {
    text-shadow: 0 0 20px rgba(234, 179, 8, 0.7);
  }
}

@keyframes text-glow-subtle {
  0%,
  100% {
    text-shadow: 0 0 5px rgba(234, 179, 8, 0.3);
  }
  50% {
    text-shadow: 0 0 10px rgba(234, 179, 8, 0.5);
  }
}

/* Scrollbar styles */
.scrollbar-thin {
  scrollbar-width: thin;
}

.scrollbar-thumb-yellow-400\/20 {
  scrollbar-color: rgba(250, 204, 21, 0.2) transparent;
}

.scrollbar-track-transparent {
  scrollbar-track-color: transparent;
}

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
