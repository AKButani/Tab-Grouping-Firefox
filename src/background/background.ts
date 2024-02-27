import { handleContextMenuClicks } from "./contextMenus";
import { init } from "./init";
import { addTab, removeTab, updateTab } from "./tabEvents";

export {}

browser.runtime.onStartup.addListener(init);
browser.runtime.onInstalled.addListener(init);

browser.contextMenus.onClicked.addListener(handleContextMenuClicks)

browser.tabs.onCreated.addListener(addTab);
browser.tabs.onRemoved.addListener(removeTab);
browser.tabs.onUpdated.addListener(updateTab);

browser.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === "open_tabs_new_win"){
        //Opens a group of tabs in a new window
        
        let tabs = msg.tabIds;
        browser.windows.create({tabId: tabs[0]}).then(newWindow => {
            //remove 1st element since it has been moved already
            tabs.shift();
            // Move the tabs to the new window
            browser.tabs.move(tabs, { windowId: newWindow.id, index: -1 });
        });
    } else if (msg.type === "store-as-bookmark"){
        //Stores group of tabs as a bookmark


        browser.bookmarks.create({title: msg.title, type: "folder"}).then((bookmark) => {
            /* console.log("Bookmark created");
            console.log(bookmark); */
            let bookmarkPromises = [];
            for (let tab of msg.tabs){
                bookmarkPromises.push(browser.bookmarks.create({parentId: bookmark.id, title: tab.title, url: tab.url}).then(() =>
                   {console.log("added bookmark of " + tab.title + "to folder");}
                ));
            };

            //waits until all tabs are bookmarked and only then sends a message
            Promise.all(bookmarkPromises).then(() => {
                console.log("sending response");
                sendResponse({ response: "success" });
            }).catch(error => {
                console.error("Error creating bookmarks:", error);
                sendResponse({ response: "error" });
            });
        }, (e) => {
            sendResponse({response: "error" + e});
        });

        
    }
})