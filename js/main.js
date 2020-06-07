
let sensor_contents= document.getElementById("sensor_contents");
let output = document.getElementById('output');
let click = document.getElementById('click');
let result1 = document.getElementById("result_acc");
let result2 = document.getElementById("result_gyro");
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
    // iOS 13+
    // 許可を取得
    DeviceMotionEvent.requestPermission()
    .then(permissionState => {
      if (permissionState === 'granted') {
        // 許可を得られた場合、devicemotionをイベントリスナーに追加
        window.addEventListener('devicemotion', e => {
          var x = event.accelerationIncludingGravity.x;
          var y = event.accelerationIncludingGravity.y;
          var z = event.accelerationIncludingGravity.z;
          
          result1.innerHTML = "重力加速度<br />"+
          "X：" + x.toFixed(2) +"(m/s^2)<br />" +
          "Y：" + y.toFixed(2) +"(m/s^2)<br />" + 
          "Z：" + z.toFixed(2) +"(m/s^2)<br />";
        });

        window.addEventListener( "deviceorientation", e => {
          var alpha = event.alpha;
          var beta = event.beta;
          var gamma = event.gamma;
    
          result2.innerHTML = "ジャイロセンサー<br />" +
            "alpha：" + alpha.toFixed(2) +"°<br />" +
            "beta ：" + beta.toFixed(2)  +"°<br />" + 
            "gamma：" + gamma.toFixed(2) +"°<br />";
        }, false);
      } else {
        output.textContent = "Not Accept";
      }
    })
    .catch(console.error) // https通信でない場合などで許可を取得できなかった場合
  } else {
    output.textContent = "Error";
  }
}

// ボタンクリックでrequestDeviceMotionPermission実行
const startButton = document.getElementById("sensor_contents");
startButton.addEventListener('click', requestDeviceMotionPermission, false);