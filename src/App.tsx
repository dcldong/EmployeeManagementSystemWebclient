import './App.css'
import Login from './page/login'
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import zhCN from 'antd/locale/zh_CN';
import 'antd/dist/reset.css';
import { ConfigProvider } from 'antd';
import EmployeePage from './page/employee';
import AdminPage from './page/admin';
import DepartmentPage from './page/department';
import { Route, Routes } from 'react-router-dom';
import Home from './page/home';


dayjs.locale('zh-cn');

function App() {
    return (
        <ConfigProvider locale={zhCN}>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Home />}></Route>
                    <Route path="/login" element={<Login />}></Route>
                    <Route path="/employee" element={<EmployeePage />}></Route>
                    <Route path="/admin" element={<AdminPage />}></Route>
                    <Route path="/department" element={<DepartmentPage />}></Route>
                </Routes>
            </div>
        </ConfigProvider>
    )
}

export default App
