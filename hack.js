// ==UserScript==
// @name         Youtube Automatic Theme
// @version      0.1
// @description  Show answer for naurok.com.ua
// @author       voytekhodaniil@gmail.com
// @match        https://naurok.com.ua/test/testing/*
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
    xhr.open('PUT', 'https://naurok.com.ua/api2/test/responses/answer',false);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify(req));
    var opt = JSON.parse(xhr.responseText).correct_options;
    var asnw;
    for (let [key, value] of Object.entries(opt)) {
        if(value=="1"){
            asnw=key;
            break;}
    }
    for (let [key, value] of Object.entries(question.options)) {
        if(value.id==asnw){
            asnw=value;
            break;}
    }
    return asnw.value;
}
async function start( addres){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://naurok.com.ua/test/testing/'+addres,false);
    xhr.send();

    if (xhr.status != 200) { // анализируем HTTP-статус ответа, если статус не 200, то произошла ошибка
         console.log(`Ошибка ${xhr.status}: ${xhr.statusText}`); // Например, 404: Not Found
        } 
    var pos = xhr.responseText.search('ng-init');
    var subsm = xhr.responseText.substring(pos+14,pos+45);
    var arr = JSON.parse("["+subsm.substring(0,subsm.indexOf(')'))+"]");
    var xhr = new XMLHttpRequest();

    xhr.open('GET', 'https://naurok.com.ua/api2/test/sessions/'+arr[1],false);
    xhr.send();

    if (xhr.status != 200) { // анализируем HTTP-статус ответа, если статус не 200, то произошла ошибка
        console.log(`Ошибка ${xhr.status}: ${xhr.statusText}`); // Например, 404: Not Found
    }
    var questions = JSON.parse(xhr.responseText).questions;    
    var answl=[];
    for(let [key, value] of Object.entries(questions))
        answl.push(getanswer(value));
    console.log(answl);
}
start("88f92d71-7192-4ff4-af6b-e14fab0a4921")
