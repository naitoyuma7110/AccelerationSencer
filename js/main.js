
let sensor_contents= document.getElementById("sensor_contents");
let output = document.getElementById('output');
let click = document.getElementById('click')
let number = 0;



sensor_contents.addEventListener("click", function(){
  number++;
  click.textContent = "click" + number;
  requestDeviceMotionPermission();
});

const requestDeviceMotionPermission = function(){
  if (
    DeviceMotionEvent &&
    typeof DeviceMotionEvent.requestPermission === 'function'
  ) {
    // iOS 13+ の Safari
    // 許可を取得
    DeviceMotionEvent.requestPermission()
    .then(permissionState => {
      if (permissionState === 'granted') {
        // 許可を得られた場合、devicemotionをイベントリスナーに追加
        window.addEventListener('devicemotion', e => {
          aX = dat.accelerationIncludingGravity.x;
          output.textContent = aX; 
        })
      } else {
        // 許可を得られなかった場合の処理
      }
    })
    .catch(console.error) // https通信でない場合などで許可を取得できなかった場合
  } else {
    output.textContent = "error";
  }
}

// ボタンクリックでrequestDeviceMotionPermission実行
const startButton = document.getElementById("sensor_contents");
startButton.addEventListener('click', requestDeviceMotionPermission, false);