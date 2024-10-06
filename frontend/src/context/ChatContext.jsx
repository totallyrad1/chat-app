import { createContext, useState, useCallback, useEffect, Children} from "react";
import { baseUrl, postRequest, getRequest } from "../utils/services";
import {io} from "socket.io-client"
import { useLinkClickHandler } from "react-router-dom";

export const ChatContext = createContext();

export const ChatContextProvider = ({children, user}) => {
    const [userChats, setUserChats] = useState(null);
    const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
    const [userChatsError, setUserChatsError ] = useState(null);
    const [potentialChats, setPotentialChats] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [isUserMessagesLoading, setIsUserMessagesLoading] = useState(false);
    const [userMessagesError, setUserMessagesError ] = useState(null);
    const [messages, setMessages] = useState(null);
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [newMessage, setNewMessage] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [allUsers, setAllUsers] = useState([]);

    useEffect(()=>{
        const newSocket = io("http://10.12.6.11:3000");
        setSocket(newSocket);

        return ()=>{
            newSocket.disconnect();
        }
    }, [user]);

    useEffect(()=>{
        if(socket === null)
            return;
        socket.emit("addNewUser", user?._id);

        socket.on("getOnlineUsers", (res)=>{
            setOnlineUsers(res);
        });

        return ()=> {
            socket.off("getOnlineUsers");
        };
    }, [socket, currentChat]);

    //send message
    useEffect(()=>{
        if(socket === null)
            return;

        const recipientId = currentChat?.members?.find((id)=> id !== user?._id);
        socket.emit("newMessage", {...newMessage, recipientId});
    }, [newMessage]);

    //recieve message
    useEffect(()=>{
        if(socket === null)
            return;

        socket.on("getMessage", (message) =>{
            if(currentChat?._id !== message.chatId)
                return;
            setMessages((prev)=> [...prev, message])
        });

        socket.on("getNotification", (res) =>{
            const isChatOpen = currentChat?.members.some(id => id === res?.senderId);
            if(isChatOpen){
                setNotifications(prev => [{...res, isRead: true}, ...prev]); 
            }else{
                setNotifications(prev => [res, ...prev]);
            }
        });

        return ()=>{
            socket.off("getMessage");
            socket.off("getNotification");
        }
    }, [socket, currentChat]);

    useEffect(()=>{
        const getUsers = async() => {
            const response = await getRequest(`${baseUrl}/users/`);
            if(response.error){
                return console.log("Error fetching users", response);
            }

            const pChats = response.filter((u)=> {
                let isChatCreated = false;

                if(user?._id === u?._id)
                    return false;

                if(userChats){
                    isChatCreated = userChats?.some((chat)=> {
                        return chat.members[0] === u._id || chat.members[1] === u._id;
                    })
                }

                return !isChatCreated;
            });
            setPotentialChats(pChats);
            setAllUsers(response);
        };

        getUsers();
    }, [userChats]);

    useEffect(()=>{
        const getUserChats = async()=>{
            if(user?._id){
                setIsUserChatsLoading(true);
                setUserChatsError(null);

                const response = await getRequest(`${baseUrl}/chats/${user?._id}`);

                setIsUserChatsLoading(false);
                if(response?.error){
                    return setUserChatsError(response);
                }
                setUserChats(response);
            }
        };

        getUserChats();
    }, [user, notifications]);

    useEffect(()=>{
        const getMessages = async() =>{
            setIsUserMessagesLoading(true);
            setUserMessagesError(null);

            const response = await getRequest(`${baseUrl}/messages/${currentChat?._id}`)

            setIsUserMessagesLoading(false);

            if(response?.error){
                return setUserMessagesError(response);
            }

            setMessages(response);
        };

        getMessages();
    }, [currentChat]);

    const sendTextMessage = useCallback( async (textMessage, sender, currentChatId, setTextMessage)=>{
        
        setUserMessagesError(null);
        if(!textMessage)
            return console.log("you must type something...");

        const  response = await postRequest(
            `${baseUrl}/messages`,
            JSON.stringify({
                chatId: currentChatId,
                senderId: sender._id,
                text: textMessage,
            }));

        if(response.error){
            return setUserMessagesError(response);
        }
        setMessages((prev) => [...prev, response]);
        setNewMessage(response);
        setTextMessage("");
    }, []);

    const updateCurrentChat = useCallback((chat) =>{
        setCurrentChat(chat);
    },[]);

    const createChat = useCallback(async (firstId, secondId)=>{
        const  response = await postRequest(
            `${baseUrl}/chats`,
            JSON.stringify({firstId, secondId}));
        if(response.error){
            return console.log("Error creating chat", response);
        }

        setUserChats((prev) => [...prev, response]);
    }, []);

    const markAllNotificationsAsRead = useCallback((notifications) => {
        const mNotifications = notifications.map(n => {return {...n, isRead: true}});

        setNotifications(mNotifications);
    },[])

    const markNotificationAsRead = useCallback((n, userChats, user, notifications)=>{
        const desiredChat = userChats.find((chat) =>{
            const chatMembers = [user?._id, n?.senderId];
            const isDesiredChat = chat?.members.every(member => {
                return chatMembers.includes(member);
            });
            return isDesiredChat;
        });

        const mNotifications = notifications.map(el => {
            if(n.senderId === el.senderId){
                return {...el, isRead: true};
            }else{
                return el;
            }
        });

        setNotifications(mNotifications);
        setCurrentChat(desiredChat);
    }, []);

    const markThisUserNotificationAsRead = useCallback((thisUserNotifications, notifs) =>{
        const mNotifications = notifs.map((el) =>{

            const notifMatched = thisUserNotifications.find(n => n.senderId === el.senderId);
            
            return notifMatched ? {...notifMatched, isRead:true} : {...el};
        });

        setNotifications(mNotifications);
    }, []);

    return (
    <ChatContext.Provider value={{
        userChats,
        isUserChatsLoading,
        userChatsError,
        potentialChats,
        createChat,
        updateCurrentChat,
        currentChat,
        messages,
        isUserMessagesLoading,
        userMessagesError,
        sendTextMessage,
        onlineUsers,
        notifications,
        allUsers,
        markAllNotificationsAsRead,
        markNotificationAsRead,
        markThisUserNotificationAsRead,
    }}>
        {children}
    </ChatContext.Provider>
    );
};