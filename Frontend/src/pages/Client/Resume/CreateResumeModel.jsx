import React, { useState } from 'react';
import { Avatar, Button, Col, Form, Input, message, Modal, Row, Select, Upload } from 'antd';
import { AntDesignOutlined, UploadOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';

import { callCreateResume, callUploadSingleFile } from '../../../services/api';

const { Option } = Select;

const CreateResumeModel = (props) => {
    const { openModalCreate, setOpenModalCreate } = props;

    const [isSubmit, setIsSubmit] = useState(false);
    const [form] = Form.useForm();
    const [uploadedImage, setUploadedImage] = useState(null);

    const user = useSelector(state => state.account.user);

    const handleCancel = () => {
        setOpenModalCreate(false);
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
        const res = await callCreateResume(values);
        if (res && res.data) {
            message.success('Tạo mới CV thành công');
            form.resetFields();
            setOpenModalCreate(false);
            await props.fetchResume();
        } else {
            notification.error({
                message: 'Đã có lỗi xảy ra',
                description: res.message
            });
        }
        setIsSubmit(false);
    };

    const handleFinish = (values) => {
        const formattedValues = {
            ...values,
            images: uploadedImage,
        };
        onFinish(formattedValues);
    };

    return (
        <>
            <Modal
                title="Tạo mới CV"
                open={openModalCreate}
                onOk={() => { form.submit() }}
                onCancel={handleCancel}
                confirmLoading={isSubmit}
                width={"60vw"} // Increase the width of the modal
            >
                <div style={{ minHeight: 400 }}>
                    <Row gutter={[30, 30]}>
                        <Col sm={24} md={12}>
                            <Row gutter={[30, 30]}>
                                <Col span={24}>
                                    <Avatar
                                        size={{ xs: 64, sm: 128, md: 160, lg: 200, xl: 240, xxl: 280 }}
                                        icon={<AntDesignOutlined />}
                                        src={`${import.meta.env.VITE_BACKEND_URL}storage/resume/${uploadedImage}`}
                                        shape="circle"
                                    />
                                </Col>
                                <Col span={24}>
                                    <Upload {...propsUpload}>
                                        <Button icon={<UploadOutlined />} size="large">
                                            Tải lên ảnh đại diện
                                        </Button>
                                    </Upload>
                                </Col>
                            </Row>
                        </Col>
                        <Col sm={24} md={12}>
                            <Form
                                onFinish={handleFinish}
                                form={form}
                                labelCol={{ span: 24 }} // Increase the label column span
                                wrapperCol={{ span: 24 }} // Increase the wrapper column span
                            >
                                <Form.Item
                                    label="Tên hiển thị"
                                    name="name"
                                    initialValue={user?.name}
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
        </>
    );
};

export default CreateResumeModel;