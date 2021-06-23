import React, {FC} from 'react'
import {Link} from 'react-router-dom'
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
            <div className="knowledge">
                <b>things i know well</b>
                <ul>
                    <li> language </li>
                    <ul>
                        <li> go </li>
                        <li> js/node </li>
                        <li> python </li>
                        <li> c </li>
                    </ul>
                    <li> web frameworks </li>
                    <ul>
                        <li> react </li>
                    </ul>
                    <li> ops </li>
                    <ul>
                        <li> linux </li>
                        <li> docker </li>
                        <li> k8s </li>
                        <li> aws </li>
                        <li> gcp </li>
                    </ul>
                </ul>
                <b>things i made</b>
                <ul>
                    <li>
                        <a href="https://github.com/taybart/fm">fm</a>
                    </li>
                    <li>
                        <a href="https://github.com/taybart/rest">rest</a>
                    </li>
                    <li>
                        <a href="https://github.com/taybart/log">log</a>
                    </li>
                    <li>
                        <a href="https://github.com/taybart/paint">paint</a>
                    </li>
                    <li>
                        <Link to="/hn">my hacker news</Link>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default Resume
