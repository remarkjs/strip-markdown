import type {Literal, Parent, PhrasingContent} from 'mdast'

export {}

export interface X extends Parent {
  type: 'x'
  children: PhrasingContent[]
}

export interface Y extends Literal {
  type: 'y'
}

// Add nodes to content, register `data` on paragraph.
declare module 'mdast' {
  interface BlockContentMap {
    x: X
  }

  interface PhrasingContentMap {
    y: Y
  }

  interface RootContentMap {
    x: X
    y: Y
  }
}
