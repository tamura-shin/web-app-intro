document.addEventListener('DOMContentLoaded', () => {
    const dataList = document.getElementById('data-list');
    const addDataForm = document.getElementById('add-data-form');
    const value1Input = document.getElementById('value1');
    const value2Input = document.getElementById('value2');
    const value3Input = document.getElementById('value3');
    const snowCanvas = document.getElementById('snow-canvas');


    if (snowCanvas) {
        const ctx = snowCanvas.getContext('2d');
        snowCanvas.width = window.innerWidth;
        snowCanvas.height = window.innerHeight;


        function createSnowflakes() {
            const flakes = [];
            for (let i = 0; i < 100; i++) {
                flakes.push({
                    x: Math.random() * snowCanvas.width,
                    y: Math.random() * snowCanvas.height,
                    radius: Math.random() * 4 + 1,
                    speed: Math.random() * 1 + 0.5
                });
            }
            return flakes;
        }

        
        function drawSnowflakes(flakes) {
            ctx.clearRect(0, 0, snowCanvas.width, snowCanvas.height);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            flakes.forEach(flake => {
                ctx.beginPath();
                ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
                ctx.fill();
                flake.y += flake.speed;
                if (flake.y > snowCanvas.height) {
                    flake.y = -flake.radius;
                    flake.x = Math.random() * snowCanvas.width;
                }
            });
            requestAnimationFrame(() => drawSnowflakes(flakes));
        }

        const flakes = createSnowflakes();
        drawSnowflakes(flakes);
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
                listItem.textContent = `ID: ${item.id}, 記入日: ${item.value_1}, 題名: ${item.value_2 || 'N/A'}`;
                listItem.addEventListener('click', () => {
                    alert(item.value_3 || '?');
                });
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
        const value3 = value3Input.value;

        try {
            const response = await fetch('/data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ value_1: value1, value_2: value2, value_3: value3 }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // フォームをクリア
            value1Input.value = '';
            value2Input.value = '';
            value3Input.value = '';

            // データ一覧を再読み込み
            await fetchData();

        } catch (error) {
            console.error('データの追加に失敗しました:', error);
            alert('データの追加に失敗しました。');
        }
    });

    // 「内容確認」フォームの送信イベントリスナーを追加
    const viewDataForm = document.getElementById('view-data-form');
    const viewIdInput = document.getElementById('view-id');

    viewDataForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const id = viewIdInput.value.trim();
        if (!id) return;

        try {
            const response = await fetch(`/data/${id}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const item = await response.json();
            alert(item.value_3 || '本文がありません');
        } catch (error) {
            console.error('データの取得に失敗しました:', error);
            alert('データの取得に失敗しました。');
        }
    });

    // 初期データの読み込み
    fetchData();
});