import { LoginFormPage, ProFormText } from '@ant-design/pro-components';
import * as React from 'react';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import md5 from 'js-md5';
import { handleError } from '../../utils';

interface Props {
}
const Login: React.FC<Props> = (props) => {
    const navigate = useNavigate();

    return <div style={{ backgroundColor: 'white', height: '100vh' }}>
        <LoginFormPage
            backgroundImageUrl="https://gw.alipayobjects.com/zos/rmsportal/FfdJeJRQWjEeGTpqgBKj.png"
            title="员工信息管理系统"
            onFinish={values => {
                return Promise.resolve(values).then(() => {
                    var hexHash = md5('Hi there');
                    axios.post("/api/v1/login", { 'userName': values.username, 'password': md5(values.password) }).then((result) => {
                        localStorage.setItem("token", result.data.token);
                        localStorage.setItem("userName", result.data.login_name);
                        localStorage.setItem("permission", result.data.permission);
                        navigate('/employee', { replace: true })
                    }).catch(error => {
                        handleError(error);
                    })
                });
            }}
        >
            <>
                <ProFormText
                    name="username"
                    fieldProps={{
                        size: 'large',
                        prefix: <UserOutlined className={'prefixIcon'} />,
                    }}
                    placeholder={'用户名'}
                    rules={[
                        {
                            required: true,
                            message: '请输入用户名!',
                        },
                    ]}
                />
                <ProFormText.Password
                    name="password"
                    fieldProps={{
                        size: 'large',
                        prefix: <LockOutlined className={'prefixIcon'} />,
                    }}
                    placeholder={'密码'}
                    rules={[
                        {
                            required: true,
                            message: '请输入密码！',
                        },
                    ]}
                />
            </>
        </LoginFormPage>
    </div>
}

export default Login;