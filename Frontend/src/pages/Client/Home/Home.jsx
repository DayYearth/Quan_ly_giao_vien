import { HomeOutlined } from "@ant-design/icons";
import { Breadcrumb, Empty, Form, Pagination, Rate, Spin, Tabs, Tag } from "antd";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import './home.scss'
import { callFetchResume } from "../../../services/api";
import { useDispatch, useSelector } from "react-redux";

const Home = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const user = useSelector(state => state.account.user);

    const [isLoading, setIsLoading] = useState(false);

    const [listResume, setListResume] = useState([]);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(4);
    const [total, setTotal] = useState(0);

    const [sort, setSort] = useState("name,asc");

    const items = [
        {
            key: "asc",
            label: `Tất cả`,
            children: <></>,
        },
        {
            key: 'createdAt,desc',
            label: `Giáo viên mới`,
            children: <></>,
        },
        {
            key: 'rating,asc',
            label: `Trình độ thấp đến cao`,
            children: <></>,
        },
        {
            key: 'rating,desc',
            label: `Trình độ Cao Đến Thấp`,
            children: <></>,
        },
        {
            key: `&userId=${user.id}`,
            label: `Hồ sơ của tôi`,
            children: <></>,
        },
    ];

    const nonAccentVietnamese = (str) => {
        if (typeof str !== 'string') return '';
        str = str.replace(/A|Á|À|Ã|Ạ|Â|Ấ|Ầ|Ẫ|Ậ|Ă|Ắ|Ằ|Ẵ|Ặ/g, "A");
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/E|É|È|Ẽ|Ẹ|Ê|Ế|Ề|Ễ|Ệ/, "E");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/I|Í|Ì|Ĩ|Ị/g, "I");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/O|Ó|Ò|Õ|Ọ|Ô|Ố|Ồ|Ỗ|Ộ|Ơ|Ớ|Ờ|Ỡ|Ợ/g, "O");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/U|Ú|Ù|Ũ|Ụ|Ư|Ứ|Ừ|Ữ|Ự/g, "U");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/Y|Ý|Ỳ|Ỹ|Ỵ/g, "Y");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/Đ/g, "D");
        str = str.replace(/đ/g, "d");
        // Some system encode vietnamese combining accent as individual utf-8 characters
        str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng
        str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
        return str;
    }

    const convertSlug = (str) => {
        str = nonAccentVietnamese(str);
        str = str.replace(/^\s+|\s+$/g, ''); // trim
        str = str.toLowerCase();

        // remove accents, swap ñ for n, etc
        const from = "ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆĞÍÌÎÏİŇÑÓÖÒÔÕØŘŔŠŞŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇğíìîïıňñóöòôõøðřŕšşťúůüùûýÿžþÞĐđßÆa·/_,:;";
        const to = "AAAAAACCCDEEEEEEEEGIIIIINNOOOOOORRSSTUUUUUYYZaaaaaacccdeeeeeeeegiiiiinnooooooorrsstuuuuuyyzbBDdBAa------";
        for (let i = 0, l = from.length; i < l; i++) {
            str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
        }

        str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
            .replace(/\s+/g, '-') // collapse whitespace and replace by -
            .replace(/-+/g, '-'); // collapse dashes

        return str;
    }

    useEffect(() => {
        fetchResume();
    }, [current, pageSize, sort]);

    const fetchResume = async () => {
        setIsLoading(true)
        const res = await callFetchResume(current - 1, pageSize, sort);
        if (res && res.data) {
            setListResume(res.data.data.result);
            setTotal(res.data.data.meta.total)
        }
        setIsLoading(false)
    }

    const handleOnchangePage = (pagination) => {
        if (pagination && pagination.current !== current) {
            setCurrent(pagination.current)
        }
        if (pagination && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize)
            setCurrent(0);
        }
    }

    const handleRedirectResume = (resume) => {
        const slug = convertSlug(resume.name);
        navigate(`/resumes/${slug}?id=${resume.id}`)
    }

    return (
        <div className="home">
            <Breadcrumb
                className="home-breadcrumb"
                items={[
                    {
                        title: <HomeOutlined />,
                    },
                    {
                        title: (
                            <Link to={'/'}>
                                <span>Trang Chủ</span>
                            </Link>
                        ),
                    }
                ]}
            />
            <div className="home-content">
                <Spin spinning={isLoading} tip="Loading...">
                    <div className="home-content__header">
                        <Tabs
                            defaultActiveKey="sort=-name,asc"
                            items={items}
                            onChange={(value) => { setSort(value) }}
                        />
                    </div>
                    <div className="home-content__body">
                        {listResume?.length > 0 ? (
                            <div className="resume-grid">
                                {listResume.map((item, index) => (
                                    <div className="resume-card" key={`resume-${index}`} onClick={() => handleRedirectResume(item)}>
                                        <div className="resume-card__image">
                                            <img src={`${import.meta.env.VITE_BACKEND_URL}storage/resume/${item.images}`} />
                                        </div>
                                        <div className="resume-card__info">
                                            <h3 className="resume-card__title" title={item.name}>{item.name}</h3>
                                            <div className="resume-card__footer">
                                                <div className="resume-card__status">
                                                    <Tag color={item.status === 'PUBLIC' ? 'green' : 'orange'}>
                                                        {item.jobTitle}
                                                    </Tag>
                                                </div>
                                                <div className="resume-card__rating" style={{ textAlign: "end" }}>
                                                    Đánh giá: <Rate
                                                        disabled
                                                        value={item.rating}
                                                        key={`rating-${item.id}-${item.rating}`}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <Empty description="Không có dữ liệu" />
                        )}
                    </div>
                    <div className="home-content__footer">
                        <Pagination
                            current={current}
                            total={total}
                            pageSize={pageSize}
                            responsive
                            onChange={(p, s) => handleOnchangePage({ current: p, pageSize: s })}
                        />
                    </div>
                </Spin>
            </div>
        </div>
    );
}

export default Home;