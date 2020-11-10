import React, {useState} from 'react'
import {Form, Input, Button, notification, Card} from 'antd'
import {useHistory, useLocation} from 'react-router-dom'
import {SmileOutlined, FrownOutlined} from '@ant-design/icons';
import {setToken, useAppContext} from "../../store";
import {parseErrorMessages} from "../../utils/forms";
import {axiosInstance} from "api";
import styled from 'styled-components';

const apiUrl = "/accounts/token/"


const Container = styled.div`
    display:grid;
    grid-template-columns:repeat(1, 1fr);
    gap:1rem;
	width:1024px;
	max-width:100%;
	margin:10px auto;
`;


export default function Login() {
    const {dispatch} = useAppContext()
    const location = useLocation()
    const history = useHistory()
    const [fieldErrors, setFieldErrors] = useState({})
    // const [jwtToken, setJwtToken] = useLocalStorage("jwtToken", "")
    const {from: loginRedirectUrl} = location.state || {
        from:
            {pathname: '/'}
    };


    const onFinish = (values) => {
        async function fn() {
            const {username, password} = values
            const data = {username, password}

            setFieldErrors({})

            try {
                const response = await axiosInstance.post(apiUrl, data)

                const {data: {token: jwtToken}} = response

                // setJwtToken(jwtToken)
                dispatch(setToken(jwtToken))
                notification.open({
                    message: "로그인 성공",
                    icon: <SmileOutlined style={{color: "#108ee9"}}/>
                })

                history.push(loginRedirectUrl)
            } catch (error) {
                if (error.response) {
                    notification.open({
                        message: "로그인 실패",
                        description: "아이디/암호를 확인해주세요.",
                        icon: <FrownOutlined style={{color: "#ff3333"}}/>
                    });

                    const {data: fieldsErrorMessages} = error.response;
                    setFieldErrors(
                        parseErrorMessages(fieldsErrorMessages)
                    );
                }
            }
        }

        fn(); //이부분 함수로 빼놨는지 설명좀 
    };

    const layout = {
        labelCol: {
            span: 8,
        },
        wrapperCol: {
            span: 16,
        },
    };

    const tailLayout = {
        wrapperCol: {
            offset: 8,
            span: 16,
        },
    };

    return (
        <Container>
            <Card title="로그인">
                <Form
                    {...layout}
                    onFinish={onFinish}
                    // onFinishFailed={onFinishFailed}
                >
                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your username!',
                            },
                            {
                                min: 5,
                                message: '5글자를 입력해주세요. ',
                            }
                        ]}
                        hasFeedback
                        {...fieldErrors.username}
                        {...fieldErrors.non_field_errors}
                    >
                        <Input/>
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your password!',
                            },
                        ]}
                        {...fieldErrors.password}
                    >
                        <Input.Password/>
                    </Form.Item>

                    <Form.Item {...tailLayout}>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </Container>
    )
}
