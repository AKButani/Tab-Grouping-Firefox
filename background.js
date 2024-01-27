console.log("running")

function onCreated() {
  if (browser.runtime.lastError) {
    console.log(`Error: ${browser.runtime.lastError}`);
  } else {
    console.log("Item created successfully");
  }
}

function onContextMenuClick(info, tab) {
  if (info.menuItemId === "change-color-yellow") {
    browser.theme.update(window.id, {
      colors: {
        tab_line: "red",
      },
    })
    console.log("Color changed");
    
  }
  if (info.menuItemId === "change-color-default") {
    browser.theme.reset(window.id);
    console.log("Color reset");
  }
}

browser.contextMenus.create({
    id: "change-color-yellow",
    title: browser.i18n.getMessage("menuItemRemoveMe"),
    contexts: ["tab"],
  },
  onCreated,
);

browser.contextMenus.create({
  id: "change-color-default",
  title: "default color",
  contexts: ["tab"],
},
onCreated,
);

browser.contextMenus.onClicked.addListener((info, tab) => {
  onContextMenuClick(info, tab);
});