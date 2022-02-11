import * as Container from './Containers'
import * as DocumentTree from './DocumentTree'
import Vue from 'vue'

const collection = [
  ...Object.entries(Container),
  ...Object.entries(DocumentTree),
]

collection.forEach((component) => {
  Vue.component(component[0], component[1])
})

export { Container, DocumentTree }
