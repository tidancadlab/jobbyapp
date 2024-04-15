import {Component} from 'react'
import {Link} from 'react-router-dom'
import Header from '../Header'
import './index.css'

export default class Home extends Component {
  render() {
    return (
      <div className="main">
        <div className="page_container home">
          <Header />
          <h1 className="home_heading">Find The Job That Fits Your Life</h1>
          <p className="home_description">
            Millions of people are searching for jobs, salary infromation
            company reviews. Find the job that fits your abilities and potential
          </p>
          <Link to="/jobs">
            <button className="btn btn-secondry" type="button">
              Find Jobs
            </button>
          </Link>
        </div>
      </div>
    )
  }
}
