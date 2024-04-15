import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

const Header = ({history}) => (
  <nav>
    <div className="logo_conatiner">
      <Link to="/">
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
        />
      </Link>
    </div>
    <div className="link_container">
      <ul>
        <Link to="/">
          <li>
            <p>Home</p>
          </li>
        </Link>
        <Link to="/jobs">
          <li>
            <p>Jobs</p>
          </li>
        </Link>
        <li>
          <button
            onClick={() => {
              Cookies.remove('jwt_token')
              history.replace('/login')
            }}
            className="btn btn-secondry mt-0"
            type="button"
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
  </nav>
)

export default withRouter(Header)
