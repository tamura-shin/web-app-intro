// script.js

// 定数としてじゃんけんの手を定義（数値と絵文字）
const HANDS = [
    { name: 'グー', emoji: '✊' },     // 0: ROCK
    { name: 'チョキ', emoji: '✌️' }, // 1: SCISSORS
    { name: 'パー', emoji: '🖐️' }      // 2: PAPER
];

// 結果メッセージ
const RESULTS = {
    WIN: 'あなたの勝ち！🎉',
    LOSE: 'あなたの負け...😢',
    DRAW: 'あいこ！🤝'
};

// HTML要素を取得
const playerHandElement = document.getElementById('player-hand');
const computerHandElement = document.getElementById('computer-hand');
const resultElement = document.getElementById('result');
const rockButton = document.getElementById('btn-rock');
const scissorsButton = document.getElementById('btn-scissors');
const paperButton = document.getElementById('btn-paper');

// じゃんけんを実行し結果を表示する関数
function playGame(playerChoiceIndex) {
    // プレイヤーの手を表示
    playerHandElement.textContent = HANDS[playerChoiceIndex].emoji;
    playerHandElement.setAttribute('aria-label', `あなたの手: ${HANDS[playerChoiceIndex].name}`);

    // コンピューターの手をランダムに決定 (0, 1, 2 のいずれか)
    const computerChoiceIndex = Math.floor(Math.random() * 3);
    computerHandElement.textContent = HANDS[computerChoiceIndex].emoji;
    computerHandElement.setAttribute('aria-label', `コンピューターの手: ${HANDS[computerChoiceIndex].name}`);

    // 勝敗判定
    let resultText = '';
    // あいこ
    if (playerChoiceIndex === computerChoiceIndex) {
        resultText = RESULTS.DRAW;
        // プレイヤーの勝ちパターン
    } else if (
        (playerChoiceIndex === 0 && computerChoiceIndex === 1) || // グー vs チョキ
        (playerChoiceIndex === 1 && computerChoiceIndex === 2) || // チョキ vs パー
        (playerChoiceIndex === 2 && computerChoiceIndex === 0)    // パー vs グー
    ) {
        resultText = RESULTS.WIN;
        // プレイヤーの負けパターン
    } else {
        resultText = RESULTS.LOSE;
    }

    // 結果を表示
    resultElement.textContent = resultText;
}

// ボタンにイベントリスナーを設定
// defer属性によりDOM読み込み後に実行されるため、DOMContentLoadedを待つ必要はない
if (rockButton && scissorsButton && paperButton) {
    rockButton.addEventListener('click', () => playGame(0)); // グー (index: 0)
    scissorsButton.addEventListener('click', () => playGame(1)); // チョキ (index: 1)
    paperButton.addEventListener('click', () => playGame(2)); // パー (index: 2)
} else {
    console.error("ボタン要素が見つかりません。HTMLのIDを確認してください。");
}