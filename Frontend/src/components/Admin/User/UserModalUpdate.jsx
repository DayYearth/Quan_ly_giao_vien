import { Form, Input, message, Modal, notification } from "antd";
import { useEffect, useState } from "react";

import { callUpdateUser } from "../../../services/api";

const UserModalUpdate = (props) => {
    const { openModalUpdate, setOpenModalUpdate, fetchUser, dataUserUpdate } = props;

    const [isSubmit, setIsSubmit] = useState(false);
    const [form] = Form.useForm();

    const handleCancel = () => {
        setOpenModalUpdate(false);
        form.resetFields();
    };

    const onFinish = async (values) => {
        console.log('Success:', values);
        setIsSubmit(true);
        const res = await callUpdateUser(values);
        if (res && res.data) {
            message.success('Cập nhật user thành công');
            form.resetFields();
            setOpenModalUpdate(false);
            await fetchUser();
            setOpenModalUpdate(false);
            await fetchUser();
        } else {
            notification.error({
                message: 'Đã có lỗi xảy ra',
                description: res.message,
            });
        }
        setIsSubmit(false);
    };

    useEffect(() => {
        if (openModalUpdate && dataUserUpdate) {
            form.setFieldsValue(dataUserUpdate);
        }
    }, [openModalUpdate, dataUserUpdate, form]);

    return (
        <>
            <Modal title="Cập nhật người dùng"
                open={openModalUpdate}
                onOk={() => { form.submit() }}
                onCancel={handleCancel}
                okText={"Cập nhật"}
                cancelText={"Hủy"}
                confirmLoading={isSubmit}>
                <Form
                    form={form}
                    name="basic"
                    style={{ maxWidth: 600 }}
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item
                        labelCol={{ span: 24 }}
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: 'Vui lòng nhập tên hiển thị!' }]}
                    >
                        <Input disabled={true} />
                    </Form.Item>
                    <Form.Item
                        labelCol={{ span: 24 }}
                        label="Tên hiển thị"
                        name="name"
                        rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        labelCol={{ span: 24 }}
                        label="Tuổi"
                        name="age"
                        rules={[{ required: true, message: 'Vui lòng nhập tuổi!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="id"
                        hidden={true}
                    >
                        <Input type="hidden" />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default UserModalUpdate;