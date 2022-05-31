import { FC } from 'react'
import { Link, LinkProps, useRoute } from 'wouter'


export const NavLink: FC<LinkProps> = props => {
  if (!props.href) {
    throw new Error('href is required for NavLink')
  }
  const [isActive] = useRoute(props.href);
  return (
    <Link {...props}>
      <a className={isActive ? "font-bold" : ""}>{props.children}</a>
    </Link>
  );
};
