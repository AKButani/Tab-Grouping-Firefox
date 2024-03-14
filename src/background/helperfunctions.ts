/*
    @param tabIds: (number | undefined)[] - list of tabIds to be added to the group
    @param uniqueGroupName: string - the unique name of the group
    overwrites the list if the group already exists
*/
export async function addTabstoGroup(tabIds: (number | undefined)[], uniqueGroupName: string) {
    let storage = await browser.storage.session.get();
    let tabList = [];

    for (let tabId of tabIds) {
        if (typeof tabId === "number") {
            let tab = await browser.tabs.get(tabId);
            tabList.push(tab);
        }
    }
    storage[uniqueGroupName] = tabList;

    await browser.storage.session.set(storage);

}
/* async function moveTabs(tabIds: (number | undefined)[], uniqueGroupName: string, storage: { [key: string]: any; }) {
    storage['Unassigned'].filter((tab: browser.tabs.Tab) => tabIds.includes(tab.id));
    let tabList = [];

    for (let tabId of tabIds) {
        if (typeof tabId === "number") {
            let tab = await browser.tabs.get(tabId);
            tabList.push(tab);
        }
    }
    storage[uniqueGroupName] = tabList;

    await browser.storage.session.set(storage);
} */
/*
    @param groupName: string - the name of the group
    @param storage: { [key: string]: any; } - the browser storage object
    @returns string - the unique name of the group
    Handles the case when a group with the same name already exists by adding a number in brackets to the name
    e.g "Group" -> "Group (1)" -> "Group (2)" -> ...
*/
export function handleRepitition(groupName: string, storage: { [key: string]: any; }) {
    var res = groupName;
    console.log(storage[res]);
    if (storage[res] === undefined) {
        console.log("returning: " + res);
        return res;
    } else {
        let count = 1;
        while (storage[res] !== undefined) { //potential inf loop??
            console.log("count: " + count);
            res = groupName + ` (${count})`;
            count += 1;
        }
        console.log("returning: " + res);
        return res;
    }


}
/*
    @param bookmark: browser.bookmarks.BookmarkTreeNode - the bookmark to be opened
    @param tabIds: (number | undefined)[] - list of tabIds to be added to the group
    @returns (number | undefined)[] - list of tabIds opened
    Opens the bookmark and its children recursively
*/
export async function recursiveOpener(bookmark: browser.bookmarks.BookmarkTreeNode, tabIds: (number | undefined)[] = []) {
    if (bookmark.url) {
        const tab = await browser.tabs.create({
            active: false,
            url: bookmark.url,
        });
        tabIds.push(tab.id);
    } else {
        let children = await browser.bookmarks.getChildren(bookmark.id);
        for (let child of children) {
            await recursiveOpener(child, tabIds);
        }
    }
    return tabIds;
}
/*
    @param bookmark: browser.bookmarks.BookmarkTreeNode - the bookmark to be opened
    @returns string[] - list of URLs in the bookmark and its children
    Gets all the URLs in the bookmark and its children to be opened in a new window
*/
export async function getAllurls(bookmark: browser.bookmarks.BookmarkTreeNode) {
    const urls: string[] = [];

    // Check if the bookmark is a folder
    let children = await browser.bookmarks.getChildren(bookmark.id);
    if (children) {
        // Iterate over each child
        children.forEach(async (child) => {
            // If the child is a URL, add it to the list of URLs
            if (child.url) {
                urls.push(child.url);
            }


            // If the child is a folder, recursively call the function to get URLs from it
            else {
                let child_children = await browser.bookmarks.getChildren(child.id);
                if (child_children) {
                    const childUrls = await getAllurls(child);
                    urls.push(...childUrls);
                }
            }
        });
    }

    return urls;
}
