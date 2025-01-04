## 2024.11.1-tiramiss.0

### Note
- [重要] ノート検索プロバイダの追加に伴い、configファイル（default.ymlなど）の構成が少し変わります.
	- 新しい設定項目"fulltextSearch.provider"が追加されました. sqlLike, sqlPgroonga, meilisearchのいずれかを設定出来ます.
	- すでにMeilisearchをお使いの場合、 **"fulltextSearch.provider"を"meilisearch"に設定する必要** があります.
	- 詳細は #14730 および `.config/example.yml` または `.config/docker_example.yml`の'Fulltext search configuration'をご参照願います.

### General
- Feat: カスタム絵文字管理画面をリニューアル #10996
	* β版として公開のため、旧画面も引き続き利用可能です
- Fix: tabler-iconsからphosphor-iconsへの移行 ( #2 )

### Server
- Enhance: ノート検索の選択肢としてpgroongaに対応 ( #14730 )
- Fix: 絵文字の連合でライセンス欄を相互にやり取りするように ( #10859, #14109 )
