
const sensor_contents= document.getElementById("sensor_contents");
const output = document.getElementById('output');
const time = document.getElementById("time");
const time2 = document.getElementById("time2");
const result1 = document.getElementById("result_acc");
const result2 = document.getElementById("result_gyro");
let firstdate_acc;
let firsttime_acc;
let firstdate_zyro;
let firsttime_zyro;
let datalist_acc = [];
let datalist_zyro = [];
let number = 0;


//ローカルストレージを削除
window.onload = function(){
  localStorage.clear();
  alert("ローカルストレージをリセット");
  }


const requestDeviceMotionPermission = function(){
  console.log("click");
  firstdate_acc = new Date();
  firsttime_acc = firstdate_acc.getTime();
  firstdate_zyro = new Date();
  firsttime_zyro = firstdate_zyro.getTime();

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
          var date_acc = new Date();
          var time_unix_acc = date_acc.getTime() - firsttime_acc;


          // 加速度センサー値の取得
          var x = event.accelerationIncludingGravity.x;
          var y = event.accelerationIncludingGravity.y;
          var z = event.accelerationIncludingGravity.z;
          
          //データの保持
          let acc = {acc_x:x,acc_y:y,acc_z:z};
          datalist_acc.push(acc);

          //ローカルストレージに記録("時間", "加速度")
          localStorage.setItem(time_unix_acc, JSON.stringify(datalist_acc));

          // 値の表示
          time.innerHTML = "time:" + time_unix_acc;
          result1.innerHTML = "重力加速度<br />"+
          "X：" + x.toFixed(2) +"(m/s^2)<br />" +
          "Y：" + y.toFixed(2) +"(m/s^2)<br />" + 
          "Z：" + z.toFixed(2) +"(m/s^2)<br />";
        });

        window.addEventListener( "deviceorientation", e => {

          // 時間の取得
          var date_zyro = new Date();
          var time_unix_zyro = date_zyro.getTime() - firsttime_zyro;

          // ジャイロセンサー値取得
          var alpha = event.alpha;
          var beta = event.beta;
          var gamma = event.gamma;
    
          //データの保持
          let gyro = {al:alpha,be:beta,ga:gamma};
          datalist_zyro.push(gyro);

          //ローカルストレージに記録("時間", "加速度")
          localStorage.setItem(time_unix_zyro, JSON.stringify(datalist_zyro));

          time2.innerHTML = "ジャイロセンサー時間" + time_unix_zyro;

          // 値の表示
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
