import React from 'react';
import { Drawer } from 'antd';
import { Descriptions } from 'antd';
import moment from 'moment';

import { FORMAT_DATE_DISPLAY } from "../../../utils/constant";

const UserViewDetail = (props) => {
    const { openViewDetail, setOpenViewDetail, dataViewDetail } = props;

    const onClose = () => {
        setOpenViewDetail(false);
    };

    return (
        <>
            <Drawer title="Chi tiết người dùng" onClose={onClose} open={openViewDetail} width={"50vw"}>
                <Descriptions
                    title="Thông tin người dùng"
                    bordered
                    column={2}
                >
                    <Descriptions.Item label="Mã số"><a>{dataViewDetail?.id}</a></Descriptions.Item>
                    <Descriptions.Item label="Tên hiển thị">{dataViewDetail?.name}</Descriptions.Item>
                    <Descriptions.Item label="Email">{dataViewDetail?.email}</Descriptions.Item>
                    <Descriptions.Item label="Số điện thoại">{dataViewDetail?.phone}</Descriptions.Item>
                    <Descriptions.Item label="Ngày tạo">
                        {moment(dataViewDetail?.createdAt).format(FORMAT_DATE_DISPLAY)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày cập nhật">
                        {moment(dataViewDetail?.updatedAt).format(FORMAT_DATE_DISPLAY)}
                    </Descriptions.Item>
                </Descriptions>
            </Drawer>
        </>
    );
};

export default UserViewDetail;