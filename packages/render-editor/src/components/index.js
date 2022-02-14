import * as Container from './Containers'
import * as LayoutTree from './LayoutTree'
import Vue from 'vue'

const collection = [...Object.entries(Container), ...Object.entries(LayoutTree)]

collection.forEach((component) => {
  Vue.component(component[0], component[1])
})

export { Container, LayoutTree }
