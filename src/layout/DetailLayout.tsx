import { Layout, Menu, MenuProps, Space, theme, Typography } from 'antd';
import { Content, Header } from 'antd/es/layout/layout';
import Sider from 'antd/es/layout/Sider';
import * as React from 'react';
import { UserOutlined, TeamOutlined, ToolOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';

const { Text, Link } = Typography;

const DetailLayout: React.FC<React.PropsWithChildren> = (props) => {
    const { token: { colorBgContainer } } = theme.useToken();
    const loc = useLocation();
    const navigate = useNavigate();
    const defaultKey = (loc.pathname ?? "").substring(1);

    type MenuItem = Required<MenuProps>['items'][number];

    const items: MenuItem[] = localStorage.getItem("permission")?.toString() == "1" ? [
        { label: '部门管理', key: 'department', icon: <TeamOutlined /> },
        { label: '员工管理', key: 'employee', icon: <UserOutlined /> },
        { label: '管理员管理', key: 'admin', icon: <ToolOutlined /> },
    ] : [
        { label: '部门管理', key: 'department', icon: <UserOutlined /> },
        { label: '员工管理', key: 'employee', icon: <UserOutlined /> }];



    const goto = (keyPath: any) => {
        navigate('/' + keyPath.key);
    }

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    }

    return <Layout style={{ minHeight: '100vh' }}>
        <Sider>
            <img src="./logo.png"></img>
            <div style={{ height: 5, margin: 5 }} />
            <Menu theme="dark" onSelect={goto} defaultSelectedKeys={[defaultKey]} mode="inline" items={items} />
        </Sider>
        <Layout>
            <Header style={{ padding: 0, background: colorBgContainer }}>
                <Space align="end" style={{ float: 'right' }}>
                    <Text type="secondary">登录用户: {localStorage.getItem("userName")}</Text>
                    <Link onClick={handleLogout}>退出登录</Link>
                    <div style={{ width: 10 }}></div>
                </Space>
            </Header>
            <Content style={{ margin: '0 16px' }} >
                <div style={{ height: 5 }}></div>
                {props.children}
            </Content>
        </Layout>
    </Layout>
}

export default DetailLayout;