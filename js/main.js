

const sensor_contents= document.getElementById("sensor_contents");
const output = document.getElementById('output');
const time = document.getElementById("time");
const result1 = document.getElementById("result_acc");
const result2 = document.getElementById("result_gyro");
let datalist = [];
let number = 0;

window.onload=function(){
  if(!localStorage) {
  alert('ローカルストレージに対応していない');
  }
  // セッションストレージ対応判定
  if(!sessionStorage) {
  alert('セッションストレージに対応していない');
    }
  }
  
  //ローカルストレージを削除
  function removeConfig(){
    localStorage.clear();
    alert("削除しました");
  }

const requestDeviceMotionPermission = function(){
  console.log("click");
  localStorage.setItem('test', 'testvalue');

  if (
    DeviceMotionEvent &&
    typeof DeviceMotionEvent.requestPermission === 'function'
  ) {
    // iOS 13+
    // 許可を取得
    DeviceMotionEvent.requestPermission()
    .then(permissionState => {
      if (permissionState === 'granted') {
        // devicemotionをイベントリスナーに追加
        window.addEventListener('devicemotion', e => {
          
          // 時間の取得
          var date = new Date();
          var time_unix = date.getTime();


          // 加速度センサー値の取得
          var x = event.accelerationIncludingGravity.x;
          var y = event.accelerationIncludingGravity.y;
          var z = event.accelerationIncludingGravity.z;
          
          //データの保持
          let acc = {acc_x:x,acc_y:y,acc_z:z};
          datalist.push(acc);

          //ローカルストレージに記録
          localStorage.setItem(time_unix, JSON.stringify(datalist));

          // 値の表示
          time.innerHTML = "time:" + time_unix;
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
sensor_contents.addEventListener('click', requestDeviceMotionPermission, false);
