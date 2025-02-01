import React, { useState, useEffect } from 'react';
import { Avatar, Button, Col, Form, Input, message, Modal, Row, Select, Upload } from 'antd';
import { AntDesignOutlined, UploadOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { callUpdateResume, callUploadSingleFile } from '../../../services/api';

const UpdateResumeModel = (props) => {
    const { openModalUpdate, setOpenModalUpdate, data, fetchResume } = props;

    const [isSubmit, setIsSubmit] = useState(false);
    const [form] = Form.useForm();
    const [uploadedImage, setUploadedImage] = useState(data?.images || null);

    const user = useSelector(state => state.account.user);

    useEffect(() => {
        if (data) {
            form.setFieldsValue({
                id: data.id,
                name: data.name,
                jobTitle: data.jobTitle,
                status: data.status,
                description: data.description,
                reward: data.reward,
                images: data.images,
            });
        }
    }, [data, form]);

    const handleCancel = () => {
        setOpenModalUpdate(false);
        form.resetFields();
        setUploadedImage(null);
    };

    const handleUploadAvatar = async ({ file, onSuccess, onError }) => {
        const res = await callUploadSingleFile(file, "resume");
        if (res && res.data) {
            const newAvatar = res.data.fileName;
            setUploadedImage(newAvatar);
            onSuccess('ok');
        } else {
            onError('Đã có lỗi khi upload file');
        }
    };

    const propsUpload = {
        maxCount: 1,
        multiple: false,
        showUploadList: false,
        customRequest: handleUploadAvatar,
        onChange(info) {
            if (info.file.status !== 'uploading') {
            }
            if (info.file.status === 'done') {
                message.success(`Upload file thành công`);
            } else if (info.file.status === 'error') {
                message.error(`Upload file thất bại`);
            }
        },
    };

    const onFinish = async (values) => {
        setIsSubmit(true);
        const res = await callUpdateResume(values);
        if (res && res.data) {
            message.success('Cập nhật hồ sơ thành công');
            form.resetFields();
            setOpenModalUpdate(false);
            await props.fetchResume();
        } else {
            notification.error({
                message: 'Đã có lỗi xảy ra',
                description: res.message
            });
        }
        fetchResume();
        setIsSubmit(false);
    };

    const handleFinish = (values) => {
        const formattedValues = {
            ...values,
            images: uploadedImage ? uploadedImage : data?.images,
        };
        onFinish(formattedValues);
    };

    return (
        <Modal
            title="Cập nhật CV"
            open={openModalUpdate}
            onOk={() => { form.submit() }}
            onCancel={handleCancel}
            confirmLoading={isSubmit}
            width={"60vw"}
        >
            <div style={{ minHeight: 400 }}>
                <Row gutter={[30, 30]}>
                    <Col sm={24} md={12}>
                        <Row gutter={[30, 30]}>
                            <Col span={24}>
                                <Avatar
                                    size={{ xs: 64, sm: 128, md: 160, lg: 200, xl: 240, xxl: 280 }}
                                    icon={<AntDesignOutlined />}
                                    src={`${import.meta.env.VITE_BACKEND_URL}storage/resume/${uploadedImage ? uploadedImage : data?.images}`}
                                    shape="circle"
                                />
                            </Col>
                            <Col span={24}>
                                <Upload {...propsUpload}>
                                    <Button icon={<UploadOutlined />} size="large">
                                        Upload Avatar
                                    </Button>
                                </Upload>
                            </Col>
                        </Row>
                    </Col>
                    <Col sm={24} md={12}>
                        <Form
                            onFinish={handleFinish}
                            form={form}
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                        >
                            <Form.Item
                                label="Tên hiển thị"
                                name="id"
                                hidden>
                            </Form.Item>
                            <Form.Item
                                label="Tên hiển thị"
                                name="name"
                                rules={[{ required: true, message: 'Tên hiển thị không được để trống!' }]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                label="Ngành nghề"
                                name="jobTitle"
                                rules={[{ required: true, message: 'Vui lòng chọn ngành nghề!' }]}
                            >
                                <Select
                                    placeholder="Chọn ngành nghề"
                                >
                                    <Select.Option value="Giảng viên">Giảng viên</Select.Option>
                                    <Select.Option value="Trưởng bộ môn">Trưởng bộ môn</Select.Option>
                                    <Select.Option value="Phó Trưởng khoa">Trưởng khoa</Select.Option>
                                    <Select.Option value="Phó Hiệu trưởng">Phó Hiệu trưởng</Select.Option>
                                    <Select.Option value="Hiệu trưởng">Hiệu trưởng</Select.Option>
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label="Trạng thái"
                                name="status"
                                rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
                            >
                                <Select placeholder="Chọn trạng thái">
                                    <Select.Option value="PUBLIC">Công khai</Select.Option>
                                    <Select.Option value="PRIVATE">Riêng tư</Select.Option>
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label="Mô tả"
                                name="description"
                                rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
                            >
                                <Input.TextArea rows={4} />
                            </Form.Item>
                            <Form.Item
                                label="Giải thưởng"
                                name="reward"
                            >
                                <Input.TextArea rows={4} />
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
            </div>
        </Modal>
    );
}

export default UpdateResumeModel;