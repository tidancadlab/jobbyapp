import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'
import Store from '../store'
import ProfileCard from './ProfileCard'
import Header from '../Header'
import JobCard from '../JobCard/index'
import './index.css'

const status = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  reject: 'REJECT',
  error: 'ERROR',
  fail: 'FAIL',
}

export default class Jobs extends Component {
  state = {
    profile: {},
    jobList: [],
    locationList: [],
    searchParams: '',
    profileStatus: status.initial,
    jobListStatus: status.initial,
    employmentFilterList: [],
    salaryRange: '',
  }

  componentDidMount() {
    this.getProfile()
    this.getJobsData()
  }

  onCheckItem = e => {
    if (e.target.checked) {
      this.setState(
        previous => ({
          employmentFilterList: [...previous.employmentFilterList, e.target.id],
        }),
        this.getJobsData,
      )
    } else {
      this.setState(
        previous => ({
          employmentFilterList: previous.employmentFilterList.filter(
            value => value !== e.target.id,
          ),
        }),
        this.getJobsData,
      )
    }
  }

  onSearchChange = e => {
    this.setState({searchParams: e.target.value})
  }

  onSearchClick = () => {
    this.getJobsData()
  }

  getProfile = async () => {
    this.setState({profileStatus: status.initial})
    try {
      const response = await fetch('https://apis.ccbp.in/profile', {
        method: 'GET',
        headers: {
          Authorization: `bearer ${Cookies.get('jwt_token')}`,
        },
      })
      if (response.ok) {
        const resData = await response.json()
        const data = {
          profile_details: {
            name: resData.profile_details.name,
            profileImageUrl: resData.profile_details.profile_image_url,
            shortBio: resData.profile_details.short_bio,
          },
        }
        this.setState({profile: data, profileStatus: status.success})
      } else {
        this.setState({profileStatus: status.fail})
      }
    } catch (error) {
      this.setState({profileStatus: status.fail})
    }
  }

