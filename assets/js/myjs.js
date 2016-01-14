/**
 * Created by fanzhang on 1/13/16.
 */


var myFBRef = new Firebase("https://wezonedb.firebaseio.com/");
var tableData;
var table_tableTools

$(function () {
    checkLogin();

    $('#btnRegister').on('click', function () {
        checkPass();
    });
    $('#logoutSys').on('click', function () {
        logout();
    });
    $('#resetPassSubmit').on('click', function () {
        resetPass();
    });
    $('#loginSystemSubmit').on('click', function () {
        var email = $('#login_username').val();
        var pass = $('#login_password').val();
        loginWith(email, pass);
    });

    $('#newASubmit').on('click', function () {
        popWait();
        var submitObj = {};
        var id = "agent-" + (new Date()).valueOf();
        submitObj.aName = $('#aName').val();
        submitObj.aWebsite = $('#aWebsite').val();
        submitObj.aAddress = $('#aAddress').val();
        submitObj.aPhone = $('#aPhone').val();
        submitObj.aEmail = $('#aEmail').val();
        submitObj.aContact = $('#aContact').val();
        submitObj.wbdName = $('#wbdName').val();
        submitObj.wbdEmail = $('#wbdEmail').val();
        submitObj.aPaymentInfo = $('#aPaymentInfo').val();
        submitObj.aPaymentMethod = $('#aPaymentMethod').val();
        //console.log(submitObj);
        var agentsRef = myFBRef.child("agents");
        agentsRef.child(id).set(submitObj, function (error) {
            if (error) {
                console.log("Data could not be saved." + error);
                alertM('啊哦，找张凡AS01');
            } else {
                console.log("Data saved successfully.");
                alertM('商户存储成功');
            }
        });
    });

    $('#eventSubmit').on('click', function () {
        popWait();
        var submitObj = {};
        var id = "event-" + (new Date()).valueOf();
        submitObj.eName = $('#eName').val();
        submitObj.eTime = $('#eTime').val();
        submitObj.eLocation = $('#eLocation').val();
        submitObj.ePrice = $('#ePrice').val();
        submitObj.eValue = $('#eValue').val();
        submitObj.eDue = $('#eDue').val();
        submitObj.eWriter = $('#eWriter').val();
        submitObj.eWriterContact = $('#eWriterContact').val();
        submitObj.ePubTime = $('#ePubTime').val();
        submitObj.eCatagory = $('#eCategory').val();
        //console.log(submitObj);
        var eventsRef = myFBRef.child("events");
        eventsRef.child(id).set(submitObj, function (error) {
            if (error) {
                console.log("Data could not be saved." + error);
                alertM('啊哦，找张凡ES01');
            } else {
                console.log("Data saved successfully.");
                alertM('活动存储成功');
            }
        });
    });

    if (myFBRef.getAuth() != null) {
        if (window.location.href.endsWith('events.html')) {
            loadAllEvents();
            if (table_tableTools == undefined) {
                DatatableEV();
            }
        } else if (window.location.href.endsWith('agents.html')) {
            loadAllAgents();
            if (table_tableTools == undefined) {
                DatatableAG();
            }
        }
    }
});

function loadAllAgents() {
    var ref = new Firebase("https://wezonedb.firebaseio.com/agents");
    ref.on("value", function (snapshot) {
        //console.log();
        //tableData = fbarr2dtarr(Obj2Arr(snapshot.val()));
        dataTableRedraw(table_tableTools, fbarr2dtarr(Obj2Arr(snapshot.val())));
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
        alertM('啊哦，找张凡DL01');
    });
}
function loadAllEvents() {
    var ref = new Firebase("https://wezonedb.firebaseio.com/events");
    ref.on("value", function (snapshot) {
        dataTableRedraw(table_tableTools, fbarr2dtarr(Obj2Arr(snapshot.val())));
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
        alertM('啊哦，找张凡DL01');
    });
}

function dataTableRedraw(theTable, theData) {
    theTable.clear().draw();
    theTable.rows.add(theData);
    theTable.columns.adjust().draw();
}

