$(function() {
  createBubble();
});


function createBubble() {
  const $bubbles = $(".js-bubbles");
  const maxSize  = 16;
  const minSize  = 8;

  createBubbleCore();


  // ★ 生成位置 y は、常に最下ではなく、現在ｳｲﾝﾄﾞｳの下部からにする
  //    → そうしないと、最下から生成してもﾌｧｰｽﾄﾋﾞｭｰに描画されるまで結構時間を要するから

  // ★ ﾏｳｽを動かしたり、どこかをｸﾘｯｸした時、その時点から 泡 を生成する
  //    →ｸﾘｯｸはｽﾏﾎ、動かしorｸﾘｯｸはpc
  //    これで生成された 泡 は、初速は速くし、複数の 泡 が散らばるように登場させる

  // ★ 生成された 泡 は、少し左右に揺れながら上昇し（←確定）
  //                    ﾗﾝﾀﾞﾑ秒後に消滅する（←検討中）

  function createBubbleCore() {
    // 生成に必要な値をﾗﾝﾀﾞﾑで取得
    const setSize       = (Math.random() * (maxSize - minSize) + minSize).toFixed(2);
    const setPosX       = (Math.random() * ($bubbles.width() - 0) + 0).toFixed(2);
    const setDuration   = (Math.random() * (30 - 15) + 15).toFixed(2);
    const setInterval   = (Math.random() * (4 - 0) + 0).toFixed(2);
    // setSize に応じて 0.8 ~ 1.0 の値を算出
    const setBrightness = (0.8 + (setSize - minSize) * (0.2 / minSize)).toFixed(2);

    // 取得したﾗﾝﾀﾞﾑ値を持つ js-bubble を生成し js-bubbles に追加
    const $bubble = $("<span>")
      .addClass("bubble js-bubbles")
      .css({
        "width": setSize + "px",
        "height": setSize + "px",
        "left" : setPosX + "px",
        "animation-duration": setDuration + "s",
        "filter": `brightness(${setBrightness})`,
      });
    $bubbles.append($bubble);

    // ｱﾆﾒｰｼｮﾝ再生後に削除
    setTimeout(() => {
      $bubble.remove();
    }, setDuration * 1000);

    // 次回の生成を予約
    setTimeout(createBubbleCore, setInterval * 1000);
  }
}