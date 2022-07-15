const { createWorker } = Tesseract;


chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(function (msg) {
    if (port.name === "uiOps") {
      const imageUrl = msg.url
      let imgBase64
      chrome.runtime.sendMessage({ imgURL: imageUrl }, function (response) {
        imgBase64 = response.result
        if (imgBase64) {
          var Finaltext = ""
          try{
            const worker = createWorker({
              logger: m => {
                var prog = m.progress
                var prevprog = 0
                if (prog != prevprog) {
                  prevprog = prog
                  port.postMessage({
                    progress: prog,
                    status:m.status
                  });
  
                }
              }
            });
          
          

          (async () => {

            await worker.load();
            await worker.loadLanguage('eng');
            await worker.initialize('eng');
            const { data: { text } } = await worker.recognize(imgBase64);

            await worker.terminate();
            Finaltext = text
            port.postMessage({
              exists: Finaltext,
            });
          })();
        }
        catch(e){
          port.postMessage({
            errorMsg: e,
          });
        }

        }
        else {
          port.postMessage({
            exists: false,
          });
        }
      });

    }
  });
});