import {Alert, Button, Form, Row, Col, Stack} from 'react-bootstrap'
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';
const Register = () => {
    const {registerInfo, 
        updateRegisterInfo, 
        registerUser, 
        isregsiterLoading, 
        registerError} = useContext(AuthContext);

    return (
    <>
        <Form onSubmit={registerUser}>
            <Row style={
                {height: "100vh", 
                 justifyContent: "center", 
                 paddingTop: "20%"}
                }>
                <Col xs={6}>
                    <Stack gap={3}>
                        <h2>
                            Register Panel
                        </h2>
                        <Form.Control type="text" placeholder='name' onChange={(e) => updateRegisterInfo({...registerInfo,name: e.target.value})}/>
                        <Form.Control type="email" placeholder='Email' onChange={(e) => updateRegisterInfo({...registerInfo,email: e.target.value})} />
                        <Form.Control type="password" placeholder='password' onChange={(e) => updateRegisterInfo({...registerInfo,password: e.target.value})} />
                        <Button variant='primary' type="submit">
                            {isregsiterLoading ? "Creating your account..." : "Register"}
                        </Button>
                        {registerError?.error && <Alert variant='danger'><p>{registerError?.message}</p></Alert>}
                    </Stack>
                </Col>
            </Row>
        </Form>
    </>);
}
 
export default Register;