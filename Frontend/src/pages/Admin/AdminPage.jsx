import { Card, Col, Row, Statistic } from "antd";
import { useEffect, useState } from "react";
import CountUp from 'react-countup';

import { callFetchResume, callFetchUser } from "../../services/api";

const AdminPage = () => {
    const formatter = (value) => <CountUp end={value} separator="," />;

    const [countUser, setCountUser] = useState(0);
    const [countResume, setCountResume] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const fetchUser = async () => {
        setIsLoading(true);
        const res = await callFetchUser(0, 5, 'name,asc');
        if (res && res.data) {
            setCountUser(res.data.data.meta.total);
        }
        setIsLoading(false);
    }

    const fetchResume = async () => {
        setIsLoading(true);
        const res = await callFetchResume(0, 5, 'name,asc');
        if (res && res.data) {
            setCountResume(res.data.data.meta.total);
        }
        setIsLoading(false);
    }

    useEffect(() => {
        fetchUser();
        fetchResume();
    }, [])

    return (
        <>
            <Row gutter={16}>
                <Col span={12}>
                    <Card bordered={false} loading={isLoading}>
                        <Statistic title="Tổng giáo viên" value={countUser} formatter={formatter} />
                    </Card>
                </Col>
                <Col span={12}>
                    <Card bordered={false}>
                        <Statistic title="Tổng số hồ sơ" value={countResume} precision={2} formatter={formatter} />
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default AdminPage;