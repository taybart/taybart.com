import { Link } from 'wouter'
import { NavLink } from '../../atoms/NavLink'

import styles from './index.module.css'

export default () => {
  return (
    <div className={styles.header}>
      <Link href="/" className="text-2xl">
        TB
      </Link>
      <nav className={styles.links}>
        <NavLink href="/">resume</NavLink>
        <NavLink match="/hn/:id?" href="/hn">
          hn
        </NavLink>
      </nav>
    </div>
  )
}
