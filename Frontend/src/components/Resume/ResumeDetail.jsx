import { Row, Col, Breadcrumb, Tag, Rate } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { FaRegHeart } from "react-icons/fa";
import { Link } from 'react-router-dom';
import ResumeLoader from './ResumeLoader';
import { useState } from 'react';
import SchedulePopup from './SchedulePopup';
import './resume.scss';

const ResumeDetail = (props) => {
    const { dataResume } = props;
    const [isOpenSchedule, setIsOpenSchedule] = useState(false);

    return (
        <div style={{ background: '#efefef', padding: "20px 0" }}>
            <div className='view-detail-resume' style={{ maxWidth: 1440, margin: '0 auto', minHeight: "calc(100vh - 150px)" }}>
                <Breadcrumb
                    style={{ margin: '5px 0' }}
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
                        },
                        {
                            title: (
                                <Link to={'/resume'}>
                                    <span>Danh sách CV</span>
                                </Link>
                            ),
                        },
                        {
                            title: (
                                <span>Chi tiết CV</span>
                            ),
                        }
                    ]}
                />
                <div style={{ padding: "20px", background: '#fff', borderRadius: 5 }}>
                    {dataResume && dataResume.id ? (
                        <>
                            <Row gutter={[20, 20]}>
                                <Col md={10} sm={24}>
                                    <div className='thumbnail'>
                                        <img src={`${import.meta.env.VITE_BACKEND_URL}storage/resume/${dataResume.images}`} alt="thumbnail resume" />
                                    </div>
                                </Col>
                                <Col md={14} sm={24}>
                                    <Col span={24}>
                                        <div className='title'>{dataResume?.name}</div>
                                        <div className='author'>Tác giả: <a href='#'>{dataResume?.user.name}</a></div>
                                        <div className='job-title'>
                                            <span className='left-side'>Chức vụ: </span>
                                            <span className='right-side'>
                                                <Tag color={dataResume.status === 'PUBLIC' ? 'green' : 'orange'}>
                                                    {dataResume.jobTitle}
                                                </Tag>
                                            </span>
                                        </div>
                                        <div className='rating'>
                                            <span className='left-side'>Đánh giá: </span>
                                            <span className='right-side'>
                                                <Rate
                                                    disabled
                                                    value={dataResume.rating}
                                                    key={`rating-${dataResume.id}-${dataResume.rating}`}
                                                />
                                            </span>
                                        </div>
                                        <div className='description'>
                                            <span className='left-side'>Giới thiệu: </span>
                                            <span className='right-side'>{dataResume.description}</span>
                                        </div>
                                        <div className='reward'>
                                            <span className='left-side'>Giải thưởng: </span>
                                            <span className='right-side'>{dataResume.reward}</span>
                                        </div>
                                        <div className='actions'>
                                            <button className='cart'>
                                                <FaRegHeart className='icon-cart' />
                                                <span>Thêm vào yêu thích</span>
                                            </button>
                                            <button
                                                className='now'
                                                onClick={() => setIsOpenSchedule(true)}
                                            >Đặt lịch hẹn</button>
                                        </div>
                                    </Col>
                                </Col>
                            </Row>
                            <SchedulePopup
                                isModalOpen={isOpenSchedule}
                                setIsModalOpen={setIsOpenSchedule}
                                image={`${import.meta.env.VITE_BACKEND_URL}storage/resume/${dataResume.images}`}
                                dataResume={dataResume}
                            />
                        </>
                    ) : (
                        <ResumeLoader />
                    )}
                </div>
            </div>
        </div>
    );
}

export default ResumeDetail;