// ==UserScript==
// @name         naurok solve
// @version      0.1
// @description  Show answer for naurok
// @author       voytekhodaniil@gmail.com
// @include        https://naurok.ua/test/testing/*
// @include        https://naurok.com.ua/test/testing/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==
function getanswer(question){
    var req ={
        "session_id":14000000,
        "answer":["000000"],
        "question_id":String(question.id),
        "show_answer":1,
        "type":"quiz",
        "point":"0"
    };
    var xhr = new XMLHttpRequest();
    xhr.open('PUT', document.location.origin +'/api2/test/responses/answer',false);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify(req));
    var opt = JSON.parse(xhr.responseText).correct_options;
    var asnw1=[],answ2=[];
    for (let [key, value] of Object.entries(opt)) {
        if(value=="1"){
            asnw1.push(key);
            }
    }
    for (let [key, value] of Object.entries(question.options)) {
        for(let e in asnw1)
        if(value.id==asnw1[e]){
            answ2.push(value.value);
            }
    }

    return answ2;
}
var strt = 0;
async function start( addres){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', document.location.origin +'/test/testing/'+addres,false);
    xhr.send();

    if (xhr.status != 200) { // анализируем HTTP-статус ответа, если статус не 200, то произошла ошибка
         console.log(`Ошибка ${xhr.status}: ${xhr.statusText}`); // Например, 404: Not Found
        } ;
    var pos = xhr.responseText.search('ng-init');
    var subsm = xhr.responseText.substring(pos+14,pos+45);
    var arr = JSON.parse("["+subsm.substring(0,subsm.indexOf(')'))+"]");
    xhr = new XMLHttpRequest();

    xhr.open('GET', document.location.origin + '/api2/test/sessions/'+arr[1],false);
    xhr.send();

    if (xhr.status != 200) { // анализируем HTTP-статус ответа, если статус не 200, то произошла ошибка
        console.log(`Ошибка ${xhr.status}: ${xhr.statusText}`); // Например, 404: Not Found
    }
    var questions = JSON.parse(xhr.responseText).questions;
    var answl=[];
    for(let [key, value] of Object.entries(questions))
        answl.push(getanswer(value));
 
    document.answers = answl;
   setTimeout(function() { impacttt(); }, 1000);}
function impacttt(){
if(strt==0){
    strt=+document.getElementsByClassName("currentActiveQuestion ")[0].innerText
}
        for(var y in document.answers[document.getElementsByClassName("currentActiveQuestion ")[0].innerText-strt]){
        for(var e =0;e<document.getElementsByClassName("question-option-inner").length;++e){
            var firstp = document.getElementsByClassName("question-option-inner")[e].innerHTML.search("<p>");
            var pall  =  document.getElementsByClassName("question-option-inner")[e].innerHTML.substring(firstp);
            var secondp = pall.search("</p>")+4;
            var answ = pall.substring(0,secondp);
           // console.log(document.answers[document.getElementsByClassName("currentActiveQuestion ")[0].innerText-strt][y].replace(/&nbsp;/gi,' ').replace(/\s+/g, "")==answ.replace(/&nbsp;/gi,' ').replace(/\s+/g, ""));
                if(document.answers[document.getElementsByClassName("currentActiveQuestion ")[0].innerText-strt][y].replace(/&nbsp;/gi,' ').replace(/\s+/g, "")==answ.replace(/&nbsp;/gi,' ').replace(/\s+/g, "")){
                    document.getElementsByClassName("question-option-inner")[e].style="color:white";
                  //console.log(document.getElementsByClassName("question-option-inner")[e]);
                }

           // document.getElementsByClassName("question-option-inner")[0].innerHTML .substring(document.getElementsByClassName("question-option-inner")[0].innerHTML.search("<p>")).search("</p>")

        
    }
}
}
document.addEventListener("click", function(){
        for(var t =0;t<document.getElementsByClassName("question-option-inner").length;++t){
        document.getElementsByClassName("question-option-inner")[t].style="color:black";
    }
    setTimeout(function() { impacttt(); }, 4500);

});
start(document.location.href.split("/")[5]);
