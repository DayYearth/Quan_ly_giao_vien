import { DeleteTwoTone, EditTwoTone, PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { Button, Col, message, notification, Popconfirm, Row, Table } from "antd";
import { useEffect, useState } from "react";

import { callDeleteUser, callFetchUser } from "../../../services/api";
import UserViewDetail from "./UserViewDetail";
import UserModalUpdate from "./UserModalUpdate";
import UserModalCreate from "./UserModalCreate";

const UserTable = () => {
    const [data, setData] = useState([]);
    const [current, setCurrent] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [openViewDetail, setOpenViewDetail] = useState(false);
    const [dataViewDetail, setDataViewDetail] = useState(null);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [dataUserUpdate, setDataUserUpdate] = useState(null);

    const [openModalImport, setOpenModalImport] = useState(false);

    const [filter, setFilter] = useState("");
    const [sortQuery, setSortQuery] = useState("");

    const columns = [
        {
            title: 'Mã số',
            dataIndex: 'id',
            render: (text, record, index) => {
                return (
                    <a href='#' onClick={() => {
                        setOpenViewDetail(true);
                        setDataViewDetail(record);
                    }}>{record.id}</a>
                );
            }
        },
        {
            title: 'Tên',
            dataIndex: 'name',
            sorter: true
        },
        {
            title: 'Email',
            dataIndex: 'email',
            sorter: true
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            sorter: true
        },
        // {
        //     title: 'Action',
        //     render: (text, record, index) => {
        //         return (
        //             <>
        //                 <EditTwoTone
        //                     twoToneColor="#f57800" style={{ cursor: "pointer" }}
        //                     onClick={() => {
        //                         setOpenModalUpdate(true);
        //                         setDataUserUpdate(record);
        //                     }}
        //                 />
        //                 <Popconfirm
        //                     placement="leftTop"
        //                     title={"Xác nhận xóa user"}
        //                     description={"Bạn có chắc chắn muốn xóa user này ?"}
        //                     onConfirm={() => callDeleteUser(record.id)}
        //                     okText="Xác nhận"
        //                     cancelText="Hủy"
        //                 >
        //                     <span style={{ cursor: "pointer", margin: "0 20px" }}>
        //                         <DeleteTwoTone twoToneColor="#ff4d4f" />
        //                     </span>
        //                 </Popconfirm>
        //             </>
        //         );
        //     }
        // }
    ];

    const renderHeader = () => {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span><h1>Bảng danh sách giáo viên</h1></span>
                <span style={{ display: 'flex', gap: 15 }}>
                    {/* <Button
                        icon={<PlusOutlined />}
                        type="primary"
                        onClick={() => {
                            setOpenModalCreate(true);
                        }}
                    >Thêm mới</Button>
                    <Button type='ghost' onClick={() => {
                        setFilter("");
                        setSortQuery("");
                    }}>
                        <ReloadOutlined />
                    </Button> */}
                </span>
            </div>
        );
    };

    const fetchUser = async () => {
        const res = await callFetchUser(current, pageSize, 'name,asc');
        if (res && res.data.data.meta.total) {
            setData(res.data.data.result);
            setTotal(res.data.data.meta.total);
        }
        setIsLoading(false);
    };

    const onChange = async (pagination, filters, sorter, extra) => {
        if (pagination && pagination.current !== current + 1) {
            setCurrent(pagination.current - 1); // Subtract 1 to start from 0
        }
        if (pagination && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize);
            setCurrent(0); // Reset to 0 when page size changes
        }
        if (sorter && sorter.field) {
            const q = sorter.order === 'ascend' ? `sort=${sorter.field}` : `sort=-${sorter.field}`;
            setSortQuery(q);
        }
    };

    useEffect(() => {
        fetchUser();
    }, [current, pageSize, filter, sortQuery]);

    const handleDeleteUser = async (_id) => {
        console.log("delete user", _id);
        const res = await callDeleteUser(_id);
        if (res && res.data) {
            message.success('Xoá người dùng thành công');
            fetchUser();
        } else {
            notification.error({
                message: 'Đã có lỗi xảy ra',
                description: res.message,
            });
        }
    };

    return (
        <>
            <Row gutter={[20, 20]}>
                <Col span={24}>
                </Col>
                <Col span={24}>
                    <Table
                        title={renderHeader}
                        columns={columns}
                        dataSource={data}
                        onChange={onChange}
                        rowKey="id"
                        pagination={{
                            current: current + 1,
                            pageSize: pageSize,
                            showSizeChanger: true,
                            total: total,
                            showTotal: (total, range) => { return (<div> {range[0]}-{range[1]} trên {total} hàng</div>); }
                        }}
                        loading={isLoading}
                    />
                </Col>
            </Row>
            <UserViewDetail
                openViewDetail={openViewDetail}
                setOpenViewDetail={setOpenViewDetail}
                dataViewDetail={dataViewDetail}
            />
            {/* <UserModalUpdate
                openModalUpdate={openModalUpdate}
                setOpenModalUpdate={setOpenModalUpdate}
                setDataUserUpdate={setDataUserUpdate}
                dataUserUpdate={dataUserUpdate}
                fetchUser={fetchUser}
            /> */}
            <UserModalCreate
                openModalCreate={openModalCreate}
                setOpenModalCreate={setOpenModalCreate}
                fetchUser={fetchUser}
            />
        </>
    );
};

export default UserTable;