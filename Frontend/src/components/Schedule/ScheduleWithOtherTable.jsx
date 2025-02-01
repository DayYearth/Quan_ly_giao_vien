import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Breadcrumb, message, Popconfirm, Table, Tag } from "antd";
import { DeleteTwoTone, EditTwoTone, HomeOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";

import { callDeleteSchedule, callFetchScheduleByInviteeId } from "../../services/api";
import UpdateSceduleModel from "./UpdateScheduleModel";


const ScheduleWithOtherTable = () => {
    const [openModelUpdate, setOpenModelUpdate] = useState(false);
    const [dataUpdate, setDataUpdate] = useState();
    const [schedulesInvitee, setSchedulesInvitee] = useState([]);
    const [current, setCurrent] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const user = useSelector(state => state.account.user);
    const navigate = useNavigate();

    const fetchSchedulesInvitee = async () => {
        setIsLoading(true);
        const res = await callFetchScheduleByInviteeId(current, pageSize, user.id);
        if (res.status === 200) {
            setSchedulesInvitee(res.data.data.result);
            setTotal(res.data.data.meta.total);
        }
        setIsLoading(false);
    }

    const handleDeleteSchedule = async (id) => {
        const res = await callDeleteSchedule(id);
        if (res.status === 204) {
            message.success("Xóa sự kiện thành công");
            fetchSchedulesInvitee(); // Refresh danh sách sau khi xóa
        } else {
            message.error("Không thể xóa sự kiện");
        }
    };

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
            title: 'Sự kiện',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                let color = 'warning';
                let label = '';
                switch (status) {
                    case 'PENDING':
                        color = 'warning';
                        label = 'Đang chờ';
                        break;
                    case 'REJECTED':
                        color = 'red';
                        label = 'Đã từ chối';
                        break;
                    case 'ACCEPTED':
                        color = 'green';
                        label = 'Đã chấp nhận'
                        break;
                    default:
                        color = 'warning';
                        label = 'Không xác định';
                }
                return <Tag color={color}>{label}</Tag>;
            }
        },
        {
            title: 'Thời gian',
            dataIndex: 'time',
            key: 'time',
        },
        {
            title: 'Action',
            render: (text, record, index) => {
                return (
                    <>
                        <EditTwoTone
                            twoToneColor="#f57800" style={{ cursor: "pointer" }}
                            onClick={() => {
                                setOpenModelUpdate(true);
                                setDataUpdate(record);
                            }}
                        />
                        <Popconfirm
                            placement="leftTop"
                            title={"Xác nhận xóa sự kiện"}
                            description={"Bạn có chắc chắn muốn xóa sự kiệnkiện này ?"}
                            onConfirm={() => handleDeleteSchedule(record.id)}
                            okText="Xác nhận"
                            cancelText="Hủy"
                        >
                            <span style={{ cursor: "pointer", margin: "0 20px" }}>
                                <DeleteTwoTone twoToneColor="#ff4d4f" />
                            </span>
                        </Popconfirm>
                    </>
                );
            }
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
                            <span>Sự kiện được mời</span>
                        ),
                    },
                ]}
            />
            <h1>Danh sách sự kiện được mời</h1>
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
                    showTotal: (total, range) => { return (<div> {range[0]}-{range[1]} trên {total} hàng</div>); }
                }}
                loading={isLoading}
            />
            <UpdateSceduleModel
                openModelUpdate={openModelUpdate}
                setOpenModelUpdate={setOpenModelUpdate}
                dataUpdate={dataUpdate}
                fetchSchedulesInvitee={fetchSchedulesInvitee}
            ></UpdateSceduleModel>
        </>
    )
}

export default ScheduleWithOtherTable;