let progress = document.getElementById("progress")
let progressBar = document.getElementById("progressBar")
let message = document.getElementById("loading")
let imgDisplay= document.getElementById("showImg")
let imgAddr= document.getElementById("imgAddrtxt")
let imgText= document.getElementById("imgText")
let copyBtn= document.getElementById("copyBtn")
let readBtn= document.getElementById("readBtn")

imgAddr.addEventListener('input',()=>{
    if(imgAddr.value!==''&&imgAddr.value.substr(imgAddr.value.length-3).toLowerCase()!="svg"){
        progress.style.display = "none"
        readBtn.style.visibility="visible";
    }
    else{
        progress.style.display = "block"
        message.textContent="svg format not supported"
    } 
})

readBtn.addEventListener('click', () => {
    imgDisplay.src=imgAddr.value
    chrome.tabs.query({ active: true }, function (tabs) {
        let tab = tabs[0];

        const port = chrome.tabs.connect(tab.id, {
            name: "uiOps",
        });

        // Get input value
        port.postMessage({
            url:imgAddr.value
        });

        port.onMessage.addListener(function (msg) {
            if (msg.exists) {
                progressBar.style.display = "none"
                progress.style.display = "none"
                imgText.style.visibility = "visible"
                imgText.style.height="auto" 
                imgText.value=msg.exists
            }
            else if (msg.progress) {
                progress.style.display = "block"
                message.textContent="Loading..."
                if(msg.status=="recognizing text"){
                    progressBar.textContent = Math.ceil(msg.progress * 100) + '%'
                    progressBar.style.width = msg.progress * 100 + '%'
                    copyBtn.style.visibility="visible"
                    copyBtn.style.height="auto"
                }             
            }
            else if(msg.errorMsg){
                progress.style.display = "block"
                message.textContent="Images from other pages may be blocked due to security policy"
            }
        })
  })
})

copyBtn.addEventListener('click',()=>{   
  /* Select the text area */
  imgText.select();
  imgText.setSelectionRange(0, 99999); /* For mobile devices */

   /* Copy the text inside the text area */
  navigator.clipboard.writeText(imgText.value);

})


