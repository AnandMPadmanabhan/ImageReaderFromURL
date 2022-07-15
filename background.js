chrome.runtime.onMessage.addListener(callback);
function callback(obj, sender, sendResponse) {

    if (obj) {
        const imageUrl = obj.imgURL;
        
        let imageBuffer
        (async () => {
          const response = await fetch(imageUrl,{mode: 'cors'})
          const imageBlob = await response.blob()
          const reader = new FileReader();
          reader.readAsDataURL(imageBlob);
          
          reader.onloadend = () => {
            const base64data = reader.result;
            //console.log("Image--------"+base64data);
            imageBuffer =base64data
            sendResponse({result: imageBuffer});
          }
        })()
    }
    
    return true;
}

