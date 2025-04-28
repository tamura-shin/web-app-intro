document.addEventListener('DOMContentLoaded', () => {
    const weatherDisplay = document.getElementById('weather-display');
    const getWeatherButton = document.getElementById('get-weather-button');

    const weatherForecastDisplay = document.getElementById('weather-forecast-display');
    const getWeatherForecastButton = document.getElementById('get-weather-forecast-button');

    // 今日の天気を取得して表示する関数
    async function fetchWeather() {
        // 表示を更新中に変更
        weatherDisplay.textContent = '今日の天気を取得中...';
        try {
            const response = await fetch('/weather'); // バックエンドの /weather エンドポイントにリクエスト
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json(); // レスポンスをJSONとして解析
            weatherDisplay.textContent = `今日の天気は「${data.weather}」です。`; // 取得した天気予報を表示
        } catch (error) {
            console.error('今日の天気の取得に失敗しました:', error);
            weatherDisplay.textContent = '今日の天気の取得に失敗しました。'; // エラーメッセージを表示
        }
    }

    // ボタンがクリックされたら今日の天気を取得
    getWeatherButton.addEventListener('click', fetchWeather);

    // 明日の天気を取得して表示する関数
    async function fetchWeatherForecast() {
        // 表示を更新中に変更
        weatherForecastDisplay.textContent = '明日の天気を取得中...';
        try {
            const response = await fetch('/weather-forecast'); // バックエンドの /weather-forecast エンドポイントにリクエスト
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json(); // レスポンスをJSONとして解析
            weatherForecastDisplay.textContent = `明日の天気は「${data.weather}」です。`; // 取得した天気予報を表示
        } catch (error) {
            console.error('明日の天気の取得に失敗しました:', error);
            weatherForecastDisplay.textContent = '明日の天気の取得に失敗しました。'; // エラーメッセージを表示
        }
    }

    // ボタンがクリックされたら明日の天気を取得
    getWeatherForecastButton.addEventListener('click', fetchWeatherForecast);
});