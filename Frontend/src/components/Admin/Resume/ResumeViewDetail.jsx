import React, { useState } from 'react';
import { Drawer, Row, Col, Tag, Rate } from 'antd';
import { FaRegHeart } from 'react-icons/fa';
// import SchedulePopup from './SchedulePopup';
// import ResumeLoader from './ResumeLoader';
import './ResumeViewDetail.scss';

const ResumeInfo = ({ label, children, className }) => (
    <div className={className}>
        <span className='left-side'>{label}: </span>
        <span className='right-side'>{children}</span>
    </div>
);

const ResumeViewDetail = ({ openViewDetail, setOpenViewDetail, dataViewDetail }) => {
    const [isOpenSchedule, setIsOpenSchedule] = useState(false);

    const onClose = () => setOpenViewDetail(false);

    const renderContent = () => {
        if (!dataViewDetail?.id) return <span>Không có dữ liệu</span>;

        return (
            <>
                <Row gutter={[20, 20]}>
                    <Col md={10} sm={24}>
                        <div className='thumbnail'>
                            <img
                                src={`${import.meta.env.VITE_BACKEND_URL}storage/resume/${dataViewDetail.images}`}
                                alt="thumbnail resume"
                            />
                        </div>
                    </Col>
                    <Col md={14} sm={24}>
                        <div className='resume-info'>
                            <div className='title'>{dataViewDetail.name}</div>
                            <div className='author'>
                                Tác giả: <a href='#'>{dataViewDetail.user.name}</a>
                            </div>
                            <ResumeInfo label="Chức vụ" className='job-title'>
                                <Tag color={dataViewDetail.status === 'PUBLIC' ? 'green' : 'orange'}>
                                    {dataViewDetail.jobTitle}
                                </Tag>
                            </ResumeInfo>
                            <ResumeInfo label="Đánh giá" className='rating'>
                                <Rate
                                    disabled
                                    value={dataViewDetail.rating}
                                    key={`rating-${dataViewDetail.id}-${dataViewDetail.rating}`}
                                />
                            </ResumeInfo>
                            <ResumeInfo label="Giới thiệu" className='description'>
                                {dataViewDetail.description}
                            </ResumeInfo>
                            <ResumeInfo label="Giải thưởng" className='reward'>
                                {dataViewDetail.reward}
                            </ResumeInfo>
                        </div>
                    </Col>
                </Row>
            </>
        );
    };

    return (
        <Drawer
            title="Chi tiết hồ sơ"
            onClose={onClose}
            open={openViewDetail}
            width="50vw"
        >
            <div className="resume-detail-wrapper">
                {renderContent()}
            </div>
        </Drawer>
    );
};

export default ResumeViewDetail;