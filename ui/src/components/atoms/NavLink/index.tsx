import { FC } from 'react'
import { Link, LinkProps, useRoute } from 'wouter'

interface Props {
  match?: string
}

export const NavLink: FC<Props & LinkProps> = (props) => {
  if (!props.href) {
    throw new Error('href is required for NavLink')
  }
  const [isActive] = useRoute(props.match || props.href)
  return (
    <Link {...props}>
      <a className={isActive ? 'text-lg font-bold' : ''}>{props.children}</a>
    </Link>
  )
}
