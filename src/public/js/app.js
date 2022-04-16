const messageList = document.querySelector("ul");
const nickForm = document.querySelector("#nick");
const messageForm = document.querySelector("#message");
const socket = new WebSocket(`ws://${window.location.host}`);

const makeMessage = (type, payload) => {
    const msg = { type, payload };
    return JSON.stringify(msg)
}

socket.addEventListener("open", () => {
    console.log("연결됨")
})

socket.addEventListener("message", (message) =>{
    const li = document.createElement("li")
    li.innerText = message.data
    messageList.append(li)
    console.log(`message from serverㅣ${message.data}`)
})

socket.addEventListener("close", () => {
    console.log("연결 끊김!")
})

/*setTimeout(() => {
    socket.send("message from browser!")
}, 10000);*/

function handleSubmit(event){
    event.preventDefault()
    const input = messageForm.querySelector("input");
    socket.send(makeMessage("new_message", input.value))
    console.log(makeMessage("new_message", input.value))
    input.value = ""
}

function handleNickSubmit(event) {
    event.preventDefault();
    const input = nickForm.querySelector("input");
    socket.send(makeMessage("nickname", input.value));
    input.value = ""
    nickForm.classList.add("diedEle")
}

messageForm.addEventListener("submit", handleSubmit)
nickForm.addEventListener("submit", handleNickSubmit);