import { DeleteTwoTone, EditTwoTone, HomeOutlined, PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { Breadcrumb, Button, Col, message, notification, Popconfirm, Row, Table } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { callDeleteResume, callFetchResume } from "../../../services/api";
import CreateResumeModel from "./CreateResumeModel";
import UpdateResumeModel from "./UpdateResumeModel";
import { Link, useNavigate } from "react-router-dom";

const MyResumeTable = () => {

    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [dataModelUpdate, setDataModelUpdate] = useState(null);

    const [data, setData] = useState([]);
    const [current, setCurrent] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const user = useSelector(state => state.account.user);
    const navigate = useNavigate();

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

    const handleRedirectResume = (resume) => {
        const slug = convertSlug(resume.name);
        navigate(`/resumes/${slug}?id=${resume.id}`)
    }

    const columns = [
        {
            title: 'Id',
            dataIndex: 'id',
            render: (text, record, index) => {
                return (
                    <a href='#' onClick={() => {
                        handleRedirectResume(record);
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
            title: 'Trạng thái',
            dataIndex: 'status',
            sorter: true
        },
        {
            title: 'Ngành nghề',
            dataIndex: 'jobTitle',
            sorter: true
        },
        {
            title: 'Action',
            render: (text, record, index) => {
                return (
                    <>
                        <EditTwoTone
                            twoToneColor="#f57800" style={{ cursor: "pointer" }}
                            onClick={() => {
                                setDataModelUpdate(record);
                                setOpenModalUpdate(true);
                            }}
                        />
                        <Popconfirm
                            placement="leftTop"
                            title={"Xác nhận xóa hồ sơ"}
                            description={"Bạn có chắc chắn muốn xóa hồ sơ này ?"}
                            onConfirm={() => handelDeleteResume(record.id)}
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

    const renderHeader = () => {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>
                    <h1>Danh sách hồ sơ của tôi</h1>
                </span>

                <span style={{ display: 'flex', gap: 15, marginTop: 35 }}>
                    <Button
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
                    </Button>
                </span>
            </div>
        );
    };

    const fetchResume = async () => {
        if (!user || !user.name) return;
        setIsLoading(true);
        const res = await callFetchResume(current, pageSize, `name,desc&userId=${user.id}`);
        if (res && res.data.data.meta.total) {
            setData(res.data.data.result);
            setTotal(res.data.data.meta.total);
        }
        setIsLoading(false);
    };

    const handelDeleteResume = async (id) => {
        const res = await callDeleteResume(id);
        if (res && res.data) {
            message.success('Xóa hồ sơ thành công');
            fetchResume();
        } else {
            notification.error({
                message: 'Đã có lỗi xảy ra',
                description: res.message
            });
        }
    }

    useEffect(() => {
        fetchResume();
    }, [current, pageSize, user]);

    const onChange = async (pagination, filters, sorter, extra) => {
        if (pagination && pagination.current !== current + 1) {
            setCurrent(pagination.current - 1); // Subtract 1 to start from 0
        }
        if (pagination && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize);
            setCurrent(0); // Reset to 0 when page size changes
        }
    };



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
                            <span>Danh sách hồ sơ</span>
                        ),
                    }
                ]}
            />
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
                            showTotal: (total, range) => { return (<div> {range[0]}-{range[1]} trên {total} rows</div>); }
                        }}
                        loading={isLoading}
                    />
                </Col>
            </Row>
            <CreateResumeModel
                openModalCreate={openModalCreate}
                setOpenModalCreate={setOpenModalCreate}
                fetchResume={fetchResume}
            ></CreateResumeModel>
            <UpdateResumeModel
                openModalUpdate={openModalUpdate}
                setOpenModalUpdate={setOpenModalUpdate}
                data={dataModelUpdate}
                fetchResume={fetchResume}
            ></UpdateResumeModel>

        </>
    );
}
export default MyResumeTable;