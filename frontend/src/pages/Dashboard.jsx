import {
    useEffect,
    useState,
    useRef
} from "react";

import axios from "axios";
import { useNavigate } from "react-router-dom";

import SockJS from "sockjs-client/dist/sockjs";
import { Client } from "@stomp/stompjs";

function Dashboard() {

    const navigate = useNavigate();

    const [user, setUser] = useState(null);

    // CHAT STATE

    const [message, setMessage] = useState("");

    const [messages, setMessages] = useState([]);

    // TYPING STATE

    const [typingUser, setTypingUser] =
        useState("");

    // ONLINE USERS STATE

    const [onlineUsers, setOnlineUsers] =
        useState([]);

    // STOMP CLIENT

    const [stompClient, setStompClient] =
        useState(null);

    const [notification, setNotification] =
        useState("");

    // AUTO SCROLL REF

    const messagesEndRef = useRef(null);

    useEffect(() => {

        const token = localStorage.getItem("token");

        if (!token) {

            navigate("/login");

            return;
        }

        axios.get(
            "http://localhost:8080/api/user/profile",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        .then((response) => {

            setUser(response.data);
        })
        .catch(() => {

            localStorage.removeItem("token");

            navigate("/login");
        });

        // WEBSOCKET

        const socket =
            new SockJS("http://localhost:8080/ws");

        const client = new Client({

            webSocketFactory: () => socket,

            onConnect: () => {

                console.log("WebSocket connected!");

                // NOTIFICATION

                client.subscribe(
                    "/topic/notifications",
                    (message) => {

                        setNotification(message.body);
                    }
                );

                // CHAT

                client.subscribe(
                    "/topic/messages",
                    (message) => {

                        const chatMessage =
                            JSON.parse(message.body);

                        setMessages((prev) => [
                            ...prev,
                            chatMessage
                        ]);
                    }
                );

                // TYPING

                client.subscribe(
                    "/topic/typing",
                    (message) => {

                        const typingData =
                            JSON.parse(message.body);

                        setTypingUser(
                            typingData.username
                        );

                        setTimeout(() => {

                            setTypingUser("");

                        }, 1000);
                    }
                );

                // ONLINE USERS

                client.subscribe(
                    "/topic/online",
                    (message) => {

                        const onlineData =
                            JSON.parse(message.body);

                        setOnlineUsers((prev) => {

                            if (
                                prev.includes(
                                    onlineData.username
                                )
                            ) {

                                return prev;
                            }

                            return [
                                ...prev,
                                onlineData.username
                            ];
                        });
                    }
                );
            }
        });

        client.activate();

        setStompClient(client);

    }, []);

    // AUTO SCROLL

    useEffect(() => {

        messagesEndRef.current?.scrollIntoView({

            behavior: "smooth"
        });

    }, [messages]);

    // SEND MESSAGE

    const sendMessage = () => {

        if (!message.trim()) {
            return;
        }

        if (!stompClient) {
            return;
        }

        stompClient.publish({

            destination: "/app/chat",

            body: JSON.stringify({

                sender: user.username,

                content: message,

                time:
                    new Date()
                        .toLocaleTimeString()
            })
        });

        setMessage("");
    };

    const handleLogout = () => {

        localStorage.removeItem("token");

        navigate("/login");
    };

    if (!user) {

        return <h1>Loading...</h1>;
    }

    return (

        <div
            style={{

                textAlign: "center",

                marginTop: "40px",

                minHeight: "100vh",

                backgroundColor: "#f3f4f6",

                padding: "30px",

                color: "#1f2937"
            }}
        >

            <h1>Dashboard</h1>

            <h2>
                Welcome {user.username}
            </h2>

            <h3>Email: {user.email}</h3>

            <h3>ID: {user.id}</h3>

            <h2>{notification}</h2>

            {/* FLEX LAYOUT */}

            <div
                style={{

                    display: "flex",

                    justifyContent: "center",

                    alignItems: "flex-start",

                    gap: "30px",

                    marginTop: "40px"
                }}
            >

                {/* ONLINE USERS */}

                <div
                    style={{

                        width: "200px",

                        backgroundColor: "#fafafa",

                        borderRadius: "15px",

                        padding: "20px",

                        boxShadow:
                            "0 0 10px rgba(0,0,0,0.1)"
                    }}
                >

                    <h3>Online Users</h3>

                    {onlineUsers.map((onlineUser, index) => (

                        <div
                            key={index}

                            style={{

                                display: "flex",

                                alignItems: "center",

                                gap: "10px",

                                marginBottom: "15px"
                            }}
                        >

                            {/* AVATAR */}

                            <div
                                style={{

                                    width: "40px",

                                    height: "40px",

                                    borderRadius: "50%",

                                    backgroundColor: "#6366f1",

                                    color: "white",

                                    display: "flex",

                                    alignItems: "center",

                                    justifyContent: "center",

                                    fontWeight: "bold",

                                    position: "relative"
                                }}
                            >

                                {onlineUser
                                    .charAt(0)
                                    .toUpperCase()}

                                {/* ONLINE DOT */}

                                <div
                                    style={{

                                        width: "10px",

                                        height: "10px",

                                        borderRadius: "50%",

                                        backgroundColor: "#22c55e",

                                        position: "absolute",

                                        bottom: "0",

                                        right: "0",

                                        border:
                                            "2px solid white"
                                    }}
                                ></div>

                            </div>

                            {/* USERNAME */}

                            <div
                                style={{
                                    fontWeight: "500"
                                }}
                            >

                                {onlineUser}

                            </div>

                        </div>
                    ))}

                </div>

                {/* CHAT UI */}

                <div
                    style={{

                        width: "500px",

                        backgroundColor: "#fafafa",

                        borderRadius: "15px",

                        padding: "20px",

                        boxShadow:
                            "0 0 10px rgba(0,0,0,0.1)"
                    }}
                >

                    <h2>Realtime Chat</h2>

                    {/* MESSAGE AREA */}

                    <div
                        style={{

                            marginTop: "20px",

                            height: "400px",

                            overflowY: "auto",

                            padding: "10px",

                            border:
                                "1px solid #ddd",

                            borderRadius: "10px",

                            backgroundColor:
                                "#f9fafb"
                        }}
                    >

                        {typingUser && (

                            <p>

                                {typingUser}
                                {" "}is typing...

                            </p>
                        )}

                        {messages.map((msg, index) => {

                            const isMe =
                                msg.sender ===
                                user.username;

                            return (

                                <div
                                    key={index}

                                    style={{
                                        marginBottom:
                                            "15px",

                                        textAlign:
                                            isMe
                                                ? "right"
                                                : "left",

                                        paddingRight:
                                            isMe
                                                ? "1cm"
                                                : "0",

                                        paddingLeft:
                                            !isMe
                                                ? "1cm"
                                                : "0"
                                    }}
                                >

                                    <div
                                        style={{

                                            display:
                                                "inline-block",

                                            backgroundColor:
                                                isMe
                                                    ? "#6366f1"
                                                    : "#e5e7eb",

                                            color:
                                                isMe
                                                    ? "#ffffff"
                                                    : "#111827",

                                            padding:
                                                "10px 15px",

                                            borderRadius:
                                                "18px",

                                            maxWidth:
                                                "300px",

                                            wordBreak:
                                                "break-word"
                                        }}
                                    >

                                        <div
                                            style={{
                                                fontWeight:
                                                    "bold",

                                                marginBottom:
                                                    "5px"
                                            }}
                                        >

                                            {isMe
                                                ? "Me"
                                                : msg.sender}

                                        </div>

                                        <div>

                                            {msg.content}

                                        </div>

                                    </div>

                                    <div
                                        style={{
                                            fontSize:
                                                "12px",

                                            color:
                                                "gray"
                                        }}
                                    >
                                        {msg.time}
                                    </div>

                                </div>
                            );
                        })}

                        <div
                            ref={messagesEndRef}
                        ></div>

                    </div>

                    {/* INPUT BAR */}

                    <div
                        style={{

                            display: "flex",

                            gap: "10px",

                            marginTop: "20px"
                        }}
                    >

                        <input
                            type="text"

                            value={message}

                            onChange={(e) => {

                                setMessage(
                                    e.target.value
                                );

                                // SEND TYPING

                                if (
                                    stompClient &&
                                    user
                                ) {

                                    stompClient.publish({

                                        destination:
                                            "/app/typing",

                                        body:
                                            JSON.stringify({

                                                username:
                                                    user.username
                                            })
                                    });
                                }
                            }}

                            onKeyDown={(e) => {

                                if (
                                    e.key === "Enter"
                                ) {

                                    sendMessage();
                                }
                            }}

                            placeholder="Type message..."

                            style={{

                                flex: 1,

                                padding:
                                    "12px",

                                borderRadius:
                                    "10px",

                                border:
                                    "1px solid #d1d5db",

                                outline:
                                    "none",

                                fontSize:
                                    "15px"
                            }}
                        />

                        <button
                            onClick={sendMessage}

                            style={{

                                backgroundColor:
                                    "#6366f1",

                                color: "white",

                                border: "none",

                                borderRadius:
                                    "10px",

                                padding:
                                    "0 20px",

                                cursor:
                                    "pointer",

                                fontWeight:
                                    "bold"
                            }}
                        >
                            Send
                        </button>

                    </div>

                </div>

            </div>

            <br />

            <button
                onClick={handleLogout}

                style={{

                    backgroundColor:
                        "#ef4444",

                    color: "white",

                    border: "none",

                    borderRadius: "10px",

                    padding:
                        "10px 20px",

                    cursor: "pointer",

                    fontWeight: "bold"
                }}
            >
                Logout
            </button>

        </div>
    );
}

export default Dashboard;