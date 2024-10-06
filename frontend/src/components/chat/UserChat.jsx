import { Stack } from "react-bootstrap";
import avatar from "../../assets/avatar.svg"
import { useFetchRecipient } from "../../hooks/useFetchRecipient";
import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import { unreadNotificationsFunc } from "../../utils/unreadNotifications";
import { useFetchLatestMessage } from "../../hooks/useFetchLatestMessage";
import moment from "moment";

const UserChat = ({chat, user}) => {
    const {recipientUser, error} = useFetchRecipient(chat, user);
    const {onlineUsers, notifications, markThisUserNotificationAsRead} = useContext(ChatContext);


    const {latestMessage} = useFetchLatestMessage(chat);
    const unreadNotifications = unreadNotificationsFunc(notifications);
    const thisUserNotifications = unreadNotifications?.filter((n) =>{
        return n.senderId == recipientUser?._id;
    });
    const isOnline = onlineUsers?.some(user => user?.userId === recipientUser?._id);

    const shortLatestMsg = (text) =>{
        console.log(text.length);
        let shortMsg = text?.substring(0, 20);
        if(text.length > 20)
            shortMsg = shortMsg + "...";
        return shortMsg;
    };

    return (
    <Stack 
        direction="horizontal" 
        gap={3} 
        className="user-card align-items-center p-2 justify-content-between"
        role = "button"
        onClick={() => {
            if(thisUserNotifications?.length !== 0){
                markThisUserNotificationAsRead(thisUserNotifications, notifications);
            }
        }}
    >
        <div className="d-flex">
            <div className="me-2">
                <img src={recipientUser?.avatarLink ? recipientUser?.avatarLink: avatar} className="avatar" height={"35px"}></img>
            </div>
            <div className="text-content">
                <div className="name">{recipientUser?.name}</div>
                {latestMessage?.text && <div className="text">{shortLatestMsg(latestMessage?.text)}</div>}
            </div>
        </div>
        <div className="d-flex flex-column align-items-end">
            <div className="date">{moment(latestMessage?.createdAt).calendar()}</div>
            {thisUserNotifications?.length ? <div className="this-user-notifications">{thisUserNotifications?.length}</div> : null}
            {isOnline && <span className="user-online"></span>}
        </div>
    </Stack>);
}
 
export default UserChat;