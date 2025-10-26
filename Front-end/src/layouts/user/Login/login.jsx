import "./Login.css"
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, message, Spin } from 'antd';
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';
import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";

function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const stateData = location.state;

    const { dispatch } = useAuth();

    const [messageApi, contextHolder] = message.useMessage();
    const [spinning, setSpinning] = useState(false);

    const successMessage = () => {
        messageApi.open({
            key: 'login',
            type: 'success',
            content: 'Đăng nhập thành công',
        });
    };

    const errorMessage = () => {
        messageApi.open({
            key: 'login',
            type: 'error',
            content: 'Tên đăng nhập hoặc mật khẩu không chính xác',
        });
    };

    const onFinish = (values) => {
        setSpinning(true);
        
        axios.post(`http://localhost:5000/api/auth/login`, {
            username: values.username,
            password: values.password
        }, {
            withCredentials: true
        })
        .then(response => {
            if (response.data && response.data.user) {
                dispatch({ type: 'AUTH_SUCCESS', payload: response.data.user });
                
                successMessage();
                
                setTimeout(() => {
                    setSpinning(false);
                    if(stateData?.action === "redirect"){
                        navigate(stateData.url);
                    } else {
                        navigate("/");
                    }
                }, 1000);
            } else {
                errorMessage();
                setSpinning(false);
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            errorMessage();
            setSpinning(false);
        });
    };

    return (
        <div className="Login">
            {contextHolder}
            <Spin spinning={spinning} fullscreen />
            <Form
                name="reflow_login"
                className="login-form"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                style={{ width: 350 }}
            >
                <Form.Item >
                    <h1 style={{textAlign: "center", fontSize: "20px"}}>ĐĂNG NHẬP</h1>
                </Form.Item>
                <Form.Item
                    name="username"
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập tên đăng nhập!',
                        },
                    ]}
                    initialValue={stateData?.username}
                >
                    <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Tên đăng nhập" size="large" allowClear />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập mật khẩu!',
                        },
                    ]}
                    initialValue={stateData?.password}
                >
                    <Input.Password
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        type="password"
                        placeholder="Mật khẩu"
                        size="large"
                        allowClear
                    />
                </Form.Item>
                <Form.Item>
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox>Ghi nhớ đăng nhập</Checkbox>
                    </Form.Item>

                    <Link className="login-form-forgot" to="/forgot-password">
                        Quên mật khẩu
                    </Link>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button" size="large" style={{ width: "100%" }}>
                        Đăng nhập
                    </Button>
                </Form.Item>
                <Form.Item>
                    Chưa có tài khoản? <Link to="/register">Đăng ký!</Link>
                </Form.Item>
            </Form>
        </div>
    );
}

export default Login;