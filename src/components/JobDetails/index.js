import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {FaStar, FaBriefcase} from 'react-icons/fa'
import {HiLocationMarker} from 'react-icons/hi'
import JobCard from '../JobCard/index'
import Header from '../Header'
import './index.css'

const status = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  reject: 'REJECT',
  error: 'ERROR',
  fail: 'FAIL',
}

export default class JobDetils extends Component {
  state = {data: {}, dataStatus: status.initial}

  componentDidMount() {
    this.getJobsData()
  }

  componentDidUpdate({match}) {
    /* eslint-disable-next-line */
    const {url} = this.props.match
    /* eslint-disable-next-line */
    match.url !== url ? this.getJobsData() : null
  }

  getJobsData = async () => {
    const {match} = this.props
    const {params} = match
    this.setState({dataStatus: status.initial})
    try {
      const url = `https://apis.ccbp.in/jobs/${params.id}`
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `bearer ${Cookies.get('jwt_token')}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        const camleCaseData = {
          jobDetails: {
            companyLogoUrl: data.job_details.company_logo_url,
            companyWebsiteUrl: data.job_details.company_website_url,
            employmentType: data.job_details.employment_type,
            id: data.job_details.id,
            jobDescription: data.job_details.job_description,
            location: data.job_details.location,
            packagePerAnnum: data.job_details.package_per_annum,
            rating: data.job_details.rating,
            title: data.job_details.title,
            skills: data.job_details.skills.map(value => ({
              imageUrl: value.image_url,
              name: value.name,
            })),
            life_at_company: {
              description: data.job_details.life_at_company.description,
              imageUrl: data.job_details.life_at_company.image_url,
            },
          },
          similarJobs: data.similar_jobs.map(value => ({
            companyLogoUrl: value.company_logo_url,
            employmentType: value.employment_type,
            id: value.id,
            jobDescription: value.job_description,
            location: value.location,
            packagePerAnnum: value.package_per_annum,
            rating: value.rating,
            title: value.title,
          })),
        }
        this.setState({
          data: camleCaseData,
          dataStatus: status.success,
        })
      } else {
        this.setState({dataStatus: status.fail})
      }
    } catch (error) {
      this.setState({dataStatus: status.fail})
    }
  }

  jobsCard = () => {
    const {data, dataStatus} = this.state
    let userStatus
    switch (dataStatus) {
      case status.initial:
        userStatus = (
          <div className="loader-container" data-testid="loader">
            <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
          </div>
        )
        break
      case status.success:
        userStatus = (
          <>
            <ul className="job_card_container">
              <li className="job_container">
                <div className="company_profile">
                  <div className="logo">
                    <img
                      src={data.jobDetails.companyLogoUrl}
                      alt="job details company logo"
                    />
                  </div>
                  <div className="name_rating">
                    <h3>{data.jobDetails.title}</h3>
                    <div>
                      <FaStar fill="gold" />{' '}
                      <p style={{display: 'contents'}}>
                        {data.jobDetails.rating}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="job_data">
                  <p>
                    <HiLocationMarker /> {data.jobDetails.location}
                  </p>
                  <p className="emp_type">
                    <FaBriefcase /> {data.jobDetails.employmentType}
                  </p>
                  <p>{data.jobDetails.packagePerAnnum}</p>
                </div>
                <div className="description">
                  <div className="url_conatiner">
                    <h3>Description</h3>
                    <a
                      href={data.jobDetails.companyWebsiteUrl}
                      className="website_url"
                    >
                      Visit
                    </a>
                  </div>
                  <p>{data.jobDetails.jobDescription}</p>
                </div>
                <h2>Skills</h2>
                <ul className="skills">
                  {data.jobDetails.skills.map(value => (
                    <li key={value.name}>
                      <img src={value.imageUrl} alt={value.name} />
                      <p>{value.name}</p>
                    </li>
                  ))}
                </ul>
                <h2>Life of Company</h2>
                <div className="life_of_company">
                  <p>{data.jobDetails.life_at_company.description}</p>
                  <img src={data.jobDetails.life_at_company.imageUrl} alt="" />
                </div>
              </li>
            </ul>
            <h1 style={{alignSelf: 'start'}}>Similar Jobs</h1>
            <ul className="wrap_card">
              {data.similarJobs.map(value => (
                <JobCard
                  key={value.id}
                  data={value}
                  logoAlt="similar job company logo"
                />
              ))}
            </ul>
          </>
        )
        break
      case status.fail:
        userStatus = (
          <>
            <div className="job_error">
              <img
                src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
                alt="failure view"
              />
              <h1>Oops! Something Went Wrong</h1>
              <p>We cannot seem to find the page you are looking for.</p>
            </div>
            <button
              type="button"
              className="btn btn-secondry"
              onClick={this.getJobsData}
            >
              Retry
            </button>
          </>
        )
        break
      case status.reject:
        userStatus = <div>no data</div>
        break
      default:
        userStatus = null
    }
    return userStatus
  }

  render() {
    return (
      <div className="main">
        <div className="page_container jobs">
          <Header />
          <div className="error_container">{this.jobsCard()}</div>
        </div>
      </div>
    )
  }
}
