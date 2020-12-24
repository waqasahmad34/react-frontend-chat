import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';
import axios from 'axios';
import InfoBar from '../InfoBar';
import Input from '../Input';
import Messages from '../Messages';
import TextContainer from '../TextContainer';
import './Chat.css';

let socket;
const Chat = ({ location }) => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState('');
    const [typing, setTyping] = useState('');
    const ENDPOINT = 'https://node-backend-chat.herokuapp.com/';
    // const ENDPOINT = 'localhost:5000';
    useEffect(()=> {
        const { name, room } = queryString.parse(location.search);
        socket = io(ENDPOINT);
        setName(name);
        setRoom(room);
        socket.emit('join', {name, room}, (error)=> {
            if(error) {
                alert(error);
            }
        });
        return () => {
            socket.emit('disconnect');
            socket.off();
        }
    }, [ENDPOINT, location.search]);

    useEffect(()=> {
        socket.on('message', (message)=> {
            setMessages([...messages, message])
        });

        socket.on("roomData", ({ users }) => {
            setUsers(users);
        });

        socket.on('userTyping', ({text}) => {
            setTyping(text);
        });

        return () => {
            socket.off()
        }
    }, [messages, typing]);

    const sendMessage = (event) => {
        event.preventDefault();
        if(message){
            socket.emit('sendMessage', message, ()=> setMessage(''));
            socket.emit('clearTyping', { name, room }, ()=> {});
        }

    }

    const attachFile = (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('file',event.target.files[0]);

        axios.post('https://node-backend-chat.herokuapp.com/upload', formData)
        .then(response=> {
            const { msg, url } = response.data;
            if(msg === 'success'){
                socket.emit('sendMessage', url, ()=> setMessage(''));
            }

        })
        .catch(error=> {
            console.log('error: --', error);
        })
        

    }

    const messageTyping = (value) => {
        setMessage(value);
        if(value){
            socket.emit('typing', { name, room }, ()=> {});
        }else {
            socket.emit('clearTyping', { name, room }, ()=> {});
        }
    }

    return (
       <div className="outerContainer">
           <div className="container">
                <InfoBar room={room} typing={typing}/>
                <Messages messages={messages} name={name}/>
                <Input sendMessage={sendMessage} attachFile={attachFile} message={message} setMessage={setMessage} messageTyping={messageTyping}/>
           </div>
           <TextContainer users={users}/>
       </div>
    )
}

export default Chat;
