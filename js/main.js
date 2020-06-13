
// HTML要素の取得
const sensor_contents= document.getElementById("sensor_contents");
const sensor_start= document.getElementById("sensor_start");
const output = document.getElementById('output');
const time = document.getElementById("time");
const result1 = document.getElementById("result_acc");
const result2 = document.getElementById("result_gyro");

// 加速度センサー値
let x = 0;
let y = 0;
let z = 0;

// ジャイロセンサー値
let alpha = 0;
let beta = 0;
let gamma = 0;

let firstdate;
let firsttime;
let datalist = [];


// アクセス許可を求めデバイスモーションセンサーを起動
const requestDeviceMotionPermission = function(){
  // デバイスにセンサー機能が実装されているか判定
  if (
    DeviceMotionEvent &&
    typeof DeviceMotionEvent.requestPermission === 'function'
  ) {
    // iOS 13以降はユーザーのアクセス許可が必要
    // ボタンクリックで許可を取得
    DeviceMotionEvent.requestPermission()
    .then(permissionState => {
      if (permissionState === 'granted') {
        // devicemotionをイベントリスナーに追加
        // 加速度センサーの起動
        window.addEventListener('devicemotion', e => {

          // 重力加速度値の取得
          // x = event.accelerationIncludingGravity.x;
          // y = event.accelerationIncludingGravity.y;
          // z = event.accelerationIncludingGravity.z;

          // 重力加速度を除いた加速度値
          x = event.acceleration.x;
          y = event.acceleration.y;
          z = event.acceleration.z;

          // センサー値の表示
          result1.innerHTML = "重力加速度<br />"+
          "X：" + x.toFixed(2) +"(m/s^2)<br />" +
          "Y：" + y.toFixed(2) +"(m/s^2)<br />" + 
          "Z：" + z.toFixed(2) +"(m/s^2)<br />";
        });

        // deviceorientationをイベントリスナーの追加
        // ジャイロセンサーを起動
        window.addEventListener( "deviceorientation", e => {

          // ジャイロセンサー値取得
          alpha = event.alpha;
          beta = event.beta;
          gamma = event.gamma;

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

//クリックでデバイスセンサーのアクセス承認を実行
sensor_contents.addEventListener('click', requestDeviceMotionPermission, false);


// クリックで計測データの保存開始
sensor_start.addEventListener("click", function(){

  // 測定開始時間の取得
  firstdate = new Date();
  firsttime = firstdate.getTime();

  // 計測データの変数保存開始
  window.setInterval(() => {
    // 測定経過時間の取得
    let date = new Date();
    let time_unix = date.getTime() - firsttime;
    // 経過時間下一桁切り捨て10ms単位
    time_unix = Math.round(time_unix/10)/100;
    //データを配列で保持 array = [ [...], [...], ...]
    let acc_gyro = [time_unix, x, y, z, alpha, beta, gamma];
    datalist.push(acc_gyro);
  
    // 測定経過時間の表示
    time.textContent = "TIME:" + time_unix;
    console.log("action");
  }, 10); //10ms（0.01秒）毎に実行 
})



download.addEventListener("click", function(){
  // デバッグ用ダミー計測値
  
  // acc_gyro = [1,3,2,-2,5,2,1];
  // datalist.push(acc);
  
  // acc_gyro = [2,2,5,9,35,4,];
  // datalist.push(acc);
  
  // acc_gyro = [3,1,-2,2,12,6,6];
  // datalist.push(acc);
  
  // acc_gyro = [4,-3,-2,5,2,6,4];
  // datalist.push(acc);
  // console.log(datalist);
  
  // datalist = [
  //   [1, 1, 2, 3, 3, 4, 3],
  //   [2, 3, 2, 4, 8, 6, 7],
  //   [3, 5, 3, -5, 6, 7, 9]
  // ];

  // CSV用配列 csvData = [time, x, y, z, '\n', time, x, y, ...]
  let csvData = ["time(sec)", "x", "y", "z", "alpha", "beta", "gamma", '\n'];
  for (let i = 0; i < datalist.length; i++) {
    let row = Object.values(datalist[i]).join(',');
    csvData += row + '\n';
    }
  // console.log(csvData);

  // Downloadボタンでcsv出力
  let blob = new Blob([csvData],{type:"text/csv"});
  let link = document.getElementById("download");
  link.href = URL.createObjectURL(blob);
  link.download = 'センサー計測値.csv';
})

