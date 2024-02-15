let selectedIndex = null; // 選択されたメモのインデックス

// ここから関数の宣言

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
  setTitleColor();
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

// メモ一覧の背景色が青のメモのタイトルの色を変更する関数
function setTitleColor() {
  const memoList = document.getElementById('memo-list');
  const memoItems = memoList.getElementsByTagName('li');

  Array.from(memoItems).forEach((memoItem) => {
    const memoColor = memoItem.style.backgroundColor;

    if (memoColor === 'rgb(0, 0, 255)') {
      memoItem.style.color = 'white'; // 背景色が青の場合、タイトルの色を白に設定
    } else {
      memoItem.style.color = 'black'; // それ以外の場合は黒に設定
    }
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

// メモのタイトルで検索する関数
function searchMemosByTitle() {
  const searchInput = document.getElementById('search-by-title').value.toLowerCase();
  const memoList = document.getElementById('memo-list');
  const memoItems = memoList.getElementsByTagName('li');
  
  Array.from(memoItems).forEach((memoItem) => {
    const memoTitle = memoItem.textContent.toLowerCase();
    if (memoTitle.includes(searchInput)) {
      memoItem.style.display = 'block';
    } else {
      memoItem.style.display = 'none';
    }
  });
}

// メモの本文で検索する関数
function searchMemosByContent() {
  const searchText = document.getElementById('search-by-content').value.toLowerCase();
  const memos = JSON.parse(localStorage.getItem('memos')) || [];
  const memoList = document.getElementById('memo-list');

  memos.forEach((memo, index) => {
    const memoContent = memo.content.toLowerCase();

    if (memoContent.includes(searchText)) {
      memoList.children[index].style.display = 'block';
    } else {
      memoList.children[index].style.display = 'none';
    }
  });
}

// メモの色で検索する関数
function searchMemosByColor() {
  const selectedColor = document.getElementById('search-by-color').value;
  const memoList = document.getElementById('memo-list');
  const memos = JSON.parse(localStorage.getItem('memos')) || [];
  // 検索しないだった場合メモを再表示
  if (selectedColor === "none") {
    memos.forEach((memo, index) => {
        memoList.children[index].style.display = 'block';
    });
  } else {
    memos.forEach((memo, index) => {
      if (memo.color === selectedColor) {
        memoList.children[index].style.display = 'block';
      } else {
        memoList.children[index].style.display = 'none';
      }
    });
  } 
}

// ここまで関数の宣言

// 初期表示
displayMemos();

// ここからイベントリスナー

// 新規メモ作成ボタンをクリックしたときの処理
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
// メモフォームの送信ボタンをクリックしたときの処理
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

// 削除ボタンをクリックしたときの処理
document.getElementById('delete-btn').addEventListener('click', () => {
  deleteMemo(selectedIndex); // 選択されたメモを削除
  resetMemoList(); // メモ一覧を更新
  clearForm(); // フォームをクリア
});

// タイトルで検索の入力フィールドが変更されたときに検索を実行
document.getElementById('search-by-title').addEventListener('input', searchMemosByTitle);

// タイトルで検索の入力フィールドが変更されたときに検索を実行
document.getElementById('search-by-content').addEventListener('input', searchMemosByContent);

// 色で検索を実行
document.getElementById('search-by-color').addEventListener('change', searchMemosByColor);

// 詳細検索ボタンがクリックされたときの処理
document.getElementById('advanced-search-btn').addEventListener('click', () => {
  const advancedSearchOptions = document.getElementById('advanced-search-options');
  advancedSearchOptions.classList.toggle('hidden');
});
