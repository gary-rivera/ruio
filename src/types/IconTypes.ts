import { MouseEvent } from 'react'

export default interface IconProps {
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void
}