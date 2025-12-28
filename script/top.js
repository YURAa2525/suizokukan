$(function() {
  // createBubble();
});


// ----------------------------------------------
// ﾗﾝﾀﾞﾑな js-bubble を生成
// ----------------------------------------------
function createBubble() {
  const $bubbles = $(".js-bubbles");
  const maxSize  = 16;
  const minSize  = 8;
  let   bubblesWidth;
  let   windowHeight;

  getBubblesSize();
  createBubbleCore();

  $(window).on("resize", () => {
    getBubblesSize();
  });


  // --------------------------------------------
  // ｳｲﾝﾄﾞｳﾘｻｲｽﾞ時、生成範囲を再取得
  // --------------------------------------------
  function getBubblesSize() {
    bubblesWidth = $bubbles.width();
    windowHeight = $(window).innerHeight();
  }


  // TODO -----------------------------------------------------------------------------------------
  // ★ ﾏｳｽを動かしたり、どこかをｸﾘｯｸした時、その時点から 泡 を生成する
  //    →ｸﾘｯｸはｽﾏﾎ、動かしorｸﾘｯｸはpc
  //    これで生成された 泡 は、初速は速くし、複数の 泡 が散らばる (ﾗﾝﾀﾞﾑに) ように登場させる

  // ★ 生成された 泡 は、少し左右に揺れながら上昇し（←確定）
  //                    ﾗﾝﾀﾞﾑ秒後に消滅する（←検討中）
  // ----------------------------------------------------------------------------------------------


  // --------------------------------------------
  // ﾗﾝﾀﾞﾑな値を算出し js-bubble を生成
  // 初回以降は自ら繰り返し実行を繰り返す
  // --------------------------------------------
  function createBubbleCore() {
    const setSize     = (Math.random() * (maxSize - minSize) + minSize).toFixed(2);
    const setPosX     = (Math.random() * (bubblesWidth - 0) + 0).toFixed(2);
    const setDuration = (Math.random() * (30 - 15) + 15).toFixed(2);
    const setInterval = (Math.random() * (4 - 0) + 0).toFixed(2);

    // setSize に応じて 0.8 ~ 1.0 の値を算出
    const setBrightness = (0.8 + (setSize - minSize) * (0.2 / minSize)).toFixed(2);

    // 生成位置 y は、現ｳｲﾝﾄﾞｳの下部
    const setPosY = $(window).scrollTop() + windowHeight;
    
    // 取得したﾗﾝﾀﾞﾑ値を持つ js-bubble を生成し js-bubbles に追加
    const $bubble = $("<span>")
      .addClass("bubble js-bubbles")
      .css({
        "width"    : `${setSize}px`,
        "height"   : `${setSize}px`,
        "top"      : `${setPosY}px`,
        "left"     : `${setPosX}px`,
        "animation": `floating ${setDuration}s linear 1 forwards`,
        "filter"   : `brightness(${setBrightness})`,
      });
    $bubbles.append($bubble);

    // ｱﾆﾒｰｼｮﾝ再生後に削除
    setTimeout(() => {
      $bubble.remove();
    }, setDuration * 1000);

    // 次回の生成を予約
    setTimeout(() => {
      createBubbleCore("auto");
    }, setInterval * 1000);
  }
}