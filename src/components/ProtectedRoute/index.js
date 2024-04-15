import Cookies from 'js-cookie'
import {Redirect, Route} from 'react-router-dom'

export default children => {
  if (!Cookies.get('jwt_token')) {
    return <Redirect to="/login" />
  }

  return <Route {...children} />
}
