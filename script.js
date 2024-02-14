let selectedIndex = null; // 選択されたメモのインデックス

  // 色を少し暗くする関数
  function darkenColor(color) {
    // 色コードを16進数からRGBに変換
    const hex = color.substring(1);
    const rgb = parseInt(hex, 16);
    // RGB値を取得
    let r = (rgb >> 16) & 0xff;
    let g = (rgb >>  8) & 0xff;
    let b = (rgb >>  0) & 0xff;
    // 色を暗くする
    r = Math.floor(r * 0.8); // 80%の明度にする
    g = Math.floor(g * 0.8);
    b = Math.floor(b * 0.8);
    // RGB値を16進数に変換して色コードを作成
    const darkHex = ((r << 16) | (g << 8) | b).toString(16);
    return '#' + darkHex.padStart(6, '0'); // 色コードを返す
  }

  // ローカルストレージからメモを取得してリストに表示
  function displayMemos() {
    const memoList = document.getElementById('memo-list');
    memoList.innerHTML = ''; // メモ一覧をリセット
    const memos = JSON.parse(localStorage.getItem('memos')) || [];
    memos.forEach((memo, index) => {
      const memoItem = document.createElement('li');
      memoItem.textContent = memo.title;
      memoItem.style.backgroundColor = memo.color || '#ffffff'; // メモの色情報を背景色として設定
      memoItem.dataset.index = index;
      memoList.appendChild(memoItem);
    });
  }
  
  // メモを追加または更新
  function saveMemo(title, content, editingIndex, color) {
    const memos = JSON.parse(localStorage.getItem('memos')) || [];
    if (editingIndex !== undefined && editingIndex < memos.length) {
      // 既存のメモを編集する場合
      memos[editingIndex] = { title, content, color };
    } else {
      // 新しいメモを追加する場合
      memos.push({ title, content, color });
    }
    localStorage.setItem('memos', JSON.stringify(memos));
    // 保存後、メモ一覧を更新
    displayMemos();
  }
  
  // メモを削除
  function deleteMemo(index) {
    const memos = JSON.parse(localStorage.getItem('memos')) || [];
    if (index !== undefined && index < memos.length) {
      memos.splice(index, 1);
      localStorage.setItem('memos', JSON.stringify(memos));
      displayMemos();
    }
  }
  
  // メモの編集フォームを更新
  function setupForm(index) {
    const memos = JSON.parse(localStorage.getItem('memos')) || [];
    if (index !== undefined && index < memos.length) {
      const memo = memos[index];
      document.getElementById('title').value = memo.title;
      document.getElementById('content').value = memo.content;
      document.getElementById('color').value = memo.color || '#ffffff'; // デフォルトの色を白に設定
      document.getElementById('memo-form').setAttribute('data-editing-index', index); // 編集中のメモのインデックスを設定
      document.getElementById('delete-btn').style.display = 'inline'; // 削除ボタンを表示
    } else {
      // 新規メモ作成時に削除ボタンを非表示にする
      document.getElementById('delete-btn').style.display = 'none';
    }
  }

  // メモ一覧のスタイルを更新する関数
  function updateMemoListStyles() {
    const memoItems = document.querySelectorAll('#memo-list li');
    memoItems.forEach((memoItem, index) => {
      if (index === selectedIndex) {
        memoItem.classList.add('selected');
      } else {
        memoItem.classList.remove('selected');
      }
    });
  }
  
  // 初期表示
  displayMemos();

  // 新規メモ作成ボタンのクリックイベントリスナー
  document.getElementById('new-memo-btn').addEventListener('click', () => {
    document.getElementById('memo-form').reset();
    document.getElementById('memo-form').removeAttribute('data-editing-index');
    document.getElementById('delete-btn').style.display = 'none';
  });
  
  // メモリストのクリックイベントリスナー
  document.getElementById('memo-list').addEventListener('click', (e) => {
    const index = parseInt(e.target.dataset.index);
    if (!isNaN(index)) {
      selectedIndex = index;
      updateMemoListStyles();
      setupForm(selectedIndex); // メモの内容を読み込む
      document.getElementById('delete-btn').style.display = 'inline'; // 削除ボタンを表示
    }
  });

  // メモ一覧のリストアイテムにマウスが乗ったときの処理
  document.getElementById('memo-list').addEventListener('mouseover', (e) => {
    const target = e.target;
    if (target.tagName === 'LI') {
      target.classList.add('hovered');
      const index = parseInt(target.dataset.index);
      const memos = JSON.parse(localStorage.getItem('memos')) || [];
      const memo = memos[index];
      const originalColor = memo.color || '#ffffff'; // メモの色情報を取得
      const darkenedColor = darkenColor(originalColor); // 色を少し暗くする
      target.style.backgroundColor = darkenedColor; // 少し暗い色を背景色として設定
    }
  });

  // メモ一覧のリストアイテムからマウスが離れたときの処理
  document.getElementById('memo-list').addEventListener('mouseout', (e) => {
    const target = e.target;
    if (target.tagName === 'LI') {
      target.classList.remove('hovered');
      const index = parseInt(target.dataset.index);
      const memos = JSON.parse(localStorage.getItem('memos')) || [];
      const memo = memos[index];
      target.style.backgroundColor = memo.color || '#ffffff'; // メモの色情報を背景色として設定
    }
  });

  // メモフォームの送信イベントリスナー
  document.getElementById('memo-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const color = document.getElementById('color').value;
    const editingIndex = parseInt(document.getElementById('memo-form').getAttribute('data-editing-index'));
    saveMemo(title, content, editingIndex, color);
    document.getElementById('delete-btn').style.display = 'none'; // 削除ボタンを非表示
  });
  