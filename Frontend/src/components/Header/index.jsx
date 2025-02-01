import { FaReact } from "react-icons/fa";
import { VscSearchFuzzy } from "react-icons/vsc";
import { Avatar, Dropdown, message, Space } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { DownOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";

import { callFetchResume, callFetchResumeByUsername, } from "../../services/api";
import ManageAccount from "../Account/ManageAccount";
import "./header.scss"
import { doLogoutAction } from "../../redux/slice/accountSlide";

const Header = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    const isAuthenticated = useSelector(state => state.account.isAuthenticated);
    const user = useSelector(state => state.account.user);
    const [isInfor, setIsInfor] = useState(false);

    const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}storage/avatar/${user?.avatar}`;

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
            label: <Link to="/admin">Trang quản trị</Link>,
            key: 'admin',
        },
        {
            label: <label onClick={() => { setIsInfor(true) }}>Quản lý tài khoản</label>,
            key: 'account',
        },
        {
            label: <Link to="/resume">Hồ sơ cá nhân</Link>,
            key: 'resume',
        },
        {
            label: <label onClick={handleLogout} style={{ cursor: "pointer" }}>Đăng xuất</label>,
            key: 'logout',
        },
    ];

    const handleHomePage = () => {
        navigate("/")
    }

    const handleSearch = async (value) => {
        setSearchTerm(value);
        if (value.length >= 1) {
            setIsSearching(true);
            const res = await callFetchResumeByUsername(0, 5, `createdAt,asc`, value);
            if (res?.data?.data?.result) {
                setSearchResults(res.data.data.result);
            }
            setIsSearching(false);
        } else {
            setSearchResults([]);
        }
    };

    const searchName = () => {
        return (
            <div className='page-header__logo'>
                <div className="search-container">
                    <input
                        className="input-search"
                        type={'text'}
                        placeholder="Bạn tìm gì hôm nay"
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                    {searchResults.length > 0 && (
                        <div className="search-results">
                            {searchResults.map((result, index) => (
                                <div
                                    key={index}
                                    className="search-item"
                                    onClick={() => {
                                        navigate(`/resume/${result.id}`);
                                        setSearchResults([]);
                                        setSearchTerm('');
                                    }}
                                >
                                    <img src={`${import.meta.env.VITE_BACKEND_URL}storage/resume/${result.images}`} alt={result.name} />
                                    <div>{result.name}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    }
    return (
        <>
            <div className="header-container">
                <header className="page-header">
                    <div className="page-header__left">
                        <span className='logo' onClick={() => { handleHomePage() }}>
                            <FaReact className='rotate icon-react' /> ITSS
                            <VscSearchFuzzy className='icon-search' />
                        </span>
                    </div>

                    <div className="page-header__center">
                        {searchName()}
                    </div>

                    <div className="page-header__right">
                        <ul className="navigation">
                            <li className="navigation__item">
                                {!isAuthenticated ?
                                    <span onClick={() => navigate('/login')}>Tài Khoản</span>
                                    :
                                    <Dropdown menu={{ items: items }} trigger={['click']}>
                                        <a onClick={(e) => e.preventDefault()}>
                                            <Avatar src={urlAvatar} />
                                            <Space>
                                                Chào mừng {user?.name}
                                                <DownOutlined />
                                            </Space>
                                        </a>
                                    </Dropdown>
                                }
                            </li>
                        </ul>
                    </div>
                </header>
            </div>
            <ManageAccount isModalOpen={isInfor} setIsModalOpen={setIsInfor} />
        </>
    );
}

export default Header;