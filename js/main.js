

const sensor_contents= document.getElementById("sensor_contents");
const output = document.getElementById('output');
const time = document.getElementById("time");
const time2 = document.getElementById("time2");
const result1 = document.getElementById("result_acc");
const result2 = document.getElementById("result_gyro");
let firstdate = new Date();
let firsttime = firstdate.getTime();
let datalist = [];
let number = 0;


//ローカルストレージを削除
window.onload = function(){
  localStorage.clear();
  alert("ローカルストレージをリセット");
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
          var time_unix = date.getTime() - firsttime;


          // 加速度センサー値の取得
          var x = event.accelerationIncludingGravity.x;
          var y = event.accelerationIncludingGravity.y;
          var z = event.accelerationIncludingGravity.z;
          
          //データの保持
          let acc = {acc_x:x,acc_y:y,acc_z:z};
          datalist.push(acc);

          //ローカルストレージに記録("時間", "加速度")
          localStorage.setItem(time_unix, JSON.stringify(datalist));

          // 値の表示
          time.innerHTML = "time:" + time_unix;
          result1.innerHTML = "重力加速度<br />"+
          "X：" + x.toFixed(2) +"(m/s^2)<br />" +
          "Y：" + y.toFixed(2) +"(m/s^2)<br />" + 
          "Z：" + z.toFixed(2) +"(m/s^2)<br />";
        });

        window.addEventListener( "deviceorientation", e => {

          // 時間の取得
          var date2 = new Date();
          var time_unix2 = date.getTime() - firsttime;

          var alpha = event.alpha;
          var beta = event.beta;
          var gamma = event.gamma;
    
          // //データの保持
          // let gyro = {al:alpha,be:beta,ga:gamma};
          // datalist.push(gyro);

          // //ローカルストレージに記録("時間", "加速度")
          // localStorage.setItem(time_unix2, JSON.stringify(datalist));

          time2.innerHTML = "ジャイロセンサー時間" + time_unix2;

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
