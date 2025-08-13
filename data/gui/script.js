var gateway = `ws://${window.location.hostname}/ws`;
var websocket;

var data;
// Init web socket when the page loads
window.addEventListener('load', onload);

async function getData() {
    const url = `http://${window.location.hostname}/json2`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
  
      data= await response.json();

      //parseData(json);

      updateGUI();
      
    } catch (error) {
      console.error(error.message);
    }
  }

async function loadicon(icon,id){
    try {
        const response = await fetch("./res/"+icon);
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
        let s=await response.text()
        for(i=0;i<id.length;i++){
            document.getElementById(id[i]).innerHTML=s
        }
        
      } catch (error) {
        console.log("errorli");
        console.log(error);
      }
}

var isFS=false;
var tick=0;

/* When the openFullscreen() function is executed, open the video in fullscreen.
Note that we must include prefixes for different browsers, as they don't support the requestFullscreen method yet */
function toggleFullscreen() {
  
  if(isFS==true){
    if (document.exitFullscreen) {
        document.exitFullscreen();
    }else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    }else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
    }
    isFS=false;
  }else{
    var elem = document.documentElement;
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) { /* Safari */
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) { /* IE11 */
        elem.msRequestFullscreen();
      }
    isFS=true;
  }
}

function onload(event) {
    
    loadicon("bat0.svg",["bat0tico_t","bat0tico_v"]);
    loadicon("bat1.svg",["bat1tico_t","bat1tico_v"]);
    loadicon("chip.svg",["ico_ctrl_t"]);
    loadicon("ev_engine.svg",["ico_engine_t","warn_engine"]);
    loadicon("temp.svg",["warn_temp"]);
    loadicon("chip.svg",["ico_ctrl_t"]);
    loadicon("bt3.svg",["warn_bt"]);
    loadicon("indicator.svg",["leftIndicator","rightIndicator"]);
    loadicon("charger.svg",["warn_charger"]);
    loadicon("highbeam.svg",["warn_highbeam"]);

    speedmeter('sspeedcircle',270,7);
    speedmeter('spowercircle',240,8);
    speedmeter('sbattery0circle',240,11);
    speedmeter('sbattery1circle',240,11);

    getData();
    initWebSocket();
    ftime();

    document.getElementById("btwflogo").addEventListener("click", toggleFullscreen);

    setInterval(function() {
        if(tick==0){
            tick=1;
            document.getElementById("v_bat0_min_t").style.display='none';
            document.getElementById("v_bat0_max_t").style.display='inline';
            document.getElementById("v_bat0_minmax_t").innerHTML='&#x25B4;';

            document.getElementById("v_bat1_min_t").style.display='none';
            document.getElementById("v_bat1_max_t").style.display='inline';
            document.getElementById("v_bat1_minmax_t").innerHTML='&#x25B4;';
            
        }else{
            tick=0;
            document.getElementById("v_bat0_min_t").style.display='inline';
            document.getElementById("v_bat0_max_t").style.display='none';
            document.getElementById("v_bat0_minmax_t").innerHTML='&#x25BE;'

            document.getElementById("v_bat1_min_t").style.display='inline';
            document.getElementById("v_bat1_max_t").style.display='none';
            document.getElementById("v_bat1_minmax_t").innerHTML='&#x25BE;'
        }
        
    }, 3000);

    
}

//function getReadings(){
//    websocket.send("getReadings");
//}

function setBtIndicator(id,e,c){
    let t=document.querySelector("g#"+id+">text");
    let i=document.querySelector("g#"+id+">rect");

    let grp=document.getElementById(id);
    if(e){
        if(c){
            i.style.opacity="1.0";
            t.style.opacity="1.0";
            i.style.animation="none";
        }else{
            i.style.animation="pulse-animation 2s infinite";
            t.style.opacity="1.0";
        }

    }else{
        i.style.opacity="0.0";
        t.style.opacity="0.0";
        i.style.animation="none";
    }


}

function setBtLogo(ctrle,ctrlc,bms0e,bms0c,bms1e,bms1c){
    setBtIndicator("svg_btbms0",bms0e,bms0c);
    setBtIndicator("svg_btbms1",bms1e,bms1c);
    setBtIndicator("svg_btctrl",ctrle,ctrlc);

    if(bms0e && !bms0c ||bms1e && !bms1c ||ctrle && !ctrlc){
        document.getElementById("warn_bt").classList.add("bright");
    }else{
        // darken
        document.getElementById("warn_bt").classList.remove("bright");
    }
}


