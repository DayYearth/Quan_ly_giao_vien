import { Button, Col, Form, Input, Modal, Row, DatePicker, notification, message } from "antd";
import { useState } from "react";
import { useDispatch } from "react-redux";
import moment from "moment";

import { FORMAT_DATE_DISPLAY } from "../../utils/constant";
import { callCreateSchedule, callSendEmail } from "../../services/api";

const SchedulePopup = (props) => {
    const { isModalOpen, setIsModalOpen, image, dataResume } = props;

    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const [isSubmit, setIsSubmit] = useState(false);

    // Danh sách các ngày bận (fake data)
    const busyDates = [
        {
            date: '2024-12-23',
            times: ['09:00', '10:00', '14:00']
        },
        {
            date: '2024-12-25',
            times: ['11:00', '15:00']
        }
    ];

    const isBusyDate = (current) => {
        if (!current) return false;

        // Check if the date is valid
        if (!moment(current).isValid()) {
            console.log('Invalid date');
            return false;
        }

        // Find the busy date entry for current date
        const busyDate = busyDates.find(busy =>
            moment(busy.date).isSame(current, 'day')
        );

        if (busyDate) {
            const currentTime = moment(current).format('HH:mm');
            // Check if current time matches any busy time
            return busyDate.times.includes(currentTime);
        }

        return false;
    };

    const disabledTime = (current) => {
        if (!current || !moment(current).isValid()) return {};
        const busyDate = busyDates.find(busyDate =>
            moment(busyDate.date, 'YYYY-MM-DD').isSame(moment(current).startOf('day'), 'day')
        );

        if (busyDate) {
            const busyTimes = busyDate.times.map(time => moment(time, 'HH:mm'));
            const busyHours = Array.from(new Set(busyTimes.map(time => time.hour())));

            return {
                disabledHours: () =>
                    Array.from({ length: 24 }, (_, hour) => (busyHours.includes(hour) ? hour : null)).filter(i => i !== null),
                disabledMinutes: (selectedHour) => {
                    const busyMinutes = busyTimes
                        .filter(time => time.hour() === selectedHour)
                        .map(time => time.minute());
                    return Array.from({ length: 60 }, (_, minute) => (busyMinutes.includes(minute) ? minute : null)).filter(i => i !== null);
                }
            };
        }

        return {};
    };

    const onFinish = async (values) => {
        const formattedValues = {
            ...values,
            time: values.time.format(FORMAT_DATE_DISPLAY),
            resumeId: dataResume.id,
            inviteeId: dataResume.user.id,
            imageUrl: dataResume.images
        };

        const emailValues = {
            email: values.email,
            name: values.name,
            description: values.description,
            time: values.time.format(FORMAT_DATE_DISPLAY),
            phone: values.phone,
            // status: 'PENDING',
        }

        const res = await callCreateSchedule(formattedValues);
        if (res && res?.data) {
            // const sendMail = await callSendEmail(emailValues);
            message.success('Đăng ký lịch thành công!');
        } else {
            notification.error({
                message: 'Có lỗi',
                description: 'Đã có lỗi xảy ra!'
            });
        }

        form.resetFields();
        setIsModalOpen(false);

    };

    return (
        <>
            <Modal
                title="Thông tin hẹn"
                open={isModalOpen}
                footer={null}
                onCancel={() => setIsModalOpen(false)}
                maskClosable={false}
                width={"40vw"}
            >
                <div style={{ minHeight: 300 }}>
                    <Row>
                        <Col sm={24} md={24}>
                            <Form
                                onFinish={onFinish}
                                form={form}
                            >
                                <Form.Item
                                    hidden
                                    labelCol={{ span: 24 }}
                                    label="Id"
                                    name="id"
                                >
                                    <Input disabled hidden />
                                </Form.Item>

                                <Form.Item
                                    labelCol={{ span: 24 }}
                                    label="Email"
                                    name="email"
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    labelCol={{ span: 24 }}
                                    label="Tên sự kiện"
                                    name="name"
                                    rules={[{ required: true, message: 'Tên hiển thị không được để trống!' }]}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    labelCol={{ span: 24 }}
                                    label="Số điện thoại"
                                    name="phone"
                                    rules={[{ required: true, message: 'Số điện thoại không được để trống!' }]}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    labelCol={{ span: 24 }}
                                    label="Mô tả "
                                    name="description"
                                >
                                    <Input.TextArea rows={4} />
                                </Form.Item>
                                <Row gutter={16} justify="end">
                                    <Col span={7}>
                                        <Form.Item
                                            labelCol={{ span: 24 }}
                                            label="Thời gian"
                                            name="time"
                                            rules={[{ required: true, message: 'Vui lòng chọn ngày và thời gian bắt đầu!' }]}
                                        >
                                            <DatePicker
                                                format={FORMAT_DATE_DISPLAY}
                                                showTime={{ format: 'HH:mm' }}
                                                disabledDate={isBusyDate} // Chỉ disable ngày bận
                                                disabledTime={disabledTime} // Disable giờ bận và phút bận
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row justify="end">
                                    <Col>
                                        <Button type="primary" loading={isSubmit} onClick={() => form.submit()}>
                                            Đặt lịch
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                        </Col>
                    </Row>
                </div>
            </Modal>
        </>
    );
}

export default SchedulePopup;