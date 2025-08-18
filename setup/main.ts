import { defineAppSetup } from '@slidev/types'
import D2Diagram from '../components/D2Diagram.vue'

export default defineAppSetup(({ app }) => {
  app.component('D2Diagram', D2Diagram)
})
