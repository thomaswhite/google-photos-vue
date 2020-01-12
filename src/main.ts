import Vue from 'vue'
import VueGApi from 'vue-gapi'
import store from '@/store'
import App from '@/components/App.vue'
import googlePhotos from '@/api/google-photos'
import VueGtag from 'vue-gtag'

/**
 * Google OAuth 2.0 Client ID
 *
 * @see https://support.google.com/googleapi/answer/6158849
 */
const GOOGLE_OAUTH2_CLIENT_ID = '643157340864-6dlup4og9711115j4phha6meqp02hd6b.apps.googleusercontent.com'

/**
 * Optional Google Analytics ID
 *
 * @see https://support.google.com/analytics/answer/1008080
 */
const GOOGLE_ANALYTICS_ID = 'UA-17188743-25'

Vue.config.productionTip = false

const elementId = 'app'
const externalStatePath = document.getElementById(elementId)!.dataset.externalStatePath

if (externalStatePath) {
  fetch(externalStatePath).then((response) => {
    return response.json().then(store.replaceState.bind(store))
  })
} else {
  Vue.use(VueGApi, {
    discoveryDocs: ['https://photoslibrary.googleapis.com/$discovery/rest?version=v1'],
    clientId: GOOGLE_OAUTH2_CLIENT_ID,
    scope: 'https://www.googleapis.com/auth/photoslibrary.readonly'
  })
}

// noinspection PointlessBooleanExpressionJS
if (GOOGLE_ANALYTICS_ID) {
  Vue.use(VueGtag, {
    config: { id: GOOGLE_ANALYTICS_ID }
  })
}

new Vue({
  created () {
    googlePhotos.initialize(this.$gapi)
  },
  render: h => h(App, {
    props: {
      externalStatePath
    }
  }),
  store
}).$mount(`#${elementId}`)
