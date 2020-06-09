
const sensor_contents= document.getElementById("sensor_contents");
const output = document.getElementById('output');
const time = document.getElementById("time");
const time2 = document.getElementById("time2");
const result1 = document.getElementById("result_acc");
const result2 = document.getElementById("result_gyro");
const storage = document.getElementById("storage");
const list = document.getElementById("list");

let firstdate_acc;
let firsttime_acc;
let firstdate_gyro;
let firsttime_gyro;
let datalist_acc = [];
let datalist_gyro = [];
let number = 0;


//ローカルストレージを削除
window.onload = function(){
  localStorage.clear();
  alert("ローカルストレージをリセット");
  }

// ローカルストレージの表示


const requestDeviceMotionPermission = function(){
  // デバッグ用ストレージデータ保存
  // number++;
  // localStorage.setItem(number, number);
  // localStorage.setItem("acc_xyz", JSON.stringify({valuex:1, valuey:4, valuez:13}));

  // 測定開始時間を保持
  firstdate_acc = new Date();
  firsttime_acc = firstdate_acc.getTime();
  firstdate_gyro = new Date();
  firsttime_gyro = firstdate_gyro.getTime();

  if (
    DeviceMotionEvent &&
    typeof DeviceMotionEvent.requestPermission === 'function'
  ) {
    // iOS 13+
    // センサーアクセス許可を取得
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

          //ローカルストレージに記録("時間", "加速度")  JSON型
          localStorage.setItem(time_unix_acc, JSON.stringify(acc));

          // 値の表示
          time.innerHTML = "time:" + time_unix_acc;
          result1.innerHTML = "重力加速度<br />"+
          "X：" + x.toFixed(2) +"(m/s^2)<br />" +
          "Y：" + y.toFixed(2) +"(m/s^2)<br />" + 
          "Z：" + z.toFixed(2) +"(m/s^2)<br />";
        });

        window.addEventListener( "deviceorientation", e => {

          // 時間の取得
          var date_gyro = new Date();
          var time_unix_gyro = date_gyro.getTime() - firsttime_gyro;

          // ジャイロセンサー値取得
          var alpha = event.alpha;
          var beta = event.beta;
          var gamma = event.gamma;
    
          //データの保持
          let gyro = {al:alpha,be:beta,ga:gamma};

          //ローカルストレージに記録("時間", "ジャイロ")  JSON型
          localStorage.setItem(time_unix_gyro, JSON.stringify(gyro));

          time2.innerHTML = "ジャイロセンサー時間" + time_unix_gyro;

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

// ストレージデータの表示
storage.addEventListener("click", function(){
  let finalArray = [];
  for(var i = 0; i < localStorage.length ; i++) {
    // デバッグ用
    // var localstragekey = localStorage.key(i);
    // var d = JSON.parse(localStorage.getItem(localstragekey));
    // let valueArray = [localstragekey, d.valuex, d.valuey, d.valuez];
    // finalArray = finalArray.concat(valueArray);

    var localstragekey = localStorage.key(i);
    var d = JSON.parse(localStorage.getItem(localstragekey));
    let valueArray =  [localstragekey, d.acc_x, d.acc_y, d.acc_z, d.al, d.be, d.ga];
    finalArray = finalArray.concat(valueArray);
  }
  
  let blob = new Blob([finalArray],{type:"text/csv"});
  let link = document.getElementById("download");
  link.href = URL.createObjectURL(blob);
  link.download = '作ったファイル.csv';

});