function initWebSocket() {
    console.log('Trying to open a WebSocket connection…');
    websocket = new WebSocket(gateway);
    websocket.onopen = onOpen;
    websocket.onclose = onClose;
    websocket.onmessage = onMessage;
}

// When websocket is established, call the getReadings() function
function onOpen(event) {
    console.log('Connection opened');
    //getReadings();
}

function onClose(event) {
    console.log('Connection closed');
    setTimeout(initWebSocket, 2000);
}

// Function that receives the message from the ESP32 with the readings

bat0_soc=0;
bat1_soc=0;

// function parseData(myObj){

//     let bat0=((myObj || {}).batteries || {})[0];
//     if(bat0!=undefined){

//         if(bat0.soc_perm != undefined){
//             bat0_soc=bat0.soc_perm/10.0;
//             document.getElementById("bat0_soc").innerHTML = bat0_soc;
//             document.getElementById("soc").innerHTML = (bat0_soc+bat1_soc)/2;
//         }

//         if(bat0.current_ma != undefined){
//          //   document.getElementById("xxxx").innerHTML = bat0.current_ma/1000.0;
//         }

//         if(bat0.enabled != undefined){
//             document.getElementById("bat0_temp").innerHTML = bat0.highest_temp;
//         }

//         if(bat0.volt_tot_mv != undefined){
//             document.getElementById("bat0_volt").innerHTML = bat0.volt_tot_mv/1000.0;
//         }

//         if(bat0.highest_temp != undefined){
//             document.getElementById("bat0_temp").innerHTML = bat0.highest_temp;
//         }
//     }

//     let ctrl=(myObj || {}).controller;
//     if(ctrl!=undefined){
//         //{"controller":{"cur_speed_kph":0,"brake_switch":false,"gear":1,"sliding_backwards":false,"motion":false}}
//         if(ctrl.cur_speed_kmh != undefined){
//             document.getElementById("speedometer").innerHTML = ctrl.cur_speed_kmh;
//             speedmeter((ctrl.cur_speed_kmh/150)*270.0)
//         }
//         if(ctrl.brake_switch != undefined && ctrl.gear != undefined){
//             let lbl="-";
//             if(ctrl.brake_switch==false){
//                 if(ctrl.gear==1){
//                     lbl="ECO";
//                 }else if(ctrl.gear==2){
//                     lbl="NORMAL";
//                 }else if(ctrl.gear==3){
//                     lbl="SPORT";
//                 }
//             }
//             document.getElementById("mode").innerHTML = lbl;
//         }
//         if(ctrl.engine_temp != undefined){
//             document.getElementById("engine_temp").innerHTML = ctrl.engine_temp;
//         }
//         if(ctrl.controller_temp != undefined){
//             document.getElementById("controller_temp").innerHTML = ctrl.controller_temp;
//         }
//     }
//  /*   for (var i = 0; i < keys.length; i++){
//         var key = keys[i];
//         document.getElementById(key).innerHTML = myObj[key];
//     }*/
// }

function updateE(id,val){
    document.getElementById(id).innerHTML = val;
}

