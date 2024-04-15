import {FaStar, FaBriefcase} from 'react-icons/fa'
import {HiLocationMarker} from 'react-icons/hi'
import {Link} from 'react-router-dom'
import './index.css'

export default ({data, logoAlt = 'company logo'}) => (
  <Link to={`/jobs/${data.id}`}>
    <li className="job_container">
      <div className="company_profile">
        <div className="logo">
          <img src={data.companyLogoUrl} alt={logoAlt} />
        </div>
        <div className="name_rating">
          <h3>{data.title}</h3>
          <div>
            <FaStar fill="gold" />{' '}
            <p style={{display: 'contents'}}>{data.rating}</p>
          </div>
        </div>
      </div>
      <div className="job_data">
        <p>
          <HiLocationMarker /> {data.location}
        </p>
        <div className="emp_type">
          <span>
            <FaBriefcase />
          </span>{' '}
          <p style={{display: 'contents'}}>{data.employmentType}</p>
        </div>
        <p>{data.packagePerAnnum}</p>
      </div>
      <div className="description">
        <h3>Description</h3>
        <p>{data.jobDescription}</p>
      </div>
    </li>
  </Link>
)
