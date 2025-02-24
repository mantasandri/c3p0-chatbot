<template>
  <div class="absolute inset-0 bg-[#0a0505] overflow-hidden">
    <!-- Animated Starfield -->
    <div class="absolute inset-0 opacity-70">
      <div v-for="i in 50" :key="i" 
        class="star absolute rounded-full bg-white"
        :style="{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          width: `${Math.random() * 2 + 1}px`,
          height: `${Math.random() * 2 + 1}px`,
          animationDelay: `${Math.random() * 5}s`,
          animationDuration: `${Math.random() * 3 + 2}s`
        }"
      ></div>
    </div>

    <!-- Floating Particles -->
    <div class="absolute inset-0">
      <div v-for="i in 30" :key="i" 
        class="particle absolute rounded-full"
        :style="{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          width: `${Math.random() * 3 + 1}px`,
          height: `${Math.random() * 3 + 1}px`,
          backgroundColor: `rgba(255, 215, 0, ${Math.random() * 0.2})`,
          animationDelay: `${Math.random() * 5}s`,
          animationDuration: `${Math.random() * 10 + 5}s`
        }"
      ></div>
    </div>

    <!-- Gradient Background -->
    <div class="absolute inset-0 bg-gradient-radial from-blue-900/20 via-[#0a0505] to-[#0a0505]"></div>

    <!-- Subtle Light Beams -->
    <div class="absolute inset-0 overflow-hidden">
      <div v-for="i in 3" :key="i"
        class="light-beam absolute"
        :style="{
          left: `${30 + i * 20}%`,
          height: '200%',
          width: '1px',
          backgroundColor: 'rgba(255, 215, 0, 0.1)',
          transform: `rotate(${45 + i * 15}deg)`,
          animationDelay: `${i * 2}s`
        }"
      ></div>
    </div>

    <div class="absolute left-[500px] top-1/2 w-[500px] h-[500px]">
      <!-- LEGO C-3PO Head Container -->
      <div class="relative w-full h-full animate-subtle-float">
        <!-- Main Head Shape -->
        <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[340px]">
          <!-- Back Head Piece -->
          <div class="absolute inset-0 bg-gradient-to-br from-[#ffd700] via-[#ffed4a] to-[#b8860b] rounded-[30px] shadow-lg animate-shine">
            <!-- LEGO Connection Top -->
            <div class="absolute -top-6 left-1/2 -translate-x-1/2 w-24 h-6 bg-[#b8860b] rounded-t-lg">
              <!-- LEGO Studs -->
              <div class="absolute top-0 inset-x-2 flex justify-around">
                <div class="w-6 h-3 bg-[#ffd700] rounded-t-full shadow-inner"></div>
                <div class="w-6 h-3 bg-[#ffd700] rounded-t-full shadow-inner"></div>
              </div>
            </div>

            <!-- Side Clips (LEGO Connection Points) -->
            <div class="absolute top-1/4 -left-2 w-4 h-12 bg-[#b8860b] rounded-l-lg">
              <div class="absolute top-1/2 -translate-y-1/2 right-0 w-2 h-8 bg-[#1a1a1a] rounded-l"></div>
            </div>
            <div class="absolute top-1/4 -right-2 w-4 h-12 bg-[#b8860b] rounded-r-lg">
              <div class="absolute top-1/2 -translate-y-1/2 left-0 w-2 h-8 bg-[#1a1a1a] rounded-r"></div>
            </div>
          </div>

          <!-- Face Plate -->
          <div class="absolute inset-x-[30px] inset-y-[20px] bg-gradient-to-br from-[#ffd700] via-[#ffed4a] to-[#b8860b] rounded-[20px] shadow-inner">
            <!-- LEGO Plastic Texture Effect -->
            <div class="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent rounded-[20px]"></div>

            <!-- LEGO Eyes - Enhanced with speaking animation -->
            <div class="absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-10">
              <!-- Left Eye -->
              <div class="relative w-14 h-14">
                <div class="absolute inset-0 rounded-lg bg-black border-2 border-[#1a1a1a] animate-blink">
                  <div class="absolute inset-2 rounded-lg bg-[#333]"></div>
                  <div 
                    class="absolute inset-3 rounded-lg bg-yellow-400 transition-all duration-300"
                    :class="{'animate-talk-glow': isSpeaking}"
                  ></div>
                </div>
              </div>
              <!-- Right Eye -->
              <div class="relative w-14 h-14">
                <div class="absolute inset-0 rounded-lg bg-black border-2 border-[#1a1a1a] animate-blink">
                  <div class="absolute inset-2 rounded-lg bg-[#333]"></div>
                  <div 
                    class="absolute inset-3 rounded-lg bg-yellow-400 transition-all duration-300"
                    :class="{'animate-talk-glow': isSpeaking}"
                  ></div>
                </div>
              </div>
            </div>

            <!-- LEGO Mouth Grille - Enhanced with speaking animation -->
            <div 
              class="absolute top-[60%] left-1/2 -translate-x-1/2 w-[160px] h-[60px] bg-[#1a1a1a] rounded overflow-hidden"
              :class="{'speaking': isSpeaking}"
            >
              <!-- Animated grille pattern -->
              <div 
                class="absolute inset-2 grid grid-cols-6 gap-1 transition-all duration-300"
                :class="{'animate-talk-mouth': isSpeaking}"
              >
                <template v-for="n in 18" :key="n">
                  <div 
                    class="bg-[#333] rounded transition-all duration-300"
                    :class="{
                      'bg-yellow-400/80 shadow-glow': isGrilleLit(n),
                      'animate-pulse': isSpeaking
                    }"
                  ></div>
                </template>
              </div>
            </div>
          </div>

          <!-- LEGO Neck Connection -->
          <div class="absolute -bottom-4 left-1/2 -translate-x-1/2 w-20 h-8 bg-[#b8860b] rounded-b-lg">
            <!-- LEGO Connection Port -->
            <div class="absolute bottom-0 inset-x-2 h-4 bg-[#1a1a1a] rounded-b flex justify-around items-center px-1">
              <div class="w-3 h-3 bg-[#333] rounded-full"></div>
              <div class="w-3 h-3 bg-[#333] rounded-full"></div>
            </div>
          </div>

          <!-- LEGO Manufacturing Lines -->
          <div class="absolute inset-0 rounded-[30px] overflow-hidden">
            <div class="absolute top-1/2 left-0 right-0 h-[1px] bg-black opacity-5"></div>
            <div class="absolute left-1/2 top-0 bottom-0 w-[1px] bg-black opacity-5"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps<{
  isSpeaking: boolean
}>()

