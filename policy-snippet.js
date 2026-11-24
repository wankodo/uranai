/* 移動シミュレーター：プライバシーポリシー（タイムズ形式モーダル）の共通開閉処理
   対象ページでは data-pp-open ボタンと data-pp-overlay を置くだけでよい。
   同意の保存は行わない（閲覧専用）。タイムズカー・高速ページは自前の処理があるため対象外。 */
(function () {
  "use strict";
  if (window.__idoPpWired) return;
  window.__idoPpWired = true;

  function init() {
    var overlay = document.querySelector("[data-pp-overlay]");
    if (!overlay) return;

    function open() { overlay.classList.add("open"); }
    function close() { overlay.classList.remove("open"); }

    document.querySelectorAll("[data-pp-open]").forEach(function (btn) {
      btn.addEventListener("click", open);
    });
    overlay.querySelectorAll("[data-pp-close]").forEach(function (btn) {
      btn.addEventListener("click", close);
    });
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) close();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
