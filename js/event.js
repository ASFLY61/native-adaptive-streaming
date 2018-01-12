/**
 * Modifications copyright (C) 2017 David Ćavar
 */
var enabled = true;

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse){
      if (request == "getState") {
        sendResponse(enabled);
      } else {
        enabled = request == "Enable";
        enabled ? chrome.browserAction.setIcon({path:"icon128.png"}) : chrome.browserAction.setIcon({path:"icon128grey.png"})
      }
    }
);

chrome.webRequest.onBeforeRequest.addListener(
  function(info) {
    if ((info.url.split("?")[0].split("#")[0].endsWith(".m3u8") || info.url.split("?")[0].split("#")[0].endsWith(".mpd"))) {
      var playerUrl = chrome.runtime.getURL('player.html') + "#" + info.url
      if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1){
        chrome.tabs.update(info.tabId, {url: playerUrl});
        return {cancel: true}
      } else {
        return { redirectUrl:  playerUrl }
      }
    }
  },
  {urls: ["*://*/*.m3u8*", "*://*/*.mpd*"], types:["main_frame"]},
  ["blocking"]
);
