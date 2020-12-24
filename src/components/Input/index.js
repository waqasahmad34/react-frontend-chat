import React, { useRef } from 'react';

import './Input.css';

const Input = ({ messageTyping, sendMessage, message, attachFile }) => {
  const imageRef = useRef();
  const attachFileBtn = (e) => {
    e.preventDefault();
    imageRef.current.click();
}
  return (
    <form className="form">
      <input
        className="input"
        type="text"
        placeholder="Type a message..."
        value={message}
        onChange={({ target: { value } }) => messageTyping(value)}
        onKeyPress={event => event.key === 'Enter' ? sendMessage(event) : null }
      />
      <input type="file" hidden id="file" name="file" accept="image/*" ref={imageRef} onChange={(e)=> attachFile(e)}/>
      <button className="sendButton" onClick={e => sendMessage(e)}>Send</button>
      <button className="sendButton" onClick={(e)=> attachFileBtn(e)}>Attach</button>
    </form>
  )
}

export default Input;