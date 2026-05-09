// External libraries
import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// Internal
import { useToast } from '../use-toast';
import { ToastAction } from '../../components/ui/toast';

// web socket functionality - creates and closes connections 
// also intercepts incoming messages and display as a notification using a Toast through socket.onmessage
export const useWebSocket = () => {
    const navigate = useNavigate();
    const { toast } = useToast()
    const socketRef = useRef(null);

    const startWebSocket = () => {
        if (!socketRef.current) {
            const token = localStorage.getItem('accessToken');

            const socket = new WebSocket(`${import.meta.env.VITE_WS_URL}notifications/?token=${token}`);

            socketRef.current = socket;

            socket.onopen = () => {
                console.log('WebSocket connection established');
            };

            socket.onmessage = (event) => {
                const notification = JSON.parse(event.data).notification;
                toast({
                    title: notification.title,
                    duration: 4000,
                    action: <ToastAction
                        onClick={() => {
                            navigate(`/requests/${notification.service_request_id}`)
                        }}
                        altText="View Details">View</ToastAction>,
                });

            };

            socket.onclose = () => {
                console.log('WebSocket connection closed');
                socketRef.current = null;
            };

            socket.onerror = (error) => {
                console.error('WebSocket error:', error);
            };
        }
    };

    const closeWebSocket = () => {
        if (socketRef.current) {
            socketRef.current.close();
            socketRef.current = null;
        }
    };

    return { startWebSocket, closeWebSocket };
};
