declare const _default: import('vue').DefineComponent<{
  code: {
    type: StringConstructor
    required: true
  }
  theme?: {
    type: StringConstructor
    default: string
  }
  sketch?: {
    type: BooleanConstructor
    default: boolean
  }
  center?: {
    type: BooleanConstructor
    default: boolean
  }
  scale?: {
    type: NumberConstructor
    default: number
  }
  pad?: {
    type: NumberConstructor
    default: number
  }
  width?: StringConstructor | NumberConstructor
  height?: StringConstructor | NumberConstructor
  maxWidth?: {
    type: StringConstructor
    default: string
  }
  maxHeight?: {
    type: StringConstructor
    default: string
  }
}>

export default _default
