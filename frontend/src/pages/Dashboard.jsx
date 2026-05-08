import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import SockJS from "sockjs-client/dist/sockjs";
import { Client } from "@stomp/stompjs";

function Dashboard() {

    const navigate = useNavigate();

    const [user, setUser] = useState(null);

    const [notification, setNotification] = useState("");

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

                client.subscribe(
                    "/topic/notifications",
                    (message) => {

                        setNotification(message.body);
                    }
                );
            }
        });

        client.activate();

    }, []);

    const handleLogout = () => {

        localStorage.removeItem("token");

        navigate("/login");
    };

    if (!user) {

        return <h1>Loading...</h1>;
    }

    return (

        <div style={{ textAlign: "center", marginTop: "100px" }}>

            <h1>Dashboard</h1>

            <h2>Welcome {user.username}</h2>

            <h3>Email: {user.email}</h3>

            <h3>ID: {user.id}</h3>

            <h2>{notification}</h2>

            <button onClick={handleLogout}>
                Logout
            </button>

        </div>
    );
}

export default Dashboard;