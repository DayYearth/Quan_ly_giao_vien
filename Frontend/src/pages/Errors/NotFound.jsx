import { Button, Result } from 'antd';
import { Link } from 'react-router-dom';
const NotFound = () => {

    return (
        <Result
            status="404"
            title="404"
            subTitle="Xin lỗi, trang bạn truy cập không tồn tạitại."
            extra={<Button type="primary"><Link to="/" >Back Home</Link></Button>}
        />
    )
}

export default NotFound;