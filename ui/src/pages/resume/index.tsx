import RightArrow from '../../components/atoms/RightArrow'
import { ReactComponent as Github } from '../../assets/github.svg'
import { ReactComponent as Twitter } from '../../assets/twitter.svg'
import { ReactComponent as LinkedIn } from '../../assets/linkedin.svg'
import { ReactComponent as Hammer } from '../../assets/hammer.svg'

import styles from './index.module.css'

export default () =>
  <div className={styles.resume}>
    <div>
      <p className="-ml-5">resume</p>
      <div className={styles.links}>
        <div className="flex flex-row pb-3">
          <span>links</span>
          <a href="https://github.com/taybart" target="_blank" className="pl-3">
            <RightArrow />
            <Github width="15" className="inline fill-white" />
            github
          </a>
          <a href="https://twitter.com/taybart_" target="_blank" className="pl-3">
            <RightArrow />
            <Twitter width="15" className="inline fill-white" />
            twitter
          </a>
          <a
            href="https://linkedin.com/in/taylor-bartlett-3542609a"
            target="_blank"
            className="pl-3"
          >
            <RightArrow />
            <LinkedIn width="15" className="inline fill-white" />
            linkedin
          </a>
          <a href="mailto:taybart@gmail.com" target="_blank" className="pl-3">
            <RightArrow />
            <Hammer width="15" className="inline fill-white" />
            need something built?
          </a>
        </div>
      </div>
      <div className={styles['job-description']}>
        <a target="blank" href="https://journeyid.com">@journey</a>
        <div className={styles.description}>
          Journey is bringing trust, identity and zero-knowledge privacy to the
          contact center & beyond
        </div>
        <div className={styles.job}>
          2021-now <RightArrow /> <b>director of engineering</b>
        </div>
        <div className={styles.job}>
          2020-2021 <RightArrow />
          <b>principal engineer & developement manager</b>
        </div>
        <div className={styles.job}>
          <RightArrow /> 2018-2020 <b>lead software engineer</b>
        </div>
      </div>
      <div className={styles['job-description']}>
        <p>@the spiga group</p>
        <div className={styles.description}>Real time crypto index fund</div>
        <div className={styles.job}>
          2017-2018 <RightArrow /> <b>lead software engineer</b>
        </div>
      </div>
      <div className={styles['job-description']}>
        <p>@mfactor engineering</p>
        <div className={styles.description}>factory optimization</div>
        <div className={styles.job}>
          2014-2017 <RightArrow /> <b>co-founder</b>
        </div>
      </div>
      <div className={styles['job-description']}>
        <p>@university of colorado, boulder</p>
        <div className={styles.job}>
          2011-2015 <RightArrow /> bs, electrical and computer engineering
        </div>
      </div>
    </div>
  </div>

