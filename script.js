let inputBox = document.querySelector("#prompt");
let chatcontainer = document.querySelector(".chat-container");
let submitBtn = document.querySelector("#submit");


const Api_Url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=use your api key " 
let user = {
    Data: null,
};
async function generateResponse(aichatBox) {
    let text = aichatBox.querySelector(".ai-chat-area");

    let RequestOption = {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [
                {
                    parts: [{ text: user.Data }]
                }
            ]
        })
    };

    try {
        let response = await fetch(Api_Url, RequestOption);
        let Data = await response.json();

        console.log(Data);

        if (Data.candidates && Data.candidates.length > 0) {
            let apiResponse = Data.candidates[0].content.parts[0].text;
            text.innerHTML = apiResponse;
        } else {
            text.innerHTML = "No response from AI";
        }

    } catch (error) {
        console.log(error);
        text.innerHTML = "Error occurred";
    } finally {
        chatcontainer.scrollTo({
            top: chatcontainer.scrollHeight,
            behavior: "smooth"
        });
    }
}

function creatChatBox(html, classes) {
    let div = document.createElement("div");
    div.innerHTML = html;
    div.classList.add(classes);
    return div;
}

function handlechatResponse(message) {
    user.Data = message;

    if (message.trim() === "") return;

    let html = `
    <img src="user.png" alt="" id="userImage" width="50"> 
    <div class="user-chat-area">
    ${user.Data}
    </div>`;

    inputBox.value = "";

    let userChatBox = creatChatBox(html, "user-chat-box");
    chatcontainer.appendChild(userChatBox);

    chatcontainer.scrollTo({
        top: chatcontainer.scrollHeight,
        behavior: "smooth"
    });

    setTimeout(() => {

        let aiHtml = `
        <img src="ai.png" alt="" id="aiImage" width="50">
        <div class="ai-chat-area">
        <img src="loading.gif" alt="" class="load" width="60px">
        </div>`;

        let aiChatBox = creatChatBox(aiHtml, "ai-chat-box");
        chatcontainer.appendChild(aiChatBox);

        generateResponse(aiChatBox);

    }, 600);
}
inputBox.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        handlechatResponse(inputBox.value);
    }
});


submitBtn.addEventListener("click", () => {
    handlechatResponse(inputBox.value);
});