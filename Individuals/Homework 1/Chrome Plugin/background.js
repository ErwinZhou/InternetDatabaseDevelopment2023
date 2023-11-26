
chrome.runtime.onInstalled.addListener(async () => {
    /*
    * When Chrome is installed or running(not on My HomePage)
    * It will set on "OFF" 
    */
    
   // Get all tabs that the user has open
    tabs = await chrome.tabs.query({active: true, currentWindow: true})
	// If the current tab is not HomePage, set the badge to "OFF"
    if(!tabs[0].url.includes("https://github.com/ErwinZhou")){
        chrome.action.setBadgeText({ "text": "OFF" })
    }

})


chrome.action.onClicked.addListener(async (tab) => {
    /*
    * Im HomePage:
    * pop up a easteregg
    * Other cases:
    * When extension is clicked in current tab
    * Switch icon to "ON" 
    */
    if (tab.url.includes('https://github.com/ErwinZhou')) {
        chrome.action.setPopup({
            popup: 'popup.html'
        })
    } 
    else {
    //Get Current State
    const previousState = await chrome.action.getBadgeText({ tabId: tab.id })
    const newState = previousState === 'ON' ? 'OFF' : 'ON'

    //Update State
    await chrome.action.setBadgeText({
        tabId: tab.id,
        text: newState
    })
    //ON -> Inject content.js
    if (newState === 'ON') {
        await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['content.js']
        })
    }

    }
    
})

chrome.tabs.onActivated.addListener(async (activeInfo) => {
    let tab = await chrome.tabs.get(activeInfo.tabId);
    if (!tab.url.includes('https://github.com/ErwinZhou')) {
        await chrome.action.setPopup({
            tabId: activeInfo.tabId,
            popup: ''
        });
    }
})

