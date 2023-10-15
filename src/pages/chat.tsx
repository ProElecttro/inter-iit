import { useState, ChangeEvent } from "react";
import styles from "./styles/chat.module.css";
import { HiOutlineUserGroup } from "react-icons/hi";
import { AiOutlineUserAdd } from "react-icons/ai";
import { IoNotificationsOutline } from "react-icons/io5";
import { IoIosSend } from "react-icons/io";
import { CgProfile } from "react-icons/cg";

import signIn from "./signIn";

const Chat = () => {
  const initialMessage = {
    message: "",
  };
  const [message, setMessage] = useState(initialMessage);
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMessage({ message: value });
    console.log(message);
  };

  const handleSend = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    try {
      const messageToSend = message;

      const response = await fetch("http://localhost:3000/", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messageToSend),
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.result);
      } else {
        const errorData = await response.json();
        if (errorData.error) {
          alert(errorData.error);
        } else {
          alert("An unexpected error occurred. Please try again later.");
        }
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("A network error occurred. Please check your internet connection.");
    }
  };

  const SignIn = () => {
    // open the signin page
  }

  return (
    <>
      <h2 className={styles.title}>MystiChat: Unveil Your Words</h2>
      <div id={styles.chatbox}>
        <div id={styles.contactSection}>
          <div id={styles.contactsBar}>
            <CgProfile className={styles.icons} onClick={SignIn}/>
            <AiOutlineUserAdd className={styles.icons} />
            <HiOutlineUserGroup className={styles.icons} />
            <IoNotificationsOutline className={styles.icons} />
          </div>
        </div>
        <div id={styles.chatSection}>
          <div className={styles.searchBar}>
            <input
              type="text"
              onChange={handleInputChange}
              className={styles.search}
              placeholder="Enter your message..."
            />
            <button className={styles.button} onClick={handleSend}>
              <IoIosSend className={styles.icons} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
