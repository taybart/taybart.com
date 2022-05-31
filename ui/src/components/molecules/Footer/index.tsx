import { Link } from 'wouter'
import { NavLink } from '../../atoms/NavLink'
import { ReactComponent as Github } from '../../../assets/github.svg'
import { ReactComponent as LinkedIn } from '../../../assets/linkedin.svg'

import styles from './index.module.css'

export default () => {
  return (
    <div className={styles.header}>
      <Link href="/" className="text-2xl">
        TB
      </Link>

      <div>
        <div className={styles.links}>
          <div className="flex flex-row">
            <span>links:</span>
            <a
              href="https://github.com/taybart"
              target="_blank"
              className="pl-1"
            >
              <Github width="15" className="inline fill-white" /> /
            </a>
            <a
              href="https://linkedin.com/in/taylor-bartlett-3542609a"
              target="_blank"
              className="pl-1"
            >
              <LinkedIn width="15" className="inline fill-white" />
            </a>
          </div>
          <a
            href="mailto:taybart@gmail.com?subject=Project Inquiry"
            target="_blank"
            className="underline"
          >
            need something built?
          </a>
        </div>
      </div>
      <nav className={styles.links}>
        <NavLink href="/">resume</NavLink>
        <NavLink match="/hn/:id?" href="/hn">
          hn
        </NavLink>
      </nav>
    </div>
  )
}