// Function to determine if a specific grille element should be lit
const isGrilleLit = (n: number) => {
  if (!props.isSpeaking) return false
  const time = Date.now() / 150 // Keep the same speed
  // Make the wave pattern more pronounced
  return Math.sin(time + n * 0.5) > 0.2 // Lowered threshold from 0.3 to 0.2 for more active elements
}
</script>

<style scoped>
/* Previous styles remain the same */

/* Star animation */
@keyframes twinkle {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.3;
    transform: scale(0.7);
  }
}

.star {
  animation: twinkle infinite ease-in-out;
}

/* Particle animation */
@keyframes float-particle {
  0% {
    transform: translate(0, 0) rotate(0deg);
  }
  33% {
    transform: translate(30px, -30px) rotate(120deg);
  }
  66% {
    transform: translate(-20px, 20px) rotate(240deg);
  }
  100% {
    transform: translate(0, 0) rotate(360deg);
  }
}

.particle {
  animation: float-particle infinite linear;
}

/* Light beam animation */
@keyframes beam-glow {
  0%, 100% {
    opacity: 0.1;
    filter: blur(3px);
  }
  50% {
    opacity: 0.3;
    filter: blur(5px);
  }
}

.light-beam {
  animation: beam-glow 4s infinite ease-in-out;
  filter: blur(3px);
}

/* Add to existing background gradients */
.bg-gradient-radial {
  background-image: radial-gradient(circle at center, var(--tw-gradient-from) 0%, var(--tw-gradient-via) 40%, var(--tw-gradient-to) 100%);
}

@keyframes float {
  0%, 100% {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  25% {
    transform: translate(-50%, -52%) rotate(1deg);
  }
  75% {
    transform: translate(-50%, -48%) rotate(-1deg);
  }
}

@keyframes shine {
  0%, 100% {
    filter: brightness(1);
  }
  50% {
    filter: brightness(1.15);
  }
}

@keyframes blink {
  0%, 95%, 100% {
    transform: scaleY(1);
  }
  97% {
    transform: scaleY(0.2);
  }
}

@keyframes talk-glow {
  0%, 100% {
    opacity: 0.8;
    filter: brightness(1.2);
  }
  50% {
    opacity: 1;
    filter: brightness(1.8);
  }
}

@keyframes talk-mouth {
  0%, 100% {
    transform: scaleY(1);
  }
  50% {
    transform: scaleY(0.8);
  }
}

.animate-subtle-float {
  animation: float 6s ease-in-out infinite;
}

.animate-shine {
  animation: shine 4s ease-in-out infinite;
}

.animate-blink {
  animation: blink 5s infinite;
}

.animate-talk-glow {
  animation: talk-glow 1s ease-in-out infinite;
}

.animate-talk-mouth {
  animation: talk-mouth 0.3s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.8;
    filter: brightness(1);
  }
  50% {
    opacity: 1;
    filter: brightness(1.5);
  }
}

.speaking {
  border: 1px solid rgba(255, 215, 0, 0.4);
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.3);
}

/* Add new shadow-glow class */
.shadow-glow {
  box-shadow: 0 0 8px rgba(255, 215, 0, 0.6);
}
</style>
