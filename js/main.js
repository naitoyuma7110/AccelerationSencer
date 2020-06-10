
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

const requestDeviceMotionPermission = function(){
  // 計測開始時間を保持
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
          
          // 計測中の経過時間を取得
          var date_acc = new Date();
          var time_unix_acc = date_acc.getTime() - firsttime_acc;

          // 加速度センサー値の取得
          var x = event.accelerationIncludingGravity.x;
          var y = event.accelerationIncludingGravity.y;
          var z = event.accelerationIncludingGravity.z;
          
          //データを配列で保持 array = [ [...], [...], ...]
          let acc = [time_unix_acc, x, y, z];
          datalist_acc.concat(acc);

          // 値の表示
          time.innerHTML = "加速度センサー時間:" + time_unix_acc.toFixed(2);
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
          let gyro = [time_unix_zyro, alpha, beta, gamma];
          datalist_zyro.concat(gyro);

          
          // 値の表示
          time2.innerHTML = "ジャイロセンサー時間：" + time_unix_zyro.toFixed(2);
          result2.innerHTML = "ジャイロセンサー<br />" +
            "alpha：" + alpha.toFixed(2) +"°<br />" +
            "beta ：" + beta.toFixed(2)  +"°<br />" + 
            "gamma：" + gamma.toFixed(2) +"°<br />";
        }, false);
      } else {
        // センサーアクセス許可が得られなかった場合
        output.textContent = "Not Accept";
      }
    })
    .catch(console.error) 
  } else {
    // https通信でない場合などで許可を取得できなかった場合
    output.textContent = "Error";
  }
}

//クリックでアクセス許可、計測、保存、表示を実行
sensor_contents.addEventListener('click', requestDeviceMotionPermission, false);

download.addEventListener("click", function(){
  // デバッグ用ダミー計測値
  // datalist_acc = [
  //   [1, 1, 2, 3],
  //   [2, 3, 2, 4],
  //   [3, 5, 3, -5]
  // ];

  // CSV用配列  array = [time, x, y, z, '\n', time, x, y, ...]
  let csvData = ["time", "x", "y", "z", '\n'];
  for (let i = 0; i < datalist_acc.length; i++) {
    let row = Object.values(datalist_acc[i]).join(',');
    csvData += row + '\n';
    }
  // console.log(csvData);

  // Downloadボタンでcsv出力
  let blob = new Blob([csvData],{type:"text/csv"});
  let link = document.getElementById("download");
  link.href = URL.createObjectURL(blob);
  link.download = '作ったファイル.csv';

})
