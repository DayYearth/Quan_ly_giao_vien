import React, { useEffect, useState } from 'react';
import {
    AppstoreOutlined,
    ExceptionOutlined,
    HeartTwoTone,
    TeamOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    DownOutlined,
} from '@ant-design/icons';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Layout, Menu, Dropdown, Space } from 'antd';
import { useDispatch, useSelector } from 'react-redux';

import './layout.scss'

const { Content, Footer, Sider } = Layout;

const LayoutAdmin = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [activeMenu, setActiveMenu] = useState('dashboard');
    const location = useLocation();
    const dispatch = useDispatch();

    const user = useSelector(state => state.account.user);

    const handleLogout = async () => {
        try {
            localStorage.removeItem('access_token');
            dispatch(doLogoutAction());
            navigate('/');
            message.success('Đăng xuất thành công');
        } catch (error) {
            message.error('Có lỗi xảy ra khi đăng xuất');
        }
    };

    const items = [
        {
            label: <Link to='/admin'>Trang quản trị</Link>,
            key: 'dashboard',
            icon: <AppstoreOutlined />
        },
        {
            label: <Link to='/admin/users'>Quản lý giáo viên</Link>,
            key: 'users',
            icon: <TeamOutlined />,
        },
        {
            label: <Link to='/admin/resumes'>Quản lý CV</Link>,
            key: 'resumes',
            icon: <ExceptionOutlined />
        },

    ];

    const itemsDropdown = [
        {
            label: <Link to={'/'}>Trang chủ</Link>,
            key: 'home',
        },
        {
            label: <label
                style={{ cursor: 'pointer' }}
            >Đăng xuất</label>,
            key: 'logout',
        },
    ];

    useEffect(() => {
        const currentPath = location.pathname;
        const matchedItem = items.find(item => currentPath.includes(item.key));
        if (matchedItem) {
            setActiveMenu(matchedItem.key);
        }
    }, [location]);

    return (
        <Layout
            style={{ minHeight: '100vh' }}
            className="layout-admin"
        >

            <Sider
                theme='light'
                collapsible
                collapsed={collapsed}
                onCollapse={(value) => setCollapsed(value)}>
                <div style={{ height: 32, margin: 16, textAlign: 'center' }}>
                    Quản trị viên
                </div>
                <Menu
                    defaultSelectedKeys={[activeMenu]}
                    mode="inline"
                    items={items}
                    onClick={(e) => setActiveMenu(e.key)}
                    selectedKeys={[activeMenu]}
                />
            </Sider>
            <Layout>
                <div className='admin-header'>
                    <span>
                        {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                            className: 'trigger',
                            onClick: () => setCollapsed(!collapsed),
                        })}
                    </span>
                    <Dropdown menu={{ items: itemsDropdown }} trigger={['click']}>
                        <a onClick={(e) => e.preventDefault()}>
                            <Space>
                                {user?.name}
                                <DownOutlined />
                            </Space>
                        </a>
                    </Dropdown>
                </div>
                <Content>
                    <div className="content-scrollable">
                        <Outlet />
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default LayoutAdmin;