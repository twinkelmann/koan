<template>
  <main class="w-full text-gray-100 flex flex-col">
    <!-- header -->
    <section class="flex flex-col items-center my-10">
      <h1 class="text-3xl font-bold">Welcome back to Kōan</h1>
      <p class="mb-6">
        Kōan (公案) (/ˈkoʊæn, -ɑːn/) is a story, dialogue, question, or
        statement which is used in Zen practice to provoke the "great doubt" and
        to practice or test a student's progress in Zen.
      </p>
      <h2 class="text-xl font-bold">Which project are we working on today ?</h2>
    </section>

    <!-- new board -->
    <section class="my-10">
      <div class="flex items-center justify-center">
        <div
          class="flex flex-col items-center p-8 bg-gray-800 rounded-md sm:w-1/2"
        >
          <div class="flex flex-col mb-4 w-full">
            <label for="boardName">Board Name</label>
            <input
              class="text-gray-900 w-full"
              v-model="boardName"
              type="text"
              name="boardName"
              id="boardName"
            />
          </div>
          <div class="flex flex-col mb-4 w-full">
            <label for="boardAuthor">Board Author</label>
            <input
              class="text-gray-900 w-full"
              v-model="boardAuthor"
              type="text"
              name="boardAuthor"
              id="boardAuthor"
            />
          </div>
          <div class="flex justify-center mb-4 w-full select-none">
            <input
              class="hidden"
              type="radio"
              id="typeLocal"
              value="local"
              v-model="boardType"
            />
            <label
              :class="`p-4 bg-gray-${boardType === 'local' ? '700' : '800'}`"
              for="typeLocal"
              >Local Board</label
            >

            <input
              class="hidden"
              type="radio"
              id="typeRemote"
              value="remote"
              v-model="boardType"
            />
            <label
              :class="`p-4 bg-gray-${boardType === 'remote' ? '700' : '800'}`"
              for="typeRemote"
              >Remote Board</label
            >
          </div>

          <div v-if="boardType === 'remote'">
            <span>Remote options !</span>
          </div>
          <button
            class="px-8 py-2 bg-gray-700 w-full rounded-md"
            @click="initializeNewBoard"
          >
            Create New Board
          </button>
        </div>
      </div>
    </section>

    <!-- existing boards -->
    <section class="my-10">
      <ul>
        <li v-for="board in existingBoards" :key="board.meta.safeName">
          {{ board.meta.name }}
        </li>
      </ul>
    </section>
  </main>
</template>

<script>
import { createEmpty } from '../../utils/koan-lib'
import { DateTime } from 'luxon'
import { ipcRenderer } from 'electron'
import SystemInformation from '@/components/SystemInformation.vue'

export default {
  components: {
    SystemInformation,
  },
  data() {
    return {
      boardName: 'My New Board',
      boardAuthor: 'Tim Winkelmann <twinkelmann@pm.me>',
      existingBoards: [],
      boardType: 'local',
    }
  },
  methods: {
    openURL(url) {
      ipcRenderer.invoke('openExternal', url)
    },
    async initializeNewBoard(event) {
      event.preventDefault()

      const message = await ipcRenderer.invoke(
        'initializeNewBoard',
        createEmpty(
          DateTime.now().toUTC().toISO(),
          this.boardName.trim(),
          this.boardAuthor.trim()
        )
      )

      this.refreshBoardsList()
      alert(message)
    },
    async refreshBoardsList() {
      this.existingBoards = await ipcRenderer.invoke('listExistingBoards')
    },
  },
  async mounted() {
    this.refreshBoardsList()
  },
}
</script>
