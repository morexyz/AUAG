export function renderNetwork({nodes,desc,tabs,panel,language,active,activeTab,content,panelTexts}){
 desc.textContent=content[language][active];
 nodes.forEach(node=>node.classList.toggle('is-active',node.dataset.node===active));
 panel.innerHTML=panelTexts[language][activeTab];
 tabs.forEach(tab=>{tab.classList.toggle('is-active',tab.dataset.panel===activeTab);tab.setAttribute('aria-selected',String(tab.dataset.panel===activeTab))});
}
