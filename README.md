# GitHub Codespacesを開く手順

GitHubにログインし、`.devcontainer/devcontainer.json` ファイルを含むリポジトリでCodespacesを開くまでの手順は以下の通りです。

1.  **GitHubにログインする**
    * Webブラウザで [GitHub](https://github.com/) を開きます。
    * 画面右上の「Sign in」をクリックし、ユーザー名またはメールアドレスとパスワードを入力してログインします。（2要素認証を設定している場合は、指示に従って認証コードを入力してください。）

2.  **目的のリポジトリに移動する**
    * ログイン後、ダッシュボードや検索バーを使って、Codespacesを開きたいリポジトリ（`.devcontainer/devcontainer.json` ファイルが含まれているリポジトリ）のページに移動します。

3.  **Codespacesを開く**
    * リポジトリのメインページで、ファイルリストの上にある緑色の「**<> Code**」ボタンをクリックします。
    * ドロップダウンメニューが表示されます。上部にある「**Codespaces**」タブを選択します。
    * 「**Create codespace on [ブランチ名]**」という緑色のボタンが表示されます。これをクリックすると、新しいCodespaceの作成と起動が始まります。
        * もし過去に同じリポジトリでCodespaceを作成したことがある場合は、既存のCodespaceがリスト表示されます。その場合は、再開したいCodespace名をクリックするか、新しいCodespaceを作成するために「Create codespace on [ブランチ名]」をクリックします。
    * Codespaceの環境設定と起動が自動的に行われます。しばらく待つと、ブラウザベースのVS Codeエディタが開き、開発を開始できます。`.devcontainer/devcontainer.json` の設定に基づいて環境が構築されます。
