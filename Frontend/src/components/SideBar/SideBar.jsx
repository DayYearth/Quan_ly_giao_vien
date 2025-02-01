import { Menu } from 'antd';
import { HomeOutlined, CalendarOutlined, UserOutlined, ScheduleOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const SideBar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedKey, setSelectedKey] = useState('1');
    const isAuthenticated = useSelector(state => state.account.isAuthenticated);

    function getItem(label, key, icon, path) {
        return {
            key,
            icon,
            label,
            path,
        };
    }

    const defaultItems = [
        getItem('Trang chủ', '1', <HomeOutlined />, '/'),
    ];

    const authenticatedItems = [
        getItem('Lịch hẹn', '2', <CalendarOutlined />, '/schedules'),
        getItem('Lịch mời', '3', <ScheduleOutlined />, '/schedules/invitee'),
        getItem('Hồ sơ của tôi', '4', <UserOutlined />, '/resume'),
    ];

    const items = isAuthenticated ? [...defaultItems, ...authenticatedItems] : defaultItems;

    useEffect(() => {
        const currentItem = items.find(item => {
            // Exact match for root path
            if (item.path === '/' && location.pathname === '/') {
                return true;
            }

            // Special case for /schedules/invitee
            if (item.path === '/schedules/invitee') {
                return location.pathname === '/schedules/invitee';
            }

            // For /schedules, only match if it's exactly /schedules
            if (item.path === '/schedules') {
                return location.pathname === '/schedules';
            }

            return location.pathname === item.path;
        });

        if (currentItem) {
            setSelectedKey(currentItem.key);
        }
    }, [location.pathname, items]);
    const handleMenuClick = (item) => {
        const selectedItem = items.find(menuItem => menuItem.key === item.key);
        if (selectedItem?.path) {
            navigate(selectedItem.path);
        }
    };

    return (
        <div className="sidebar">
            <Menu
                theme="dark"
                selectedKeys={[selectedKey]}
                mode="inline"
                items={items}
                onClick={handleMenuClick}
            />
        </div>
    );
};

export default SideBar;