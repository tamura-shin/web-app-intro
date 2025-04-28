document.addEventListener('DOMContentLoaded', () => {
    const dataList = document.getElementById('data-list');
    const addDataForm = document.getElementById('add-data-form');
    const value1Input = document.getElementById('value1');
    const value2Input = document.getElementById('value2');
    // データ詳細セクションの要素を取得
    const detailIdInput = document.getElementById('detail-id');
    const fetchDetailButton = document.getElementById('fetch-detail');
    const detailValue1Input = document.getElementById('detail-value1');
    const detailValue2Input = document.getElementById('detail-value2');

    // データ詳細を取得して表示する関数
    async function fetchDetail(id) {
        // 詳細表示欄をクリア
        detailValue1Input.value = '';
        detailValue2Input.value = '';
        if (!id) {
            alert('IDを入力してください。');
            return;
        }
        try {
            const response = await fetch(`/data/${id}`);
            if (!response.ok) {
                if (response.status === 404) {
                    alert('指定されたIDのデータが見つかりません。');
                } else {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return; // エラー時は以降の処理を中断
            }
            const data = await response.json();
            detailValue1Input.value = data.value_1;
            detailValue2Input.value = data.value_2 || ''; // value_2がnullの場合、空文字を表示
        } catch (error) {
            console.error('データ詳細の取得に失敗しました:', error);
            alert('データ詳細の取得に失敗しました。');
        }
    }

    // データ一覧を取得して表示する関数
    async function fetchData() {
        try {
            const response = await fetch('/data');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            dataList.innerHTML = ''; // 既存のリストをクリア
            data.forEach(item => {
                const listItem = document.createElement('li');
                listItem.textContent = `ID: ${item}`;
                dataList.appendChild(listItem);
            });
        } catch (error) {
            console.error('データの取得に失敗しました:', error);
            dataList.innerHTML = '<li>データの取得に失敗しました。</li>';
        }
    }

    // データ追加フォームの送信イベントリスナー
    addDataForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // デフォルトのフォーム送信をキャンセル

        const value1 = value1Input.value;
        const value2 = value2Input.value;

        try {
            const response = await fetch('/data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ value_1: value1, value_2: value2 }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // フォームをクリア
            value1Input.value = '';
            value2Input.value = '';

            // データ一覧を再読み込み
            await fetchData();

        } catch (error) {
            console.error('データの追加に失敗しました:', error);
            alert('データの追加に失敗しました。');
        }
    });

    // 詳細取得ボタンのクリックイベントリスナー
    fetchDetailButton.addEventListener('click', () => {
        const id = detailIdInput.value;
        fetchDetail(id);
    });

    // 初期データの読み込み
    fetchData();
});