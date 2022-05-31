import RightArrow from '../../components/atoms/RightArrow'
// import { ReactComponent as Github } from '../../assets/github.svg'
// import { ReactComponent as LinkedIn } from '../../assets/linkedin.svg'
// import { ReactComponent as Hammer } from '../../assets/hammer.svg'

import styles from './index.module.css'

export default () => (
  <div className={styles.resume}>
    <div>
      {/*<div className="pb-3">
        <p className="-ml-5">resume</p>
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
      </div> */}
      <div className={styles['job-description']}>
        <a target="blank" href="https://journeyid.com">
          @journey
        </a>
        <div className={styles.description}>
          {/* TODO: get the real mission stmt */}
          journey is bringing trust, identity and zero-knowledge privacy to the
          market
        </div>
        <div className={styles.job}>
          2021-now <RightArrow /> <b>director of engineering</b>
        </div>
        <div className={styles.job}>
          2020-2021 <RightArrow />{' '}
          <b>principal engineer & developement manager</b>
        </div>
        <div className={styles.job}>
          2018-2020 <RightArrow /> <b>lead software engineer</b>
        </div>
      </div>
      <div className={styles['job-description']}>
        <p>@the spiga group</p>
        <div className={styles.description}>real time crypto index fund</div>
        <div className={styles.job}>
          2017-2018 <RightArrow /> <b>lead software engineer</b>
        </div>
      </div>
      <div className={styles['job-description']}>
        <p>@mfactor engineering</p>
        <div className={styles.description}>
          factory optimization, city monitoring via IoT devices
        </div>
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
    <div>asd</div>
  </div>
)
