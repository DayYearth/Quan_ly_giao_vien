import { Row, Col } from "antd";
import { Outlet } from "react-router-dom";

const ScheduleTable = () => {

    return (
        <>
            <Row gutter={[20, 20]}>
                <Col span={24}>
                    <Outlet />
                </Col>
            </Row>
        </>
    );
}

export default ScheduleTable;