  getJobsData = async () => {
    const {employmentFilterList, salaryRange, searchParams} = this.state
    this.setState({jobListStatus: status.initial})
    try {
      const url = `https://apis.ccbp.in/jobs?employment_type=${employmentFilterList.join(
        ',',
      )}&minimum_package=${salaryRange}&search=${searchParams}`
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `bearer ${Cookies.get('jwt_token')}`,
        },
      })
      if (response.ok) {
        const {jobs, total} = await response.json()
        const CamelCaseData = jobs.map(data => ({
          companyLogoUrl: data.company_logo_url,
          employmentType: data.employment_type,
          id: data.id,
          jobDescription: data.job_description,
          location: data.location,
          packagePerAnnum: data.package_per_annum,
          rating: data.rating,
          title: data.title,
        }))
        if (total > 0) {
          this.setState({jobList: CamelCaseData, jobListStatus: status.success})
        } else {
          this.setState({jobListStatus: status.reject})
        }
      } else {
        this.setState({jobListStatus: status.fail})
      }
    } catch (error) {
      this.setState({jobListStatus: status.fail})
    }
  }

  userProfile = () => {
    const {profile, profileStatus} = this.state
    let userStatus
    switch (profileStatus) {
      case status.initial:
        userStatus = (
          <div className="loader-container" data-testid="loader">
            <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
          </div>
        )
        break
      case status.success:
        userStatus = <ProfileCard data={profile} />
        break
      case status.fail:
        userStatus = (
          <button
            type="button"
            className="btn btn-secondry"
            onClick={this.getProfile}
          >
            Retry
          </button>
        )
        break
      default:
        userStatus = null
    }
    return userStatus
  }

  onLocation = loc => {
    const {locationList} = this.state
    if (locationList.includes(loc)) {
      const exceptLocationList = locationList.filter(v => v !== loc)
      this.setState(() => ({locationList: exceptLocationList}))
    } else {
      locationList.push(loc)
      this.setState(() => ({locationList}))
    }
  }

  jobsCard = () => {
    const {jobList, jobListStatus, locationList} = this.state
    const locationFilterJobs =
      locationList.length > 0
        ? jobList.filter(v => locationList.includes(v.location))
        : jobList
    let userStatus
    switch (jobListStatus) {
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
            {locationFilterJobs.length > 0 ? (
              <ul className="job_card_container">
                {locationFilterJobs.map(value => (
                  <JobCard key={value.id} data={value} />
                ))}
              </ul>
            ) : (
              <div className="job_error">
                <img
                  src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
                  alt="no jobs"
                />
                <h1>No Jobs Found</h1>
                <p>We cannot find any jobs. Try other filters.</p>
              </div>
            )}
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
              onClick={this.getProfile}
            >
              Retry
            </button>
          </>
        )
        break
      case status.reject:
        userStatus = (
          <div className="job_error">
            <img
              src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
              alt="no jobs"
            />
            <h1>No Jobs Found</h1>
            <p>We cannot find any jobs. Try other filters.</p>
          </div>
        )
        break
      default:
        userStatus = null
    }
    return userStatus
  }

  render() {
    const {searchParams} = this.state
    const {locationList} = this.state
    const locationsList = [
      'Hyderabad',
      'Bangalore',
      'Chennai',
      'Delhi',
      'Mumbai',
    ]
    return (
      <div className="main">
        <div className="page_container jobs">
          <Header />
          <div className="main-jobs">
            <div className="sec1">
              <div className="serach_container hidden-mobile">
                <input
                  value={searchParams}
                  onChange={this.onSearchChange}
                  type="search"
                  placeholder="Search"
                  id="search"
                />
                <button
                  aria-label="Search Button"
                  className="btn btn-search"
                  type="button"
                  data-testid="searchButton"
                  onClick={this.onSearchClick}
                >
                  <BsSearch fill="white" />
                </button>
              </div>
              <div className="user_profile_container">{this.userProfile()}</div>
              <Store.Consumer>
                {storeData => (
                  <div className="filter">
                    <h3 className="border-t">Type of Employment</h3>
                    <ul className="filter_container">
                      {storeData.employmentTypesList.map(value => (
                        <li key={value.employmentTypeId}>
                          <input
                            type="checkbox"
                            id={value.employmentTypeId}
                            onChange={this.onCheckItem}
                          />
                          <label htmlFor={value.employmentTypeId}>
                            {value.label}
                          </label>
                        </li>
                      ))}
                    </ul>
                    <h3 className="border-t">Salary Range</h3>
                    <ul className="filter_container">
                      {storeData.salaryRangesList.map(value => (
                        <>
                          <li key={value.salaryRangeId}>
                            <input
                              type="radio"
                              id={value.salaryRangeId}
                              onChange={e => {
                                this.setState(
                                  {salaryRange: e.target.id},
                                  this.getJobsData,
                                )
                              }}
                              name="salaryRange"
                            />
                            <label htmlFor={value.salaryRangeId}>
                              {value.label}
                            </label>
                          </li>
                        </>
                      ))}
                    </ul>
                    <h3 className="border-t">Locations</h3>
                    <ul className="filter_container">
                      {locationsList.map(value => (
                        <>
                          <li key={value}>
                            <input
                              type="checkbox"
                              checked={locationList.includes(value)}
                              id={value}
                              onChange={() => this.onLocation(value)}
                              name="salaryRange"
                            />
                            <label htmlFor={value}>{value}</label>
                          </li>
                        </>
                      ))}
                    </ul>
                  </div>
                )}
              </Store.Consumer>
            </div>
            <div className="sec2">
              <div className="serach_container hidden-desktop">
                <input
                  value={searchParams}
                  onChange={this.onSearchChange}
                  type="search"
                  placeholder="Search"
                  id="search"
                />
                <button
                  aria-label="Search Button"
                  className="btn btn-search"
                  type="button"
                  data-testid="searchButton"
                  onClick={this.onSearchClick}
                >
                  <BsSearch fill="white" />
                </button>
              </div>
              {this.jobsCard()}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