function DatatableAG() {
    var $dt_tableTools = $('#dt_tableTools');
    if ($dt_tableTools.length) {
        table_tableTools = $dt_tableTools.DataTable({
            data: tableData,
            columns: [
                {title: "地址"},
                {title: "联系人姓名"},
                {title: "Email"},
                {title: "名称"},
                {title: "支付信息"},
                {title: "支付方式"},
                {title: "BD联系人电话"},
                {title: "网站"},
                {title: "BD联系人Email"},
                {title: "BD联系人"}
            ]
        });

        var tt = new $.fn.dataTable.TableTools(table_tableTools, {
            "sSwfPath": "bower_components/datatables-tabletools/swf/copy_csv_xls_pdf.swf"
        });

        $(tt.fnContainer()).insertBefore($dt_tableTools.closest('.dt-uikit').find('.dt-uikit-header'));

        $body.on('click', function (e) {
            if ($body.hasClass('DTTT_Print')) {
                if (!$(e.target).closest(".DTTT").length && !$(e.target).closest(".uk-table").length) {
                    var esc = $.Event("keydown", {keyCode: 27});
                    $body.trigger(esc);
                }
            }
        })

    }
}
function DatatableEV() {
    var $dt_tableTools = $('#dt_tableTools');
    if ($dt_tableTools.length) {
        table_tableTools = $dt_tableTools.DataTable({
            data: tableData,
            columns: [
                {title: "分类"},
                {title: "结算时间"},
                {title: "地点"},
                {title: "名称"},
                {title: "零售价"},
                {title: "上线时间"},
                {title: "活动时间"},
                {title: "提成"},
                {title: "写手"},
                {title: "写手联系方式"}
            ]
        });

        var tt = new $.fn.dataTable.TableTools(table_tableTools, {
            "sSwfPath": "bower_components/datatables-tabletools/swf/copy_csv_xls_pdf.swf"
        });

        $(tt.fnContainer()).insertBefore($dt_tableTools.closest('.dt-uikit').find('.dt-uikit-header'));

        $body.on('click', function (e) {
            if ($body.hasClass('DTTT_Print')) {
                if (!$(e.target).closest(".DTTT").length && !$(e.target).closest(".uk-table").length) {
                    var esc = $.Event("keydown", {keyCode: 27});
                    $body.trigger(esc);
                }
            }
        })

    }
}

function checkLogin() {
    if (myFBRef.getAuth() == null) {
        if (!window.location.href.endsWith('login.html')) {
            window.location.href = "login.html";
        }
    }
}

function logout() {
    myFBRef.unauth();
}

function checkPass() {
    popWait();
    var name = $('#register_username').val();
    var pass = $('#register_password').val();
    var pass2 = $('#register_password_repeat').val();
    var email = $('#register_email').val();
    if (name.length > 0 && pass == pass2 && validateEmail(email)) {
        createUser(email, pass, name);
    } else {
        alertM('拜托输入一个靠谱的邮箱，真的要用的喔');
    }
}

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function createUser(email, password, name) {
    popWait();
    myFBRef.createUser({
        email: email,
        password: password
    }, function (error, userData) {
        if (error) {
            console.log("Error creating user:", error);
            alertM('去找张凡RE1');
        } else {
            console.log("Successfully created user account with uid:", userData.uid);
            myFBRef.authWithPassword({
                "email": email,
                "password": password
            }, function (error, authData) {
                myFBRef.child("users").child(userData.uid).set({
                    name: name,
                    email: email
                }, function (error) {
                    if (error) {
                        console.log("Data could not be saved." + error);
                        alertM('去找张凡RE2');
                    } else {
                        console.log("Data saved successfully.");
                        alertM('注册成功！耶~');
                        loginWith(email, password);
                    }
                });
            });
        }
    });
}

function loginWith(email, pass) {
    popWait();
    myFBRef.authWithPassword({
        "email": email,
        "password": pass
    }, function (error, authData) {
        if (error) {
            console.log("Login Failed!", error);
            if (error.code == "INVALID_EMAIL" || error.code == "INVALID_USER") {
                alertM('用户不存在，拜托输入一个靠谱的邮箱，真的要用的喔');
            } else if (error.code == "INVALID_PASSWORD") {
                alertM('密码错误');
            } else {
                alertM('去找张凡LG1');
            }
        } else {
            console.log("Authenticated successfully with payload:", authData);
            afterLogin();
        }
    });
}

function afterLogin() {
    window.location.href = "agents.html";
}

function resetPass() {
    popWait();
    var email = $('#login_email_reset').val();
    if (validateEmail(email)) {
        var ref = new Firebase("https://wezonedb.firebaseio.com/");
        ref.resetPassword({
            email: email
        }, function (error) {
            if (error === null) {
                console.log("Password reset email sent successfully");
                alertM('密码已经发给你的邮箱了');
            } else {
                console.log("Error sending password reset email:", error);
                alertM('拜托输入一个靠谱的邮箱，真的要用的喔');
            }
        });
    } else {
        alertM('拜托输入一个靠谱的邮箱，真的要用的喔');
    }
}

var modal;

function alertM(str) {
    if (modal != undefined) {
        modal.hide();
    }
    UIkit.modal.alert(str);
}

function popWait() {
    modal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>正在联络后台<br/><img class=\'uk-margin-top\' src=\'assets/img/spinners/spinner.gif\' alt=\'\'>');
}


function Obj2Arr(obj) {
    //Object to array, since Firebase has no array;
    if (obj != null) {
        //return Object.keys(obj).map(function (k) {
        //    return obj[k]
        //});
        var result = [];
        for (var i in obj)
            result.push({
                id: i,
                data: obj[i]
            });
        return result;
    } else {
        console.log("Error pharsing Obj");
    }
}

function fbarr2dtarr(fbarr) {
    if (fbarr != null) {

        var res = [];
        for (var i in fbarr) {
            var item = [];
            var des = Obj2Arr(fbarr[i].data);
            for (var j in des) {
                item.push(des[j].data);
            }
            res.push(item);
        }
        return res;
    } else {
        console.log("Error converting to arr!");
    }
}