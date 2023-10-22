document.addEventListener("DOMContentLoaded", () => {
  const socket = io();
  const joinButton = document.getElementById("joinButton");
  const nameInput = document.getElementById("nameInput");
  const chatContainer = document.getElementById("chatContainer");
  const messageInput = document.getElementById("messageInput");
  const sendButton = document.getElementById("sendButton");
  const messages = document.getElementById("messages");

  joinButton.addEventListener("click", () => {
    const name = nameInput.value;
    if (name) {
      socket.emit("new-user-joined", name);
      nameInput.disabled = true;
      joinButton.disabled = true;
      chatContainer.style.display = "block";
      joinButton.style.display = "none"; //to Hide the join button

      messageInput.style.display = "inline";
      sendButton.style.display = "inline";
    }
  });

  sendButton.addEventListener("click", () => {
    const message = messageInput.value;
    if (message) {
      socket.emit("send", message);
      appendMessage({ text: message, isUser: true });
      messageInput.value = "";
    }
  });

  socket.on("user-joined", (name) => {
    appendMessage({ text: `${name} joined the chat`, isUser: false });
  });

  socket.on("receive", (data) => {
    appendMessage({ text: `${data.name}: ${data.message}`, isUser: false });
    var audio = document.getElementById("messageSound");
    audio.play();
  });

  socket.on("left", (name) => {
    appendMessage({ text: `${name} left the chat`, isUser: false });
  });

  function appendMessage(messageData) {
    const messageElement = document.createElement("div");
    messageElement.textContent = messageData.text;
    if (messageData.isUser) {
      messageElement.classList.add("user-message");
    } else {
      messageElement.classList.add("other-message");
    }
    messages.appendChild(messageElement);
  }
});
