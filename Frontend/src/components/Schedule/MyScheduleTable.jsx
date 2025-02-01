import { useSelector } from "react-redux";
import { Breadcrumb, message, Popconfirm, Rate, Table, Tag } from "antd";
import { useEffect, useState } from "react";

import { callDeleteSchedule, callFetchSchedule } from "../../services/api";
import { DeleteTwoTone, HomeOutlined } from "@ant-design/icons";
import { Link, redirect, useNavigate } from "react-router-dom";

const MyScheduleTable = () => {
    const [schedulesInvitee, setSchedulesInvitee] = useState([]);
    const [current, setCurrent] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const [currentRating, setCurrentRating] = useState(0);

    const navigate = useNavigate();

    const user = useSelector(state => state.account.user);

    const fetchSchedulesInvitee = async () => {
        setIsLoading(true);
        const res = await callFetchSchedule(current, pageSize, "createdAt,desc", user.id);
        if (res.status === 200) {
            setSchedulesInvitee(res.data.data.result);
            setTotal(res.data.data.meta.total);
        }
        setIsLoading(false);
    }

    useEffect(() => {
        fetchSchedulesInvitee();
    }, [current, pageSize, user])

    const onChange = async (pagination, filters, sorter, extra) => {
        if (pagination && pagination.current !== current + 1) {
            setCurrent(pagination.current - 1); // Subtract 1 to start from 0
        }
        if (pagination && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize);
            setCurrent(0); // Reset to 0 when page size changes
        }
    };

    const handleDeleteSchedule = async (id) => {
        const res = await callDeleteSchedule(id);
        if (res.status === 204) {
            message.success("Xóa sự kiện thành công");
            fetchSchedulesInvitee(); // Refresh danh sách sau khi xóa
        } else {
            message.error("Không thể xóa sự kiện");
        }
    };

    const handleRating = async (record) => {
        try {
            // API call to update rating
            // await callUpdateRating(record.id, currentRating);
            message.success('Đánh giá thành công!');
        } catch (error) {
            message.error('Đánh giá thất bại!');
        }
    };

    const columns = [
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
            render: (text, record) => (
                <a onClick={() => {
                    navigate(`/schedules/${record.id}`);
                }}>{record.id}</a>
            ),
        },
        {
            title: 'Event',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                let color = 'default';
                switch (status) {
                    case 'PENDING':
                        color = 'warning';
                        break;
                    case 'REJECTED':
                        color = 'red';
                        break;
                    case 'ACCEPTED':
                        color = 'green';
                        break;
                    default:
                        color = 'default';
                }
                return <Tag color={color}>{status}</Tag>;
            }
        },
        {
            title: 'Time',
            dataIndex: 'time',
            key: 'time',
        },
        {
            title: 'Desciption',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Popconfirm
                    placement="leftTop"
                    title={"Xác nhận xóa user"}
                    description={"Bạn có chắc chắn muốn xóa sự kiện này này ?"}
                    onConfirm={() => {
                        handleDeleteSchedule(record.id)
                    }}
                    okText="Xác nhận"
                    cancelText="Hủy"
                >
                    <span style={{ cursor: "pointer", margin: "0 20px" }}>
                        <DeleteTwoTone twoToneColor="#ff4d4f" />
                    </span>
                </Popconfirm>
            ),
        },
        {
            title: 'Đánh giá',
            key: 'rating',
            render: (text, record) => (
                record.status === 'ACCEPTED' ? (
                    <Popconfirm
                        title="Đánh giá"
                        description={
                            <Rate
                                allowHalf
                                value={currentRating}
                                onChange={(value) => setCurrentRating(value)}
                            />
                        }
                        onConfirm={() => handleRating(record)}
                        okText="Xác nhận"
                        cancelText="Hủy"
                    >
                        <Tag color="blue" style={{ cursor: 'pointer' }}>
                            Đánh giá
                        </Tag>
                    </Popconfirm>
                ) : (
                    <Tag color="gray">Chưa chấp nhận</Tag>
                )
            ),
        }
    ];
    return (
        <>
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
                            <span>Sự kiện đã đăng ký</span>
                        ),
                    },
                ]}
            />
            <h1>Danh sách sự kiện đã đăng ký</h1>
            <Table
                columns={columns}
                dataSource={schedulesInvitee}
                rowKey="id"
                onChange={onChange}
                pagination={{
                    current: current + 1,
                    pageSize: pageSize,
                    showSizeChanger: true,
                    total: total,
                    showTotal: (total, range) => { return (<div> {range[0]}-{range[1]} trên {total} rows</div>); }
                }}
                loading={isLoading}
            />
        </>
    )
}

export default MyScheduleTable;