import React, { useState } from 'react';
import { Button, Checkbox, Form, Input, message, notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { callRegister, login } from '../../services/api';
import { doLoginAction } from '../../redux/slice/accountSlide';
import './login.scss';

const LoginPage = () => {
    const [isSubmit, setIsSubmit] = useState(false);
    const [isLogin, setIsLogin] = useState(true);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const onFinish = async (values) => {
        const { username, password } = values;

        setIsSubmit(true);
        if (isLogin) {
            const res = await login(username, password);
            setIsSubmit(false);

            if (res?.data?.user) {
                localStorage.setItem('access_token', res.data.access_token)
                dispatch(doLoginAction(res.data))
                message.success("Đăng nhập người dùng thành công!!!");
                navigate('/')
            } else {
                notification.error({
                    message: "Có lỗi xảy ra!!!",
                    description: res.message,
                    duration: 5
                })
            }
        } else {
            const res = await callRegister(values);
            setIsSubmit(false);

            if (res?.data?.data) {
                message.success("Đăng ký người dùng thành công!!!");
                setIsLogin(true);
            } else {
                notification.error({
                    message: "Có lỗi xảy ra!!!",
                    description: res.message,
                    duration: 5
                })
            }
        }
    };

    const onFinishFailed = (errorInfo) => {
        message.success("Có lỗi xảy ra!!!", errorInfo);
    };

    const handleChange = () => {
        setIsLogin(!isLogin);
    }

    const loginForm = () => {
        return (
            <>
                <h3>Đăng nhập</h3>
                <Form
                    name="basic"
                    labelCol={{
                        span: 7,
                    }}
                    wrapperCol={{
                        span: 17,
                    }}
                    style={{
                        maxWidth: '400px',
                        margin: '0 auto',
                    }}
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    {/* Email */}
                    <Form.Item
                        label="Email:"
                        name="username"
                        rules={[{ required: true, message: 'Hãy nhập email của bạn!' }]}
                    >
                        <Input style={{ height: '35px', borderRadius: '5px' }} />
                    </Form.Item>
                    {/* Password */}
                    <Form.Item
                        label="Password:"
                        name="password"
                        rules={[{ required: true, message: 'Hãy nhập mật khẩu của bạn!' }]}
                    >
                        <Input.Password style={{ height: '35px', borderRadius: '5px' }} />
                    </Form.Item>
                    {/* Remember Me */}
                    <Form.Item
                        name="remember"
                        valuePropName="checked"
                        wrapperCol={{
                            offset: 7,
                            span: 17,
                        }}
                        style={{ marginBottom: '20px' }}
                    >

                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>
                    {/* Login Button */}
                    <Form.Item
                        wrapperCol={{
                            span: 24,
                        }}
                        style={{ textAlign: 'center', marginBottom: '10px' }}
                    >
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={isSubmit}
                            style={{
                                width: '150px',
                                borderRadius: '5px',
                                marginBottom: '10px',
                                backgroundColor: '#FF4D4F',
                                borderColor: '#FF4D4F',
                                color: 'white',
                            }}
                        >
                            Đăng nhập
                        </Button>
                    </Form.Item>
                    {/* Register Link */}
                    <div style={{ textAlign: 'center', marginTop: '10px' }}>
                        <span style={{ color: '#888' }}>Bạn chưa có tài khoản? </span>
                        <span
                            onClick={() => handleChange()}
                            style={{
                                color: '#FF4D4F',
                                cursor: 'pointer',
                                textDecoration: 'underline',
                                fontWeight: '500',
                            }}
                        >
                            Đăng ký ngay
                        </span>
                    </div>
                </Form>
            </>
        )
    }

    const registerForm = () => {
        return (
            <>
                <h3>Đăng ký</h3>
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
                    {/* Register Link */}
                    <div style={{ textAlign: 'center', marginTop: '10px' }}>
                        <span style={{ color: '#888' }}>Bạn đã có tài khoản? </span>
                        <span
                            onClick={() => handleChange()}
                            style={{
                                color: '#FF4D4F',
                                cursor: 'pointer',
                                textDecoration: 'underline',
                                fontWeight: '500',
                            }}
                        >
                            Quay lại đăng nhập
                        </span>
                    </div>
                </Form>

            </>
        )
    }

    return (
        <div className='login-page'>
            <div className='login-container'>
                <div className='login-image'></div>
                <div className='login-form'>

                    {isLogin ? loginForm() : registerForm()}
                </div>
            </div>
        </div>
    );
};

export default LoginPage;