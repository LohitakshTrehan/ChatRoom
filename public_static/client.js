/**
 * Created by lohitakshtrehan on 14/07/17.
 */
let socket = io();
$(function () {
    let naam = $('#name')
    let enterchat = $('#enterchat')
    let newmsg = $('#newmsg')
    let sendmsg = $('#sendmsg')
    let msglist = $('#msglist')
    let first = $('#first')
    let second = $('#second')
    let third = $('#third')
    let see = $('#see')
    let onlinelist = $('#online')
    let backbutton = $('#back')
    let logout  = $('#logout')
    let true_name='';
    second.css('display','none')
    third.css('display','none')
    if (sessionStorage.getItem('username')) {
        first.css('display', 'none')
        second.css('display', 'block')
        socket.emit('new_user', sessionStorage.getItem('username'))
        true_name=sessionStorage.getItem('username');
    }

    see.click(function () {
        second.css('display','none')
        socket.emit('who_is_on',null)
        third.css('display', 'block')
    })

    backbutton.click(function () {
        second.css('display', 'block')
        third.css('display', 'none')
    })

    enterchat.click(function () {
        //logout button should delete session storage and then reload the page index.html
        socket.connect()
        if(naam.val().length) {
            true_name=naam.val();
            sessionStorage.setItem('username', true_name)
            socket.emit('new_user', true_name)
            first.css('display', 'none')
            second.css('display', 'block')
        }
        else {
            window.alert("Name field cant be empty")
        }
    })


    logout.click(function () {
        disconnect();
    })


    socket.on('old_records', (data) => {
        console.log(data)
        msglist.empty();
        for(index in data){
            if(data[index].to.individual==false){
                console.log("false waala");
                msglist.append($(`<li>${data[index].msg}</li>`))
            }
            else{
                if(data[index].to.indi_room==true_name)
                    msglist.append($(`<li>${data[index].msg}</li>`))
            }
        }
    })

    sendmsg.click(function () {
        socket.emit('new_message', newmsg.val())
    })



    socket.on('recv_message', (data) => {
        msglist.append($(`<li>${data}</li>`))
    })


    socket.on('empty_room',(data) => {
        window.alert("Msg can start with '@' only if you want to send it to a room");
    })

    socket.on('list_online',(data) =>{
        onlinelist.empty();
        for(index in data)
        {
            onlinelist.append($(`<li>${data[index].room_name}</li>`))
        }
    })


    //write a disconnect event here
    function disconnect() {
        console.log("client disconnect");
        second.css('display','none')
        //session storage delete
        sessionStorage.removeItem('username')
        socket.emit('force_disconnect',null)
        first.css('display','block')
    }


})