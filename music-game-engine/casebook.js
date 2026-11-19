(() => {
  const host = document.getElementById('case-groups');
  const search = document.getElementById('case-query');
  const filters = document.getElementById('case-filters');
  const status = document.getElementById('case-count');
  const toggle = document.getElementById('toggle-cases');
  const markedOnly = document.getElementById('marked-only');
  const markedCount = document.getElementById('marked-count');
  const exportMarked = document.getElementById('export-marked');
  const storageNote = document.getElementById('mark-storage');
  const english = document.documentElement.lang === 'en';
  const wordsFor = (zh, en) => english ? en : zh;
  const reading = window.MGE_READING_STATE || {};
  const sections = [
    ['situation', '情境', 'Situation'], ['task', '目标与约束', 'Task'],
    ['action', '定位与行动', 'Action'], ['result', '验证结果', 'Result'],
    ['reflection', '复盘与边界', 'Reflection']
  ];
  const groups = window.MGE_CASE_GROUPS;
  const rendered = [];
  const filterButtons = [];
  let activeGroup = groups.some(group => group.id === reading.group) ? reading.group : 'all';
  const key = 'music-game-engine.zh.case-selection.v1';
  const validIds = new Set(groups.flatMap(group => group.cases.map(item => item.id)));
  let marked = new Set();
  try {
    const saved = JSON.parse(localStorage.getItem(key) || '[]');
    if (Array.isArray(saved)) marked = new Set(saved.filter(id => validIds.has(id)));
    storageNote.textContent = wordsFor('候选保存在当前浏览器。', 'Selections are saved in this browser.');
  } catch {
    storageNote.textContent = wordsFor('本页打开期间可标记并导出。', 'You can mark and export cases while this page is open.');
  }
  if (Array.isArray(reading.marked)) {
    marked = new Set(reading.marked.filter(id => validIds.has(id)));
    saveMarks();
  }
  if (typeof reading.query === 'string') search.value = reading.query;
  markedOnly.checked = reading.markedOnly === true;
  window.MGE_CASEBOOK_STATE = () => ({
    marked: [...marked], group: activeGroup, query: search.value, markedOnly: markedOnly.checked
  });

  function saveMarks() {
    try {
      localStorage.setItem(key, JSON.stringify([...marked]));
    } catch {
      storageNote.textContent = wordsFor('本页打开期间可标记并导出。', 'You can mark and export cases while this page is open.');
    }
  }

  function element(tag, value, className) {
    const node = document.createElement(tag);
    if (value) node.textContent = value;
    if (className) node.className = className;
    return node;
  }

  function groupFilter(id, title) {
    const button = element('button', title);
    button.type = 'button';
    button.setAttribute('aria-pressed', String(id === activeGroup));
    button.addEventListener('click', () => {
      activeGroup = id;
      update();
    });
    filters.append(button);
    filterButtons.push({id, button});
  }

  function renderCase(record, groupId) {
    const row = element('details', '', 'case-record');
    row.id = record.id;
    const summary = element('summary');
    summary.append(element('span', record.area, 'record-area'), element('strong', record.title));
    const body = element('div', '', 'record-body');
    const dl = element('dl');
    for (const [field, zh, en] of sections) {
      const dt = element('dt', wordsFor(zh, en));
      if (!english) dt.append(element('small', '（' + en + '）'));
      const dd = element('dd', record[field]);
      dl.append(dt, dd);
    }
    const jump = element('a', wordsFor('本条定位链接', 'Link to this case'), 'permalink');
    jump.href = '#' + row.id;
    const actions = element('div', '', 'record-actions');
    const choice = element('label');
    const box = element('input');
    box.type = 'checkbox';
    box.checked = marked.has(record.id);
    box.setAttribute('aria-label', wordsFor('留作候选 · ', 'Shortlist · ') + record.title);
    box.addEventListener('change', () => {
      if (box.checked) marked.add(record.id);
      else marked.delete(record.id);
      saveMarks();
      update();
      if (row.hidden) markedOnly.focus({preventScroll:true});
    });
    choice.append(box, document.createTextNode(wordsFor(' 留作候选', ' Shortlist')));
    actions.append(choice,jump);
    body.append(dl, actions);
    row.append(summary, body);
    rendered.push({row, groupId, text: Object.values(record).join(' ').normalize('NFKC').toLowerCase()});
    return row;
  }

  groupFilter('all', wordsFor('全部', 'All'));
  for (const group of groups) {
    groupFilter(group.id, group.title);
    const block = element('div', '', 'case-group');
    block.id = 'group-' + group.id;
    const header = element('h3', group.title);
    header.append(element('small', String(group.cases.length)));
    block.append(header, element('p', group.intro, 'group-intro'));
    for (const item of group.cases) block.append(renderCase(item, group.id));
    host.append(block);
  }

  function visibleRows() {
    return rendered.filter(({row}) => !row.hidden);
  }
  function updateToggle(rows) {
    const allOpen = rows.length > 0 && rows.every(({row}) => row.open);
    toggle.textContent = allOpen
      ? wordsFor('收起当前结果', 'Collapse matching cases')
      : wordsFor('展开当前结果', 'Expand matching cases');
    toggle.disabled = rows.length === 0;
  }
  function update() {
    const words = search.value.trim().normalize('NFKC').toLowerCase().split(/\s+/).filter(Boolean);
    for (const {row, groupId, text} of rendered) {
      row.hidden = (activeGroup !== 'all' && activeGroup !== groupId) || (markedOnly.checked && !marked.has(row.id)) || !words.every(term => text.includes(term));
    }
    for (const group of groups) {
      const box = document.getElementById('group-' + group.id);
      const count = box.querySelectorAll('details:not([hidden])').length;
      box.hidden = count === 0;
      box.querySelector('h3 small').textContent = String(count);
    }
    const visible = visibleRows();
    const count = visible.length + ' / ' + rendered.length;
    status.textContent = visible.length
      ? wordsFor('显示 ' + count + ' 项案例', 'Showing ' + count + ' cases')
      : markedOnly.checked
        ? wordsFor('当前条件下没有已标记的案例。', 'No shortlisted cases match these filters.')
        : wordsFor('未找到相关案例，可以换一个术语或选择“全部”。', 'No matches. Try another term or select All.');
    markedCount.textContent = String(marked.size);
    exportMarked.disabled = !marked.size;
    for (const {id, button} of filterButtons) button.setAttribute('aria-pressed', String(id === activeGroup));
    updateToggle(visible);
  }

  search.addEventListener('input', update);
  markedOnly.addEventListener('change', update);
  exportMarked.addEventListener('click', () => {
    const blocks = [wordsFor('音游引擎（Music Game Engine）· 我的候选案例', 'Music Game Engine · My shortlisted cases')];
    for (const group of groups) {
      for (const record of group.cases) {
        if (!marked.has(record.id)) continue;
        const lines = [record.title, group.title + ' · ' + record.area];
        for (const [field, zh, en] of sections) lines.push(wordsFor(zh + '（' + en + '）', en) + '\n' + record[field]);
        blocks.push(lines.join('\n\n'));
      }
    }
    const url = URL.createObjectURL(new Blob(['\ufeff', blocks.join('\n\n────────\n\n')], {type:'text/plain;charset=utf-8'}));
    const link = element('a');
    link.href = url;
    link.download = wordsFor('音游引擎-候选案例.txt', 'music-game-engine-shortlist.txt');
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  toggle.addEventListener('click', () => {
    const rows = visibleRows();
    const open = rows.some(({row}) => !row.open);
    for (const {row} of rows) row.open = open;
    updateToggle(rows);
  });
  host.addEventListener('toggle', () => updateToggle(visibleRows()), true);
  function openDestination() {
    const target = document.getElementById(location.hash.slice(1));
    if (!target || !host.contains(target)) return;
    if (target.hidden || target.closest('[hidden]')) {
      activeGroup = 'all';
      search.value = '';
      markedOnly.checked = false;
      update();
    }
    if (target.matches('details')) target.open = true;
    requestAnimationFrame(() => target.scrollIntoView({block: 'start'}));
  }
  window.addEventListener('hashchange', openDestination);
  document.addEventListener('click', event => {
    const anchor = event.target.closest('a[href^="#"]');
    if (anchor && anchor.hash === location.hash && document.getElementById(anchor.hash.slice(1))?.hidden) openDestination();
  });
  update();
  openDestination();
})();