function updateGUI(){

    setBtLogo(true,false,true,true,true,true);
    let d=data;
    updateE("v_engine_t",d["controller"]["engine_temp"]);
    //updateE("v_ctrl_t",d.controller.engine_temp);

    
    let lbl="--";
    if(d["controller"]["brake_switch"]!= undefined && d["controller"]["gear"] != undefined){
        if(d["controller"]["brake_switch"]==false){
            if(d["controller"]["gear"]==1){
                lbl="ECO";
            }else if(d["controller"]["gear"]==2){
                lbl="NORMAL";
            }else if(d["controller"]["gear"]==3){
                lbl="SPORT";
            }
        }
    }
    updateE("v_gear",lbl);


    updateE("v_speed",d["controller"]["cur_speed_kmh"]);
    speedmeter('speedcircle',Math.min(150,d["controller"]["cur_speed_kmh"])*270/150,7);

    let cpower=((d["batteries"][0]["volt_tot_mv"]/1000*d["batteries"][0]["current_ma"]/1000+d["batteries"][1]["volt_tot_mv"]/1000*d["batteries"][1]["current_ma"]/1000)/1000).toFixed(1);
    updateE("v_cur_power",cpower);
    if(cpower>=0){
        speedmeter('powercircle',(cpower/35)*120,12);
    }else{
        //maybe other scale for recurr?
        speedmeter('powercircle',(cpower/10)*120,12);
    }

    updateE("v_odo",d["other"]["odometer"]);
    updateE("v_trip",d["other"]["trip"]);
    updateE("v_range",d["other"]["range"]);

    let soc_tot=0.0;
    let bat_tot=0;
    if(d["batteries"][0]["enabled"]){
        updateE("v_bat0_soc",(d["batteries"][0]["soc_perm"]/10).toFixed(1)); 
        soc_tot+=d["batteries"][0]["soc_perm"]/10;
        bat_tot+=1;
        speedmeter('battery0circle',d["batteries"][0]["soc_perm"]*240/1000,11);
        updateE("v_bat0_v",(d["batteries"][0]["volt_tot_mv"]/1000).toFixed(1));
        updateE("v_bat0_min_t",d["batteries"][0]["lowest_temp"]);
        updateE("v_bat0_max_t",d["batteries"][0]["highest_temp"]);
    }

    if(d["batteries"][0]["enabled"]){
        //document.getElementById("#btbms0_ind"). = val;

        updateE("v_bat1_soc",(d["batteries"][1]["soc_perm"]/10).toFixed(1)); 
        soc_tot+=d["batteries"][1]["soc_perm"]/10;
        bat_tot+=1;
        speedmeter('battery1circle',d["batteries"][1]["soc_perm"]*240/1000,11);
        updateE("v_bat1_v",(d["batteries"][1]["volt_tot_mv"]/1000).toFixed(1));
        updateE("v_bat1_min_t",d["batteries"][1]["lowest_temp"]);
        updateE("v_bat1_max_t",d["batteries"][1]["highest_temp"]);
    }

    updateE("v_bat_soc",(soc_tot/bat_tot).toFixed(1)); 

    updateE("v_avg_energy",d["other"]["avg_consumption_whkm"])

}

function onMessage(event) {
    
    let d=JSON.parse(event.data);
    console.log(d);
    keys=d.ptr.split("/");
    //remove starting slash
    keys.splice(0,1);
    console.log(keys)
    tmp=data
    for(i=0;i<keys.length-1;i++){
        tmp=tmp[keys[i]]
    }
    console.log("VAL 2 b replaced"+tmp[keys[keys.length-2]])
    tmp[keys[keys.length-1]]=d["val"];
    updateGUI();
   // parseData();
}



function ftime() {
    var n = new Date(),
        h = n.getHours(),
        m = n.getMinutes(),
        s = n.getSeconds();
   
    document.getElementById('clock').innerHTML = h + '<span id="colon">:</span>' + (m<10?"0":"")+m ;
    document.querySelector('#clock>#colon').style.visibility=(s%2)?"hidden":"visible";
    setTimeout(ftime, 500);
  }

  

  // All calculations are within 'run' function.
 function speedmeter(id,angle,startoclock=0) {
    console.log("setting "+id)
    const circle = document.querySelector('#'+id);
    // 1. Get angle from input field.
    //let angle = parseFloat(input.value) || 0;
  
    // 2. Radius of SVG circle.
    // console.log(circle.getAttribute("r"));
    // console.log("realh: "+circle.getBoundingClientRect()['height'])
    // const radius = circle.getBoundingClientRect()['height']/2;
    // console.log("Radius="+radius);

    radius=circle.getAttribute("r");
    
    const circumference = 2 * Math.PI * radius;
    console.log("rad:"+radius+"u="+circumference)
    // 3. First, 1/4 of circumfence of 90 degrees. To start from top of the view,
    //    we must rotate it by 90 degrees. By default circle will start on the right.
    //    Stroke offset effectively rotates the circle.
    // 4. Second, calculate dash array. We need dash array containing only two parts -
    //    visible dash, and invisible dash.
    //    Visible dash should have length of the chosen angle. Full circle is 360 degrees,
    //    and this 360 degrees does also equal the entire circumference. We want just a part of
    //    this entire circle to be visible - (angle / 360 degrees) returns a percentage value
    //    (between 0.0 and 1.0) of how much circumference should be visible.
    //    Hence, we then multiply (angle / 360) times the entire circumference.
    const strokeOffset = (-(startoclock-3)/12) * circumference;
    const strokeDasharray = (angle / 360) * circumference;

    // 5. Set circle radius
    circle.setAttribute('r', radius);
    // 6. Create dash array of two elements (combined they must equal the entire circumference).
    //    First has the length of visible portion. Second, the remaining part.
    circle.setAttribute('stroke-dasharray', [
      strokeDasharray,
      circumference - strokeDasharray
    ]);
    // 7. (Optional) Rotate circle to start from the top.
    circle.setAttribute('stroke-dashoffset', strokeOffset);
  }