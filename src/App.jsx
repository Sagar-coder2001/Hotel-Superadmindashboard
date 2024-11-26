import './App.css'
import { BrowserRouter , Routes , Route } from 'react-router-dom'
import LoginForm from './Pages/Loginpage/LoginForm'
import Admindashboard from './Pages/Dashboard/Admindashboard'
import Superadmin from './Pages/Superadmindashboard/Superadmin'
import Usermanage from './Pages/Usermanagedashboard/Usermanage'
// import Table_dashboard from './Pages/Table-Dashboard/Table_dashboard'
// import Hotel_dashboard from './Pages/Hotel-Dashboard/Hotel_dashboard'
// import Employee_dashboard from './Pages/Employee-dashboard/Employee_dashboard'

function App() {

  return (
    <>
    <div>
      <div className="app-container">
      <BrowserRouter>
      <Routes>
        <Route path = "/" element ={<LoginForm/>}/>
        <Route path = "/Admindashboard" element ={<Admindashboard/>}/>
        {/* <Route path = "/Table_dashboard" element ={<Table_dashboard/>}/> */}
        <Route path = "/Superadmin" element ={<Superadmin/>}/>
        <Route path = "/Usermanage" element ={<Usermanage/>}/> 
      </Routes>
      </BrowserRouter>

    </div>
    </div>

    </>
  )
}

export default App
