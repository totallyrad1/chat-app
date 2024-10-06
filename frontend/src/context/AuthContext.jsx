import { createContext, useState, useCallback, useEffect} from "react";
import { baseUrl, postRequest } from "../utils/services";

export const AuthContext = createContext();

export const AuthContextProvider = ({children}) =>{
    const [user, setUser] = useState(null);
    const [registerError, setregisterError] = useState(null);
    const [loginError, setloginError] = useState(null);
    const [isregsiterLoading, setisregsiterLoading] = useState(false);
    const [isloginLoading, setisloginLoading] = useState(false);
    const [registerInfo, setregisterInfo] = useState({name: "", email: "", password: ""});
    const [loginInfo, setloginInfo] = useState({email: "", password: ""});
    const [settingsInput, setSettingsInput] = useState({email: "", password: "", newpassword: "", newname: "", avatarLink: ""});
    const [settingsError, setSettingsError] = useState(null);
    const [isSettingLoading, setIsSettingsLoading] = useState(false);
    const [settingUpdated, setSettingUpdated] = useState(false);

    useEffect(()=>{
        setSettingsInput({...settingsInput, email: user?.email});
    }, [user]);

    useEffect(()=>{
        const suser = localStorage.getItem("User");

        setUser(JSON.parse(suser));
    }, []);

    const updateRegisterInfo = useCallback((info) => {
        setregisterInfo(info);
    }, []);

    const updateLoginInfo = useCallback((info) => {
        setloginInfo(info);
    }, []);


    const loginUser = useCallback(async(e)=>{
        e.preventDefault();
        setloginError(null);
        setisloginLoading(true);
        const response = await postRequest(`${baseUrl}/users/login`, JSON.stringify(loginInfo));
        setisloginLoading(false);

        if(response.error){
            return setloginError(response);
        }
        localStorage.setItem("User", JSON.stringify(response));
        setUser(response);
    }, [loginInfo]);

    const registerUser = useCallback(async(e)=>{
        e.preventDefault();
        setisregsiterLoading(true);
        setregisterError(null);
        
        const response = await postRequest(`${baseUrl}/users/register`, JSON.stringify(registerInfo));

        setisregsiterLoading(false);

        if(response.error){
            return setregisterError(response);
        }

        localStorage.setItem("User", JSON.stringify(response));
        setUser(response);
    }, [registerInfo]);

    const logoutUser = useCallback(()=>{
        localStorage.removeItem("User");
        setUser(null);
        updateRegisterInfo({name: "", email: "", password: ""});
        updateLoginInfo({email: "", password: ""});
    }, []);

    const updateUserInfo = useCallback(async (e, payload)=>{
        e.preventDefault();
        setIsSettingsLoading(true);
        setSettingsError(null);
        const response = await postRequest(`${baseUrl}/users/update`, JSON.stringify(payload));
        setIsSettingsLoading(false);
        if(response.error){
            return setSettingsError(response);
        }
        const updatedIntervalId = setInterval(()=>{
            setSettingUpdated(false);
        }, 5000);
        localStorage.setItem("User", JSON.stringify(response));
        setUser(response);
        setSettingUpdated(true);

        return ()=>{
            clearInterval(updatedIntervalId);
        }
    }, []);

    return (
    <AuthContext.Provider value={{user, 
        registerInfo, 
        updateRegisterInfo, 
        registerUser, 
        isregsiterLoading, 
        registerError, 
        logoutUser, 
        updateLoginInfo,
        loginError,
        isloginLoading,
        loginUser,
        loginInfo,
        setSettingsInput,
        settingsInput,
        settingsError,
        isSettingLoading,
        settingUpdated,
        updateUserInfo}}>
        {children}
    </AuthContext.Provider>)
}