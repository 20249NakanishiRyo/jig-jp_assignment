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

// メモを削除する関数
function deleteMemo(index) {
  const memos = JSON.parse(localStorage.getItem('memos')) || [];
  if (index >= 0 && index < memos.length) {
    memos.splice(index, 1); // メモを削除
    localStorage.setItem('memos', JSON.stringify(memos)); // 更新されたメモリストを保存
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

// メモ一覧をリセットする関数
function resetMemoList() {
  const memoList = document.getElementById('memo-list');
  memoList.innerHTML = ''; // メモ一覧をリセット
  displayMemos(); // メモ一覧を再表示
}

function clearForm() {
  document.getElementById('title').value = '';
  document.getElementById('content').value = '';
  document.getElementById('color').value = '#ffffff'; // デフォルトの色を設定
  document.getElementById('memo-form').removeAttribute('data-editing-index'); // 編集中のインデックスを削除
  resetMemoListColors(); // メモの色を元に戻す
}

// メモ一覧のすべてのメモの色を元に戻す関数
function resetMemoListColors() {
  const memoItems = document.querySelectorAll('#memo-list li');
  memoItems.forEach((memoItem, index) => {
    const memos = JSON.parse(localStorage.getItem('memos')) || [];
    const memo = memos[index];
    const originalColor = memo.color || '#ffffff'; // メモの色情報を取得
    memoItem.style.backgroundColor = originalColor; // 元の色を背景色として設定
  });
}

// メモを暗くする関数
function darkenMemo() {
  const memoListItems = document.querySelectorAll('#memo-list li');
  memoListItems.forEach((memoItem, index) => {
    if (index === selectedIndex) {
      const memos = JSON.parse(localStorage.getItem('memos')) || [];
      const memo = memos[index];
      const originalColor = memo.color || '#ffffff'; // メモの色情報を取得
      const darkenedColor = darkenColor(originalColor); // 色を少し暗くする
      memoItem.style.backgroundColor = darkenedColor; // 少し暗い色を背景色として設定
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
  clearForm()
});

// メモ一覧のリストアイテムをクリックしたときの処理
document.getElementById('memo-list').addEventListener('click', (e) => {
  const index = parseInt(e.target.dataset.index);
  if (!isNaN(index)) {
    // 他のメモの編集中のスタイルを元に戻す
    const memoItems = document.querySelectorAll('#memo-list li');
    memoItems.forEach(memoItem => {
      memoItem.classList.remove('editing');
      const memoIndex = parseInt(memoItem.dataset.index);
      const memos = JSON.parse(localStorage.getItem('memos')) || [];
      const memo = memos[memoIndex];
      const originalColor = memo.color || '#ffffff'; // メモの色情報を取得
      memoItem.style.backgroundColor = originalColor; // 元の色を背景色として設定
    });

    selectedIndex = index;
    updateMemoListStyles();
    setupForm(selectedIndex); // メモの内容を読み込む
    document.getElementById('delete-btn').style.display = 'inline'; // 削除ボタンを表示
    darkenMemo(); // メモを暗くする処理を実行

    // 編集中のメモにeditingクラスを付与
    memoItems.forEach((memoItem, memoIndex) => {
      if (memoIndex === selectedIndex) {
        memoItem.classList.add('editing');
      }
    });
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
    if (!target.classList.contains('editing')) { // 編集中でない場合のみ
      const index = parseInt(target.dataset.index);
      const memos = JSON.parse(localStorage.getItem('memos')) || [];
      const memo = memos[index];
      const originalColor = memo.color || '#ffffff'; // メモの色情報を取得
      target.style.backgroundColor = originalColor; // 元の色を背景色として設定
    }
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
  resetMemoList(); // メモ一覧のリセット
});

// 削除ボタンのクリックイベントリスナー
document.getElementById('delete-btn').addEventListener('click', () => {
  deleteMemo(selectedIndex); // 選択されたメモを削除
  resetMemoList(); // メモ一覧を更新
  clearForm(); // フォームをクリア
});
