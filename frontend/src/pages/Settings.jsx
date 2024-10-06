import { useContext } from 'react';
import {Alert, Button, Form, Row, Col, Stack} from 'react-bootstrap'
import { AuthContext } from '../context/AuthContext';

const Settings = () => {
    const {user, 
        setSettingsInput, 
        settingsInput,
        settingsError,
        isSettingLoading,
        settingUpdated,updateUserInfo} = useContext(AuthContext);


    return (
        <>
            <Form onSubmit={(e) => updateUserInfo(e, settingsInput)}>
                <Row style={
                    {height: "100vh", 
                     justifyContent: "center", 
                     paddingTop: "20%"}
                    }>
                    <Col xs={6}>
                        <Stack gap={3}>
                            <h2>
                                Change user profile
                            </h2>
                            <Form.Control  type="link" placeholder='avatarlink' onChange={(e) => setSettingsInput({...settingsInput, avatarLink: e.target.value})}/>
                            <Form.Control  type="text" placeholder='change username?' onChange={(e) => setSettingsInput({...settingsInput, newname: e.target.value})}/>
                            <Form.Control  type="email" value={user.email} placeholder='Email' disabled={true}/>
                            <Form.Control  type="password" placeholder='new password' onChange={(e) => setSettingsInput({...settingsInput, newpassword: e.target.value})}/>
                            <Form.Control  type="password" required placeholder='password' onChange={(e) => setSettingsInput({...settingsInput, password: e.target.value})}/>
                            <Button  variant='primary' type="submit">
                                {isSettingLoading ? "processing ur request..." : "apply changes"}
                            </Button>
                            {settingsError?.error && <Alert variant='danger'><p>{settingsError?.message}</p></Alert>}
                            {!settingsError && settingUpdated && <Alert variant='success'><p>changes applied succesfully!</p></Alert>}
                        </Stack>
                    </Col>
                </Row>
            </Form>
        </>);
}
 
export default Settings;