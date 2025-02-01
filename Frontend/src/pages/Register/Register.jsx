/* eslint-disable no-unused-vars */
import React from 'react';
import { Form, Input, Button, message } from 'antd';

const RegisterPage = ({ onClose }) => {
    const onFinish = (values) => {
        console.log('Đăng ký thành công:', values);
        message.success("Đăng ký thành công!");
        onClose(); // Quay lại trang đăng nhập
    };

    const onFinishFailed = (errorInfo) => {
        message.error("Có lỗi xảy ra khi đăng ký!", errorInfo);
    };

    return (
        <div
            className="register-page"
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                background: `url('backgrounds.jpeg') no-repeat center center`,
                backgroundSize: 'cover',
                backgroundAttachment: 'fixed'
            }}
        >
            <div
                style={{
                    padding: '20px',
                    background: '#fff',
                    borderRadius: '10px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    position: 'relative',
                    width: '100%',
                    maxWidth: '450px',
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>Đăng ký</h3>
                    <Button
                        type="text"
                        onClick={(e) => {
                            e.preventDefault(); // Ngăn tải lại trang
                            onClose(); // Đóng form đăng ký
                        }}
                        style={{
                            fontSize: '18px',
                            position: 'absolute',
                            top: 0,
                            right: 10,
                            color: '#FF4D4F', // Màu đỏ cho dấu X
                        }}
                    >
                        ✖
                    </Button>
                </div>
                <Form
                    name="register"
                    labelCol={{
                        span: 10,
                    }}
                    wrapperCol={{
                        span: 17,
                    }}
                    style={{
                        maxWidth: '400px',
                        margin: '0 auto',
                    }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Tên:"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập tên!',
                            },
                        ]}
                        style={{
                            marginBottom: '15px',
                        }}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Email:"
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập email!',
                            },
                        ]}
                        style={{
                            marginBottom: '15px',
                        }}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Số điện thoại:"
                        name="phone"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập số điện thoại!',
                            },
                        ]}
                        style={{
                            marginBottom: '15px',
                        }}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Mật khẩu:"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập mật khẩu!',
                            },
                        ]}
                        style={{
                            marginBottom: '15px',
                        }}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        label="Xác nhận mật khẩu:"
                        name="confirm"
                        dependencies={['password']}
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng xác nhận mật khẩu!',
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Mật khẩu không khớp!'));
                                },
                            }),
                        ]}
                        style={{
                            marginBottom: '20px',
                        }}
                    >
                        <Input.Password />
                    </Form.Item>

                    {/* Điều khoản */}
                    <div
                        style={{
                            textAlign: 'center',
                            marginBottom: '20px',
                            fontSize: '13px',
                            color: '#888',
                        }}
                    >
                        Bằng việc đăng ký, bạn đã đồng ý với{' '}
                        <span
                            style={{
                                color: '#FF4D4F',
                                cursor: 'pointer',
                                textDecoration: 'underline',
                            }}
                            onClick={() => message.info('Điều khoản sử dụng sẽ được mở.')}
                        >
                            các điều khoản của chúng tôi
                        </span>
                        .
                    </div>

                    <Form.Item
                        wrapperCol={{
                            span: 24,
                        }}
                        style={{ textAlign: 'center' }}
                    >
                        <Button
                            type="primary"
                            htmlType="submit"
                            style={{
                                width: '150px',
                                borderRadius: '5px',
                                backgroundColor: '#FF4D4F', // Nút đỏ
                                borderColor: '#FF4D4F', // Biên đỏ
                                color: 'white', // Chữ trắng
                            }}
                        >
                            Đăng ký
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div >
    );
};

export default RegisterPage;
