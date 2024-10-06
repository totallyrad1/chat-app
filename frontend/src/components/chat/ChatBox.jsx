import { useContext, useState , useEffect, useRef} from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { useFetchRecipient } from "../../hooks/useFetchRecipient";
import { Stack } from "react-bootstrap";
import InputEmoji from "react-input-emoji"
import moment from "moment"

const ChatBox = () => {
    const {user} = useContext(AuthContext);
    const {currentChat,
        messages,
        isUserMessagesLoading,
        userMessagesError,
        sendTextMessage,} = useContext(ChatContext);
    const {recipientUser} = useFetchRecipient(currentChat, user);
    const [textMessage, setTextMessage] = useState("");
    const scroll = useRef();

    useEffect(() => {
        scroll.current?.scrollIntoView({behavior: "smooth"});
    },[messages]);

    useEffect(()=>{
        setTextMessage("");
    }, [currentChat]);
    if(!recipientUser)
        return <p style={{textAlign: "center", width: "100%"}}>
            No conversation selected yet...
        </p>
    
    if(isUserMessagesLoading)
        return <p style={{textAlign: "center", width: "100%"}}>
            loading chat...
        </p>

    return ( 
        <Stack gap={4} className="chat-box">
            <div className="chat-header">
                <strong>{recipientUser?.name}</strong>
            </div>
            <Stack gap={3} className="messages">
                {messages && messages.map((message, index)=>{
                    return <Stack key={index} className={`${message?.senderId === user?._id 
                        ? "message self align-self-end flex-grow-0" 
                        : "message align-self-start flex-grow-0"}`}
                        ref={scroll}>
                        <span>{message.text}</span>
                        <span className="message-footer">{moment(message.createdAt).calendar()}</span>
                    </Stack>
                })}
            </Stack>
            <Stack direction="horizontal" gap={3} className="chat-input flex-grow-0">
                <InputEmoji value={textMessage} 
                onChange={setTextMessage} 
                fontFamily="Fredoka" 
                borderColor="rgba(72,112,223,0.2)"
                />
                <button className="send-btn" onClick={() => sendTextMessage(textMessage, user, currentChat._id, setTextMessage)}>
                <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" className="bi bi-send-fill" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.5004 12H5.00043M4.91577 12.2915L2.58085 19.2662C2.39742 19.8142 2.3057 20.0881 2.37152 20.2569C2.42868 20.4034 2.55144 20.5145 2.70292 20.5567C2.87736 20.6054 3.14083 20.4869 3.66776 20.2497L20.3792 12.7296C20.8936 12.4981 21.1507 12.3824 21.2302 12.2216C21.2993 12.082 21.2993 11.9181 21.2302 11.7784C21.1507 11.6177 20.8936 11.5019 20.3792 11.2705L3.66193 3.74776C3.13659 3.51135 2.87392 3.39315 2.69966 3.44164C2.54832 3.48375 2.42556 3.59454 2.36821 3.74078C2.30216 3.90917 2.3929 4.18255 2.57437 4.72931L4.91642 11.7856C4.94759 11.8795 4.96317 11.9264 4.96933 11.9744C4.97479 12.0171 4.97473 12.0602 4.96916 12.1028C4.96289 12.1508 4.94718 12.1977 4.91577 12.2915Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                </button>
            </Stack>
        </Stack> 
    );
}
 
export default ChatBox;