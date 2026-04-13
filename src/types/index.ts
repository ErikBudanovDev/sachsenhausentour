export interface WithClassName {
  className?: string
}

export interface WithChildren {
  children: React.ReactNode
}

export interface WithChildrenAndClassName extends WithClassName, WithChildren {}
