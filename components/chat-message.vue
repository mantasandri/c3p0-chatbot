<template>
  <div :class="[
    'flex',
    message.role === 'user' ? 'justify-end' : 'justify-start'
  ]">
    <div class="flex items-start space-x-2" :class="[
      message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
    ]">
      <!-- Avatar for C-3PO -->
      <div v-if="message.role === 'assistant'" 
           class="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center flex-shrink-0 shadow-lg border border-yellow-300/20 avatar-glow relative">
        <div class="absolute inset-0 rounded-full imperial-pattern opacity-20"></div>
        <Bot class="w-5 h-5 text-black relative z-10" />
      </div>
      
      <!-- Message Bubble -->
      <div :class="[
        'px-4 py-2 max-w-[80%] shadow-lg backdrop-blur-sm rounded-lg relative overflow-hidden',
        message.role === 'user' 
          ? 'bg-blue-900/50 border border-blue-400/20 text-blue-100 message-glow-blue' 
          : 'bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 message-glow-gold'
      ]">
        <div class="absolute inset-0 imperial-pattern opacity-10"></div>
        <div class="relative z-10">
          {{ typeof message.content === 'string' ? message.content : message.content[0].text }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Bot } from 'lucide-vue-next'

interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: { type: 'text', text: string }[]
}

defineProps<{
  message: Message
}>()
</script>

<style scoped>
.imperial-pattern {
  background-image: 
    linear-gradient(45deg, transparent 48%, currentColor 49%, currentColor 51%, transparent 52%),
    linear-gradient(-45deg, transparent 48%, currentColor 49%, currentColor 51%, transparent 52%);
  background-size: 20px 20px;
}

.avatar-glow {
  animation: avatar-pulse 4s ease-in-out infinite;
}

@keyframes avatar-pulse {
  0%, 100% {
    box-shadow: 0 0 10px rgba(234, 179, 8, 0.3);
  }
  50% {
    box-shadow: 0 0 20px rgba(234, 179, 8, 0.5);
  }
}

.message-glow-gold {
  animation: message-glow-gold 4s ease-in-out infinite;
}

.message-glow-blue {
  animation: message-glow-blue 4s ease-in-out infinite;
}

@keyframes message-glow-gold {
  0%, 100% {
    box-shadow: 0 0 10px rgba(234, 179, 8, 0.1);
  }
  50% {
    box-shadow: 0 0 20px rgba(234, 179, 8, 0.2);
  }
}

@keyframes message-glow-blue {
  0%, 100% {
    box-shadow: 0 0 10px rgba(59, 130, 246, 0.1);
  }
  50% {
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.2);
  }
}
</style>

