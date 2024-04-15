import {Switch, Route, Redirect} from 'react-router-dom'
import Store from './components/store'
import Login from './components/Login'
import HomeRoute from './components/Home'
import Jobs from './components/Jobs'
import JobDetails from './components/JobDetails/index'
import ProtectedRouter from './components/ProtectedRoute'
import NotFound from './components/NotFound'
import './App.css'

// These are the lists used in the application. You can move them to any component needed.
const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

// Replace your code here
const App = () => (
  <Store.Provider value={{salaryRangesList, employmentTypesList}}>
    <Switch>
      <ProtectedRouter exact path="/" component={HomeRoute} />
      <ProtectedRouter exact path="/jobs" component={Jobs} />
      <ProtectedRouter exact path="/jobs/:id" component={JobDetails} />
      <Route exact path="/login" component={Login} />
      <Route path="/not-found" component={NotFound} />
      <Redirect to="not-found" />
    </Switch>
  </Store.Provider>
)

export default App
