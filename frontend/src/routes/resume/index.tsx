import React, {FC} from 'react'
import {Link} from 'react-router-dom'
import {Github, LinkedIn, Email} from '../../components/icons'
import './style.css'

const Resume: FC = () => {
  return (
    <div className="resume">
      <ul className="jobs">
        <li>
          <div>
            2020-now{' '}
            <b>principal engineer & developement manager</b> journey
          </div>
          <div>
            2018-2020 <b>lead software engineer</b> journey
          </div>
          <div className="current-job-desc">
            Journey is bringing trust, identity and zero-knowledge
            privacy to the contact center & beyond
          </div>
        </li>
        <li>
          2017-2018 <b>lead software engineer</b> the spiga group
        </li>
        <li>
          2014-2017 <b>co-founder</b> mfactor engineering
        </li>
        <li>
          2015 <b>bs</b> electrical and computer engineering,
          university of colorado
        </li>
      </ul>
      <div className="links mt-10">
        <b>&gt;links</b>
        <ul className="flex flex-row items-center pt-2">
          <li>
            <a href="https://github.com/taybart">
              <Github className="h-6 w-6 fill-current mr-4" />
            </a>
          </li>
          <li>
            <a href="https://www.linkedin.com/in/taylor-bartlett-3542609a">
              <LinkedIn className="h-6 w-6 fill-current mr-4" />
            </a>
          </li>
          <li>
            <a href="mailto:taybart@gmail.com">
              <Email className="h-6 w-6 fill-current" />
            </a>
          </li>
        </ul>
      </div>
      <div className="knowledge">
        <b>&gt;things i know well</b>
        <ul>
          <li> languages </li>
          <ul className="flex flex-row">
            <li> go </li>
            <li> js/ts </li>
            <li> c </li>
          </ul>
          <li> web frameworks </li>
          <ul className="flex flex-row">
            <li> react </li>
          </ul>
          <li> ops </li>
          <ul className="flex flex-row">
            <li> linux </li>
            <li> kubernetes </li>
            <li> docker </li>
          </ul>
          <li>iaas</li>
          <ul className="flex flex-row">
            <li> aws </li>
            <li> gcp </li>
          </ul>
        </ul>
        <b>&gt;projects</b>
        <ul>
          <li> <Link to="/hn">my hacker news</Link> </li>
          <li> <a href="https://github.com/taybart/taybart.com">this site</a> </li>
        </ul>
        <b>&gt;tools</b>
        <ul className="flex flex-row">
          <li> <a href="https://github.com/taybart/fm">fm</a> </li>
          <li> <a href="https://github.com/taybart/rest">rest</a> </li>
          <li> <a href="https://github.com/taybart/certs">certs</a> </li>
          <li> <a href="https://github.com/taybart/cache">cache</a> </li>
          <li> <a href="https://github.com/taybart/rxt">regex tester</a> </li>
          <li> <a href=""></a> </li>

        </ul>
      </div>
    </div>
  )
}

export default Resume
