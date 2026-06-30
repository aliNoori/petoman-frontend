// stores/player.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePlayerStore = defineStore('player', () => {
    const currentTime = ref(0)
    const playingMediaId = ref('')

    const setTime = (time: number) => {
        currentTime.value = time
    }

    const setMedia = (id: string) => {
        playingMediaId.value = id
    }

    return { currentTime, playingMediaId, setTime, setMedia }
})
