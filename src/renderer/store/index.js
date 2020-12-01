import {
  SET_IS_APP_LOADING,
  SET_MESSAGE,
  SET_SHOW_MESSAGE,
  SET_MESSAGE_TIMEOUT,
  ADD_AWAITING_EVENT,
  REMOVE_AWAITING_EVENT,
} from '../utils/mutations'

export const state = () => ({
  locales: ['en', 'fr', 'de'],
  locale: 'en',

  messageBox: {
    show: false,
    isError: false,
    lastMessage: '',
    timeout: null,
  },

  isAppLoading: false,
  awaitingEvents: [],
})

export const mutations = {
  // SET
  [SET_IS_APP_LOADING](state, { isAppLoading }) {
    state.isAppLoading = isAppLoading
  },
  [SET_MESSAGE](state, { message, isError }) {
    state.messageBox.lastMessage = message
    state.messageBox.isError = isError
  },
  [SET_SHOW_MESSAGE](state, { show }) {
    state.messageBox.show = show
  },
  [SET_MESSAGE_TIMEOUT](state, { timeout }) {
    state.messageBox.timeout = timeout
  },

  // ADD
  [ADD_AWAITING_EVENT](state, { awaitingEvent }) {
    state.awaitingEvents.push(awaitingEvent)
  },

  // REMOVE
  [REMOVE_AWAITING_EVENT](state, { awaitingEvent }) {
    state.awaitingEvents.splice(state.awaitingEvents.indexOf(awaitingEvent), 1)
  },
}

export const actions = {
  addAwaitingEvent({ commit, state }, { awaitingEvent }) {
    if (!state.isAppLoading) {
      commit(SET_IS_APP_LOADING, { isAppLoading: true })
    }
    commit(ADD_AWAITING_EVENT, { awaitingEvent })

    awaitingEvent.finally(() => {
      commit(REMOVE_AWAITING_EVENT, { awaitingEvent })

      // wait a bit before trying to change the state
      // that way we don't remove the loading to readd it immediately after
      setTimeout(() => {
        if (state.awaitingEvents.length === 0 && state.isAppLoading) {
          commit(SET_IS_APP_LOADING, { isAppLoading: false })
        }
      }, 100)
    })
  },
  showMessage({ commit, dispatch }, { message, isError, time }) {
    commit(SET_MESSAGE, { message, isError })

    dispatch('hideMessage')

    // let the CSS update so that the animation for the message box may trigger again
    requestAnimationFrame(() => {
      commit(SET_SHOW_MESSAGE, { show: true })

      const timeout = setTimeout(() => {
        commit(SET_SHOW_MESSAGE, { show: false })
      }, time || 10000)

      commit(SET_MESSAGE_TIMEOUT, { timeout })
    })
  },
  hideMessage({ commit, state }) {
    clearTimeout(state.messageBox.timeout)

    commit(SET_SHOW_MESSAGE, { show: false })
  },
}

export const getters = {
  isAppLoading: (state) => state.isAppLoading,
}
