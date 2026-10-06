// 公開してよい設定だけを書く。作者キーやその他の秘密はここに書かない。
window.SITE_CONFIG = {
  projectId: 'mta',
  memoApi: 'https://mother-president-sync.noraelf-mta-review.workers.dev',
  // v5のページのメモは page_id の先頭にこれを付けて保存する
  pagePrefix: 'v5-',
  legacySessionKey: 'mta-index:mta:session',
  v2Url: 'https://noraelf-creator.github.io/mta-review/'
};
