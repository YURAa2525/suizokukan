let g_userDevice = "mobile";

$(function() {
  $("#svg-sprite").load("svg.html");

  if (window.matchMedia("(pointer: fine)").matches) g_userDevice = "pc";

  mainMarginTop();
  // createBubble();
  slideManage();

  // --------------------------------------------
  // js-main の margin-top 値を js-header の高さに合わせる
  // --------------------------------------------
  function mainMarginTop() {
    _mainMarginTop();

    let timer;
    $(window).on("resize", () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        _mainMarginTop();
      }, 100);
    });

    function _mainMarginTop() {
      const headerHeight = $(".js-header").height();
      $(".js-main").css("margin-top", `${headerHeight}px`);
    }
  }
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


// ----------------------------------------------
// 
// > ﾓﾊﾞｲﾙ端末では次矢印のｸﾘｯｸ及び横ｽｸﾛｰﾙ、pc端末では次矢印のｸﾘｯｸのみで発火する
// ----------------------------------------------
function slideManage() {
  const slideAnimDuration  = 21.6;
  const slideAnimName      = "fade-in-out";
  const slideFadeinoutTime = 0.4;

  const slideCnt       = $(".js-slide").length;
  const maxSlideIx     = slideCnt - 1;
  const maxZIndex      = maxSlideIx;
  let   showSlideIx    = 0;
  let   isWait         = false;
  let   slideDelayList = [];

  // 総再生時間、ｽﾗｲﾄﾞ枚数、変化時間、から keyframes を作成
  const $style = $("<style>").text(`
    @keyframes ${slideAnimName} {
      from { opacity: 1; }
      ${(slideAnimDuration / slideCnt - slideFadeinoutTime) / slideAnimDuration * 100}% { opacity: 1; }
      ${slideAnimDuration / slideCnt / slideAnimDuration * 100}% { opacity: 0; }
      ${(slideAnimDuration - slideFadeinoutTime) / slideAnimDuration * 100}% { opacity: 0 }
      to { opacity: 1; }
    }
    `);
  $("head").append($style);

  // 総再生時間 (slideAnimDuration) から、ｽﾗｲﾄﾞ1枚ごとの遅延時間を取得
  const delay = slideAnimDuration / slideCnt;
  for (let i = 0; i <= maxSlideIx; i++) {
    slideDelayList.push(delay * i);
  }

  setAgainSlide();

  // ﾓﾊﾞｲﾙ端末の場合のみ横ｽｸﾛｰﾙで発火
  if (g_userDevice == "mobile") {
    let touchStartX = 0;
    let touchStartY = 0;

    $(".slider").on("touchstart", function(eStart) {
      isWait = false;
      touchStartX = eStart.touchs[0].clientX;
      touchStartY = eStart.touchs[0].clientY;
    });

    $(".slider").on("touchmove", function(eMove) {
      if (isWait) return;
      isWait = true;

      const diffX = eMove.touches[0].clientX - touchStartX;
      const diffY = eMove.touches[0].clientY - touchStartY;

      // 横ｽｸﾛｰﾙ量 < 縦ｽｸﾛｰﾙ量 の場合は、縦ｽｸﾛｰﾙとみなし処理しない
      if (Math.abs(diffX) < Math.abs(diffY)) return;
      
      if (diffX < 0) {
        showSlideIx += 1;
        if (showSlideIx > maxSlideIx) showSlideIx = 0;
      }
      else {
        showSlideIx -= 1;
        if (showSlideIx < 0) showSlideIx = maxSlideIx;
      }

      setAgainSlide();
    });
  }

  // 端末問わず js-arrow (左右矢印) のｸﾘｯｸで発火
  $(".slider-admin").on("click", ".js-arrow", function() {
    if (isWait) return;
    isWait = true;

    const arrowDire = $(this).data("arrow");
    if (arrowDire == "left") {
      showSlideIx += 1;
      if (showSlideIx > maxSlideIx) showSlideIx = 0;
    }
    else if (arrowDire == "right") {
      showSlideIx -= 1;
      if (showSlideIx < 0) showSlideIx = maxSlideIx;
    }

    setAgainSlide();
  });

  // 端末問わず js-dot (魚ﾄﾞｯﾄ) のｸﾘｯｸで発火
  $(".slider-admin").on("click", ".js-dot", function() {
    if (isWait) return;
    isWait = true;

    showSlideIx = $(this).index();

    setAgainSlide();
  });


  // --------------------------------------------
  // js-slide ごとに showSlideIx に応じた animation (delay) と z-index 値を再ｾｯﾄする
  // > name:none とすると animation 値が初期化されるため、delay 以外も再ｾｯﾄする
  // --------------------------------------------
  function setAgainSlide() {
    const $slides = $(".js-slide");
    
    $slides.css({
      "animation-name"      : "none",
      "animation-play-state": "paused",
    });

    // 強制ﾘﾌﾛｰで none と paused を確定
    // → 強制ﾘﾌﾛｰがないと、同ﾌﾚｰﾑ内の animation 上書き = 変化なし とされ、none や paused が無効になる
    void $slides[0].offsetHeight;

    $.each(slideDelayList, function(i, delay) {
      let setSlideIx = showSlideIx + i;
      if (setSlideIx > maxSlideIx) setSlideIx -= (maxSlideIx + 1);

      $slides.eq(setSlideIx).css({
        "z-index"  : maxZIndex - i,
        "animation": `${slideAnimName} ${slideAnimDuration}s linear ${delay}s infinite`,
      });
    })

    setTimeout(() => {
      isWait = false;
    }, 200);
  }


  // --------------------------------------------
  // 
  // -------------------------------------------- 

}