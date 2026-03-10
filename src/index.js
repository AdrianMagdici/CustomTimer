//get info
let value1 = Number(document.getElementById("hour").value);
let value2 = Number(document.getElementById("minute").value);
let content_display = document.getElementById("content");   //menu
let clock_text = document.getElementById("clocktext");      //timer text
let type = document.getElementById("selector").value;       //SW|CD
let format = document.getElementById("formatter").value;    //hr:min:s | min:s.ms
//other stuff
let startTime = 0;
let elapsedTime = 0;
const clamp = (val, min, max) => Math.min(Math.max(val, min), max);
//no need to work here
function changetype() {type = document.getElementById("selector").value;}
function changeinfo() {
    format = document.getElementById("formatter").value;
    if (format == "hr:min:s") {
        value1 = clamp(Number(document.getElementById("hour").value),0,23);
        document.getElementById("hourtext").innerHTML = "hr";
        document.getElementById("mintext").innerHTML = "min";
        document.getElementById("format1").innerHTML = "hr";
        document.getElementById("format2").innerHTML = "min";
        document.getElementById("format3").innerHTML = "sec";
    } else {
        value1 = clamp(Number(document.getElementById("hour").value),0,59);
        document.getElementById("hourtext").innerHTML = "min";
        document.getElementById("mintext").innerHTML = "s";
        document.getElementById("format1").innerHTML = "min";
        document.getElementById("format2").innerHTML = "sec";
        document.getElementById("format3").innerHTML = "ms";
    }
    value2 = clamp(Number(document.getElementById("minute").value),0,59);
    document.getElementById("hour").value = value1;
    document.getElementById("minute").value = value2;
}
changeinfo();
function timeToString(format, elapsedTime) {
    if(type == "SW") {
        if(format == "min:s.ms"){ //SW - min:s.ms
            let mins = Math.floor(((value1*60000+value2*1000+elapsedTime) % 3600000) / 60000);
            let secs = Math.floor(((value2*1000+elapsedTime) % 60000) / 1000);
            let ms = Math.floor((elapsedTime) % 1000);
            return (String(mins).padStart(2,'0') + ":" + String(secs).padStart(2,'0') + "." + String(ms).padStart(3,'0'));
        } 
        else{ //SW - hr:min:s
            let hrs = Math.floor(((elapsedTime+value1*3600000+value2*60000) % 86400000)/3600000);
            let mins = Math.floor(((elapsedTime+value2*60000) % 3600000) / 60000);
            let secs = Math.floor((elapsedTime % 60000) / 1000);    
            return (String(hrs).padStart(2,'0') + ":" + String(mins).padStart(2,'0') + ":" + String(secs).padStart(2,'0'));
        }
    }
    else {
        if(format == "min:s.ms"){ //CD - min:s.ms
            if(elapsedTime < value1*60000+value2*1000) {
                document.getElementById("formatter2").style.overflow = "visible";
                let mins = Math.floor((((((value1*60000+value2*1000)-elapsedTime) % 3600000)+3600000)%3600000)/ 60000);
                let secs = Math.floor((((((value2*1000)-elapsedTime) % 60000)+60000)%60000) / 1000);
                let   ms = Math.floor((((1000-elapsedTime) % 1000)+1000)%1000);
                return (String(mins).padStart(2,'0') + ":" + String(secs).padStart(2,'0') + "." + String(ms).padStart(3,'0'));
            } else {
                document.getElementById("formatter2").style.overflow = "hidden";
                return ("Time's up!");
            }
        }
        else{ //CD - hr:min:s
            if(elapsedTime < value1*3600000+value2*60000) {
                document.getElementById("formatter2").style.overflow = "visible";
                let  hrs = Math.floor((((((value1*3600000+value2*60000)-elapsedTime) % 86400000) + 86400000 ) % 86400000) /3600000);
                let mins = Math.floor((((((value2*60000)-elapsedTime) % 3600000) + 3600000) % 3600000) / 60000);
                let secs = Math.floor(((((60000-elapsedTime) % 60000) + 60000 ) % 60000) / 1000);
                return (String(hrs).padStart(2,'0') + ":" + String(mins).padStart(2,'0') + ":" + String(secs).padStart(2,'0'));
            } else {
                document.getElementById("formatter2").style.overflow = "hidden";
                return ("Time's up!");
            }
        }
    }
}
function SubmitTimer() {
    //switch contents
    content_display.style.display = "none";
    document.getElementById("clock").style.display = "block";
    clock_text.style.fontSize = "15em";
    if (document.getElementById("glower").checked) {
    clock_text.style.textShadow = "text-shadow: 0 0 5px #FFF, 0 0 10px #FFF, 0 0 15px #FFF, 0 0 20px var(--text), 0 0 30px var(--text), 0 0 40px var(--text), 0 0 55px var(--text), 0 0 75px var(--text), 2px 2px 2px rgba(206,206,206,0);";
    } else {clock_text.style.textShadow = "none"}
    startTime = performance.now() - elapsedTime;
    clock_text.innerHTML = timeToString(format, elapsedTime);
    format=="min:s.ms" ? increment=10 : increment=1000;
    setInterval(() => {
        elapsedTime = performance.now() - startTime;
        clock_text.innerHTML = timeToString(format, elapsedTime);
        document.title = "🌠"+timeToString(format, elapsedTime)+"🌠";
    }, increment);
}