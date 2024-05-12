import { Routes, Route } from 'react-router-dom'

import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import DefaultView from '@/routes/Dashboard/Home/Home'
import DeviceList from '@/routes/Dashboard/DeviceList/DeviceList'
import LinkWizard from './LinkWizard/LinkWizard'

import '@/assets/css/components/Dashboard.css'
import '@/assets/css/layouts/View.css'

const Dashboard: React.FC = () => {
  return (
    <div className='dashboard-container'>
      <Sidebar />
      <Header />
      <Routes>
        <Route element={<DefaultView />} path='/'></Route>
        <Route element={<DeviceList />} path='/devices'></Route>
        <Route element={<LinkWizard />} path='/link'></Route>
      </Routes>
    </div>
  )
}

export default Dashboard
