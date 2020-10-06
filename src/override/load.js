//$(document).ready(function() {
    //$('#greeting').hide();
    $('.notification').css('display','inline-block').hide();
    $('.todoListNotification').css('display','inline-block').hide();
    //$('#welcome_newInstaller').hide();
    //$('#searchResults').hide();

    // payments begin
    var statusText = {
        upgrade: 'Upgrade',
        active: 'Active'
    };
    //getPurchases();
    chrome.storage.sync.get({ 'subscriptionActive': 'ACTIVE' }, function(result) {
        subscriptionActive = result.subscriptionActive;
    });

    var activeSubscriptions;
    var activeSubscriptionsSku;
    var userLoggedIn;
    var subscriptionActive;

    // payments end

    chrome.storage.sync.get({
        'customImage': false,
        'customColor': false,
        'customRandColor': false,
        'customRandImageAlbum': false,
        'customRandImage': true
    }, function(backgroundCheckedOptions) {
        document.getElementById('optionsCustomImage').checked = backgroundCheckedOptions.customImage;
        document.getElementById('optionsBackgroundColor').checked = backgroundCheckedOptions.customColor;
        document.getElementById('optionsRandomColor').checked = backgroundCheckedOptions.customRandColor;
        document.getElementById('optionsRandomImage').checked = backgroundCheckedOptions.customRandImage;
        document.getElementById("optionsAlbumImage").checked = backgroundCheckedOptions.customRandImageAlbum;

        chrome.storage.sync.get({ 'bgColorTextbox': "#345678" },
            function(saveBGTextbox) {
                document.getElementById('bgColor').value = saveBGTextbox.bgColorTextbox;
            });

        chrome.storage.sync.get({ 'imageTextbox': "http://i.imgur.com/oE1eyOw.jpg" },
            function(saveImageTextbox) {
                document.getElementById('customImageTextbox').value = saveImageTextbox.imageTextbox;
            });

        chrome.storage.sync.get({ 'albumTextarea': "http://i.imgur.com/s7LFIBo.jpg\nhttp://i.imgur.com/HXyY3vl.jpg" },
            function(saveAlbumTextarea) {
                document.getElementById('optionsAlbumImageTextarea').value = saveAlbumTextarea.albumTextarea;
            });

        if (document.getElementById('optionsRandomImage').checked) {
            randImage();
        } else if (document.getElementById('optionsCustomImage').checked) {
            chrome.storage.sync.get('imageTextbox', function(saveImageTextbox) {
                document.getElementById('customImageTextbox').value = saveImageTextbox.imageTextbox;
                setImage();
            });
            document.getElementById("customImageTextbox").disabled = false;
        } else if (document.getElementById('optionsBackgroundColor').checked) {
            chrome.storage.sync.get('bgColorTextbox', function(saveBGTextbox) {
                document.getElementById('bgColor').value = saveBGTextbox.bgColorTextbox;
                setColor();
            });
            document.getElementById("bgColor").disabled = false;
        } else if (document.getElementById('optionsRandomColor').checked) {
            randColor();
        } else if (document.getElementById("optionsAlbumImage").checked) {
            document.getElementById("optionsAlbumImageTextarea").disabled = false;
            chrome.storage.sync.get({ 'albumTextarea': "http://i.imgur.com/s7LFIBo.jpg\nhttp://i.imgur.com/HXyY3vl.jpg" },
                function(saveAlbumTextarea) {
                    document.getElementById('optionsAlbumImageTextarea').value = saveAlbumTextarea.albumTextarea;
                    randImageAlbum();
                });
        }
    });

    $(function() {
        $('#optionsRandomImage').click(function() {
            if (document.getElementById('optionsRandomImage').checked) {
                randImage();
                document.getElementById("customImageTextbox").disabled = true;
                document.getElementById("bgColor").disabled = true;
                document.getElementById("optionsAlbumImageTextarea").disabled = true;
            }
            saveBackground();
        });

        $('#optionsRandomColor').click(function() {
            if (document.getElementById('optionsRandomColor').checked) {
                randColor();
                document.getElementById("customImageTextbox").disabled = true;
                document.getElementById("bgColor").disabled = true;
                document.getElementById("optionsAlbumImageTextarea").disabled = true;
            }
            saveBackground();
        });

        $("#bgColor").keypress(function(e) {
            if (e.keyCode == 13) {
                setColor();
                var savebgcolor = document.getElementById("bgColor").value;
                chrome.storage.sync.set({ 'bgColorTextbox': savebgcolor });
            }
        });
        $("#customImageTextbox").keypress(function(e) {
            if (e.keyCode == 13) {
                setImage();
                var saveImage = document.getElementById("customImageTextbox").value;
                chrome.storage.sync.set({ 'imageTextbox': saveImage });
            }
        });
    });
    jQuery('#optionsAlbumImageTextarea').on('input propertychange paste', function() {
        var saveAlbumImage = document.getElementById("optionsAlbumImageTextarea").value;
        chrome.storage.sync.set({ 'albumTextarea': saveAlbumImage });
    });

    $('#optionsCustomImage').click(function() {
        if (document.getElementById('optionsCustomImage').checked) {
            document.getElementById("customImageTextbox").disabled = false;
            document.getElementById("bgColor").disabled = true;
            document.getElementById("optionsAlbumImageTextarea").disabled = true;
        }
        saveBackground();
    });
    $('#optionsBackgroundColor').click(function() {
        if (document.getElementById('optionsBackgroundColor').checked) {
            document.getElementById("bgColor").disabled = false;
            document.getElementById("customImageTextbox").disabled = true;
            document.getElementById("optionsAlbumImageTextarea").disabled = true;
        }
        saveBackground();
    });
    $('#optionsAlbumImage').click(function() {
        if (document.getElementById('optionsAlbumImage').checked) {
            document.getElementById("optionsAlbumImageTextarea").disabled = false;
            document.getElementById("bgColor").disabled = true;
            document.getElementById("customImageTextbox").disabled = true;
        }
        saveBackground();
    });

setTimeout(function() {

    chrome.storage.sync.get({
        'themeFile': '',
        'optionID': 'defaultTheme'
    }, function(setTheme) {
        $('<link/>', {
            rel: 'stylesheet',
            type: 'text/css',
            href: setTheme.themeFile
        }).appendTo('head');
        console.log(setTheme.optionID);
        console.log(setTheme.themeFile);
        document.getElementById('' + setTheme.optionID).selected = true;
    });

    $('#themeSelector').on('change', function() {
        var theme = this.value;
        var option = this.id;
        chrome.storage.sync.set({
            'themeFile': theme,
            'optionID': option
        });
    });

    var ampmSelected = "";
    $('.optionsAMPM').click(function() {
        var ampm = document.getElementById("ampmShow").checked;
        chrome.storage.sync.set({ 'ampm': ampm });
        console.log("AMPM Saved");
    });

    $("#timeType input").click(function() {
        if (document.getElementById('h:mm').checked) {
            chrome.storage.sync.set({
                'timeType': 'h:mm'
            });
            console.log('timeType');
        } else if (document.getElementById('HH:mm').checked) {
            chrome.storage.sync.set({
                'timeType': 'HH:mm'
            });
        }
        console.log(timeType);
    });

    var timeType = 'h:mm';
    chrome.storage.sync.get({ 'timeType': timeType }, function(results) {
        timeType = results.timeType;
        document.getElementById(timeType).checked = true;
        console.log(timeType);

        chrome.storage.sync.get({ 'ampm': false }, function(checkedAMPM) {
            ampm = checkedAMPM.ampm;
            document.getElementById('ampmShow').checked = ampm;

            if (document.getElementById('ampmShow').checked == true) {
                ampmSelected = "<h1 id='timeAMPM'>" + moment().format('A') + "</h1>";
                document.getElementById("time").style.marginLeft = "20px";
            } else {
                ampmSelected = "";
                document.getElementById("time").style.marginLeft = "3px";
            }

            document.getElementById("date").innerHTML = "Today is " + moment().format('ddd' + ", " + 'Do' + " of " + 'MMMM YYYY') + "<br><hr>";
            document.getElementById("timeDate").innerHTML = moment().format('dddd' + ", " + 'MMMM Do YYYY');
            document.getElementById("time").innerHTML = moment().format(timeType) + ampmSelected;

            setInterval(function() {
                document.getElementById("date").innerHTML = "Today is " + moment().format('ddd' + ", " + 'Do' + " of " + 'MMMM YYYY') + "<br><hr>";
                document.getElementById("timeDate").innerHTML = moment().format('dddd' + ", " + 'MMMM Do YYYY');
                document.getElementById("time").innerHTML = moment().format(timeType) + ampmSelected;
            }, 1000);

        });
    });

    function getWeather(local, weatherUnit) {
        $.simpleWeather({
            location: local,
            woeid: '',
            unit: weatherUnit,
            success: function(weather) {
                setWeather(weather);
            },
            error: function(error) {
                // $("#weather").html('<p>' + error + '</p>');
            }
        });
    }

    function setWeather (weather) {
        $("#weather").html('<i class="icon-' + weather.code + '" title="' + weather.currently + '"></i>' + weather.temp + '&deg;<div id="city">' + weather.city +
                    '</div><i id="downArrow" class="fa fa-angle-down"></i>');

        for (var i = 0; i < 5; i++) {
            $("#forecast").append('<div id="forecastBox"><p class="castDay' + i + '" id="forecastDays"><div id="forecastDay">' + weather.forecast[i].day +
                '</div><div id="forecastIcon"><i class="icon-' + weather.forecast[i].code + '" title="' + weather.forecast[i].text + '"></i></div>' +
                '<div id="highLow">' + weather.forecast[i].high + ' ' + weather.forecast[i].low + '</div></p></div>');
        }

        chrome.storage.sync.set({ 'weather': weather });
    }

    chrome.storage.sync.get('weather', function (store) {
        if (store && store.weather) {
            setWeather(store.weather)
        }
    });

    var currVersion = getVersion();
    var prevVersion = localStorage['version']
    if (currVersion != prevVersion) {
        // Check if we just installed this extension.
        if (typeof prevVersion == 'undefined') {
            onInstall();
            // ga('send', 'event', 'install_button', 'click', 'button');
        } else {
            onUpdate();
        }
        localStorage['version'] = currVersion;
    }

    chrome.storage.sync.get({ getValidUpdate: false }, function(getUpdate) {
        console.log(getUpdate.getValidUpdate);
        if (getUpdate.getValidUpdate == true) {
            document.getElementById('validUpdate').checked = true;
            $('.notification').show();
        } else {
            document.getElementById('validUpdate').checked = false;
        }

    });

    $('#welcome_confirm').click(function() {
        $('#welcome_newInstaller').hide();
        $('#time').show();
    });

    $('#updateOptionsHeader').click(function() {
        chrome.storage.sync.set({ getValidUpdate: false });
        $('.updateNotification').hide();
    });

    chrome.storage.sync.get('taskTextbox', function(result) {
        taskTextbox = result.taskTextbox;
        $("#nameTextbox").val(taskTextbox);

        chrome.storage.sync.get('taskCheckedSaved', function(checkedResult) {
            taskCheckedSaved = checkedResult.taskCheckedSaved;
            document.getElementById('taskSaved').checked = taskCheckedSaved;
            console.log(taskCheckedSaved);

            if ($('#nameTextbox').val() == "") {
                $('#greeting').hide();
                console.log("Empty");
            } else {
                $('#greeting').show();
                console.log("Not Empty");
                if (document.getElementById('taskSaved').checked == true) {
                    document.getElementById('taskDoneCheckmark').style.visibility = 'visible';
                    taskCheckedSaving();
                }
                taskInnerLabel();
            }
        });
    });

    $("#nameTextbox").keypress(function(e) {
        if (e.keyCode == 13) {
            taskInnerLabel();
            document.getElementById('taskSaved').checked = false;
            document.getElementById('taskDoneCheckmark').style.visibility = 'hidden';
            taskCheckedSaving();

            if ($('#nameTextbox').val() == "") {
                $('#greeting').hide();
                console.log("Empty");
            } else {
                $('#greeting').show();
            }
            var nameTextboxSave = document.getElementById("nameTextbox").value;
            chrome.storage.sync.set({ 'taskTextbox': nameTextboxSave });
        }
    });

    // jQuery('#greetingTextbox').on('input propertychange paste', function() {
    //     var textbox = this;
    //     if (!textbox.startW) {
    //         textbox.startW = textbox.offsetWidth;
    //     }
    //     var style = textbox.style;
    //     style.width = 0;
    //     var desiredW = textbox.scrollWidth;
    //     style.width = Math.max(desiredW, textbox.startW) + 'px';
    // });
    //    setInterval(function() {
    //    if(moment().format('HH') >= 18 && moment().format('a') === "pm") {
    //          document.getElementById("greeting").innerHTML="Good Evening, "+nameTextbox+".";
    //        } else if (moment().format('HH') >= 12 && moment().format('a') === "pm"){
    //          document.getElementById("greeting").innerHTML="Good Afternoon, "+nameTextbox+".";
    //        } else if (moment().format('HH') >= 5 && moment().format('a') === "am"){
    //              document.getElementById("greeting").innerHTML="Good Morning, "+nameTextbox+".";
    //        } else {
    //          document.getElementById("greeting").innerHTML="It's getting late, "+nameTextbox+".";
    //        }
    //    }, 1);

    $("#weatherUnit input").click(function() {
        if (document.getElementById('unitf').checked) {
            var weatherUnitRadio = document.getElementById('unitf').value;
            chrome.storage.sync.set({
                'weatherUnit': weatherUnitRadio
            });
            console.log(weatherUnitRadio);
        } else if (document.getElementById('unitc').checked) {
            var weatherUnitRadio = document.getElementById('unitc').value;
            chrome.storage.sync.set({
                'weatherUnit': weatherUnitRadio
            });
        }
    });


    navigator.geolocation.getCurrentPosition(function(position) {
        chrome.storage.sync.get({ 'weatherUnit': 'f' }, function(result) {
            weatherUnit = result.weatherUnit;
            document.getElementById("unit" + weatherUnit).checked = true;
            console.log(weatherUnit);
        });

        var local = position.coords.latitude + ',' + position.coords.longitude;

        chrome.storage.sync.get({ 'setLocation': "Austin, TX or 27514" },
            function(setLocationTextbox) {
                document.getElementById('customLocationTextbox').value = setLocationTextbox.setLocation;
            });

        $('#customLocation').click(function() {
            if (document.getElementById('customLocation').checked) {
                document.getElementById("customLocationTextbox").disabled = false;
                local = document.getElementById("customLocationTextbox").value;
            }
            locationCheck = document.getElementById('customLocation').checked;
            geolocationCheck = document.getElementById('defaultLocation').checked;
            chrome.storage.sync.set({
                'setLocationCheck': locationCheck,
                'setGeolocation': geolocationCheck
            });
        });
        $('#defaultLocation').click(function() {
            if (document.getElementById('defaultLocation').checked) {
                document.getElementById("customLocationTextbox").disabled = true;
                local = position.coords.latitude + ',' + position.coords.longitude;
                console.log(local);
            }
            locationCheck = document.getElementById('customLocation').checked;
            geolocationCheck = document.getElementById('defaultLocation').checked;
            chrome.storage.sync.set({
                'setLocationCheck': locationCheck,
                'setGeolocation': geolocationCheck
            });
        });

        $("#customLocationTextbox").keypress(function(e) {
            if (e.keyCode == 13) {
                local = document.getElementById("customLocationTextbox").value;
                chrome.storage.sync.set({ 'setLocation': local });
            }
        });

        chrome.storage.sync.get({
            'setLocationCheck': false,
            'setGeolocation': true
        }, function(checkLocationChecked) {
            document.getElementById('customLocation').checked = checkLocationChecked.setLocationCheck;
            document.getElementById('defaultLocation').checked = checkLocationChecked.setGeolocation;

            if (document.getElementById('defaultLocation').checked) {
                document.getElementById("customLocationTextbox").disabled = true;
                local = position.coords.latitude + ',' + position.coords.longitude;
                getWeather(local, weatherUnit);
            } else if (document.getElementById('customLocation').checked) {
                document.getElementById("customLocationTextbox").disabled = false;
                local = document.getElementById("customLocationTextbox").value;
                getWeather(local, weatherUnit);
            }
        });
    });

    //--- Hide / Show Icons ---//

    //Quick Links
    $('#optionsDisableQuickLinks').click(function() {
        var checkDisableQuickLinks = document.getElementById('optionsDisableQuickLinks').checked;
        chrome.storage.sync.set({ checkDisabledQL: checkDisableQuickLinks });
    });

    chrome.storage.sync.get({ checkDisabledQL: false }, function(checkQL) {
        document.getElementById('optionsDisableQuickLinks').checked = checkQL.checkDisabledQL;
        if (document.getElementById('optionsDisableQuickLinks').checked == false) {
            $('#menu').show();

            var $quick = $('#menu');
            var right_pos = $quick.offset().left;
            $('#menuTools').css('left', right_pos + "px");

        } else {
            $('#menu').hide();
        }
    });

    //Top Visited
    $('#optionsDisableTop').click(function() {
        var checkDisableTop = document.getElementById('optionsDisableTop').checked;
        chrome.storage.sync.set({ checkDisabledTop: checkDisableTop });
    });

    chrome.storage.sync.get({ checkDisabledTop: true }, function(checkT) {
        document.getElementById('optionsDisableTop').checked = checkT.checkDisabledTop;
        if (document.getElementById('optionsDisableTop').checked == false) {
            $('#topSitesIcon').show();

            var $top = $('#topSitesIcon');
            var right_pos = $top.offset().left;
            $('#topSitesMenu').css('left', right_pos + "px");

        } else {
            $('#topSitesIcon').hide();
        }
    });

    //Weather
    $('#optionsDisableWeather').click(function() {
        var checkDisableWeather = document.getElementById('optionsDisableWeather').checked;
        chrome.storage.sync.set({ checkDisabledW: checkDisableWeather });
    });

    chrome.storage.sync.get({ checkDisabledW: false }, function(checkW) {
        document.getElementById('optionsDisableWeather').checked = checkW.checkDisabledW;
        if (document.getElementById('optionsDisableWeather').checked == false) {
            $('#weather').show();
        } else {
            $('#weather').hide();
        }
    });

    //Clock
    $('#optionsDisableClock').click(function() {
        var checkDisableClock = document.getElementById('optionsDisableClock').checked;
        chrome.storage.sync.set({ checkDisabledC: checkDisableClock });
    });

    chrome.storage.sync.get({ checkDisabledC: false }, function(checkC) {
        document.getElementById('optionsDisableClock').checked = checkC.checkDisabledC;
        if (document.getElementById('optionsDisableClock').checked == false) {
            $('#heyMessage').show();
        } else {
            $('#heyMessage').hide();
        }
    });

    //Todo List
    $('#optionsDisableTodo').click(function() {
        var checkDisableTodo = document.getElementById('optionsDisableTodo').checked;
        chrome.storage.sync.set({ checkDisabledT: checkDisableTodo });
    });

    chrome.storage.sync.get({ checkDisabledT: false }, function(checkT) {
        document.getElementById('optionsDisableTodo').checked = checkT.checkDisabledT;
        if (document.getElementById('optionsDisableTodo').checked == false) {
            $('#todoListIcon').show();

            var $todo = $('#todoListIcon');
            var right_pos = ($(window).width() - ($todo.offset().left + $todo.outerWidth()));
            $('#todoList').css('right', right_pos + "px");

        } else {
            $('#todoListIcon').hide();
        }
    });

    //News
    $('#optionsDisableNews').click(function() {
        var checkDisableNews = document.getElementById('optionsDisableNews').checked;
        chrome.storage.sync.set({ checkDisabledN: checkDisableNews });
    });

    chrome.storage.sync.get({ checkDisabledN: true }, function(checkN) {
        document.getElementById('optionsDisableNews').checked = checkN.checkDisabledN;
        if (document.getElementById('optionsDisableNews').checked == false) {
            $('#newsIcon').show();

            var $news = $('#newsIcon');
            var right_pos = ($(window).width() - ($news.offset().left + $news.outerWidth()));
            $('#news').css('right', right_pos + "px");

        } else {
            $('#newsIcon').hide();
        }
    });

    //Notepad
    $('#optionsDisableNotepad').click(function() {
        var checkDisableNotepad = document.getElementById('optionsDisableNotepad').checked;
        chrome.storage.sync.set({ checkDisabledNote: checkDisableNotepad });
    });

    chrome.storage.sync.get({ checkDisabledNote: false }, function(checkNote) {
        document.getElementById('optionsDisableNotepad').checked = checkNote.checkDisabledNote;
        if (document.getElementById('optionsDisableNotepad').checked == false) {
            $('#notepadIcon').show();

            var $notepad = $('#notepadIcon');
            var right_pos = ($(window).width() - ($notepad.offset().left + $notepad.outerWidth()));
            $('#notepad').css('right', right_pos + "px");

        } else {
            $('#notepadIcon').hide();
        }
    });

    //Calendar
    $('#optionsDisableCalendar').click(function() {
        var checkDisableCalendar = document.getElementById('optionsDisableCalendar').checked;
        chrome.storage.sync.set({ checkDisabledCal: checkDisableCalendar });
    });

    chrome.storage.sync.get({ checkDisabledCal: false }, function(checkCal) {
        document.getElementById('optionsDisableCalendar').checked = checkCal.checkDisabledCal;
        if (document.getElementById('optionsDisableCalendar').checked == false) {
            $('#calendar').show();
        } else {
            $('#calendar').hide();
        }
    });

    //Search

    $('#optionsDisableSearch').click(function() {
        var checkDisableSearch = document.getElementById('optionsDisableSearch').checked;
        chrome.storage.sync.set({ checkDisabledS: checkDisableSearch });
    });

    chrome.storage.sync.get({ checkDisabledS: true }, function(checkS) {
        document.getElementById('optionsDisableSearch').checked = checkS.checkDisabledS;
        if (document.getElementById('optionsDisableSearch').checked == false) {
            $('#searchIcon').show();
        } else {
            $('#searchIcon').hide();
        }
    });

    //Zen Mode Icon
    $('#optionsDisableZen').click(function() {
        var checkDisableZen = document.getElementById('optionsDisableZen').checked;
        chrome.storage.sync.set({ checkDisabledZen: checkDisableZen });
    });

    chrome.storage.sync.get({ checkDisabledZen: false }, function(checkZ) {
        document.getElementById('optionsDisableZen').checked = checkZ.checkDisabledZen;
        if (document.getElementById('optionsDisableZen').checked == false) {
            $('#zenModeIconBtn').show();
        } else {
            $('#zenModeIconBtn').hide();
        }
    });

    //All Icons
    $('#optionsDisableAll').click(function() {
        var checkDisableAll = document.getElementById('optionsDisableAll').checked;
        chrome.storage.sync.set({ checkDisabledA: checkDisableAll });
    });

    chrome.storage.sync.get({ checkDisabledA: false }, function(checkAll) {
        document.getElementById('optionsDisableAll').checked = checkAll.checkDisabledA;
        if (document.getElementById('optionsDisableAll').checked == false) {

            if (document.getElementById('optionsDisableNotepad').checked == false) {
                $('#notepadIcon').show();
            }
            if (document.getElementById('optionsDisableCalendar').checked == false) {
                $('#calendarIcon').show();
            }
            if (document.getElementById('optionsDisableNews').checked == false) {
                $('#newsIcon').show();
            }
            if (document.getElementById('optionsDisableTodo').checked == false) {
                $('#todoListIcon').show();
            }
            if (document.getElementById('optionsDisableZen').checked == false) {
                $('#zenModeIconBtn').show();
            }
            if (document.getElementById('optionsDisableWeather').checked == false) {
                $('#weather').show();
            }
            if (document.getElementById('optionsDisableQuickLinks').checked == false) {
                $('#menu').show();
            }
            if (document.getElementById('optionsDisableTop').checked == false) {
                $('#topSitesIcon').show();
            }
            if (document.getElementById('optionsDisableSearch').checked == false) {
                $('#searchIcon').show();
            }
        } else {
            $('#notepadIcon').hide();
            $('#calendarIcon').hide();
            $('#newsIcon').hide();
            $('#todoListIcon').hide();
            $('#zenModeIconBtn').hide();
            $('#weather').hide();
            $('#menu').hide();
            $('#topSitesIcon').hide();
            $('#searchIcon').hide();
        }
    });

    //--- End of Hide / Show Icons ---/

    $("#todoListSave").val().replace(/\n/g, "");
    //$("#forecast").hide();
    $(document).on('click', function(e) {
        if ($(e.target).closest('#weather').length) {
            $("#forecast").slideToggle();
            ga('send', 'event', 'forecast', 'click', 'opened');
        } else if (!$(e.target).closest('#forecast').length) {
            $('#forecast').slideUp();
        }
    });

    $("#menuTools").css('display','inline').hide();
    $(document).on('click', function(e) {
        if ($(e.target).closest('#menu').length) {
            $("#menuTools").slideToggle();
            ga('send', 'event', 'quick_links', 'click', 'opened');
        } else if (!$(e.target).closest('#menuTools').length) {
            $('#menuTools').slideUp();
        }
    });

    $("#topSitesMenu").css('display','inline-block').hide();
    $(document).on('click', function(e) {
        if ($(e.target).closest('#topSitesIcon').length) {
            $("#topSitesMenu").slideToggle();
            ga('send', 'event', 'top_sites', 'click', 'opened');
        } else if (!$(e.target).closest('#topSitesMenu').length) {
            $('#topSitesMenu').slideUp();
        }
    });

    $(".searchEngine").css('display','inline-block').hide();
    $("#searchIcon").click(function() {
        $(".searchEngine").toggle();
        document.getElementById("searchTextbox").focus();
    });

    $('#closeOptions').click(function() {
        $("#optionsMenu").hide();
    });

    $("#optionsMenu").hide();
    $(document).on('click', function(e) {
        if ($(e.target).closest('#optionsIcon').length) {
            $("#optionsMenu").toggle();
            ga('send', 'event', 'options', 'click', 'opened');
        } else if (!$(e.target).closest('#optionsMenu').length) {
            $('#optionsMenu').hide();
        }
    });

    $(document).on('click', function(e) {
        if ($(e.target).closest('#zenModeIconBtn').length) {
            var ranZen = Math.floor(Math.random() * $(".playZen").length) + 0;
            console.log($(".playZen").length);
            $(".playZen")[ranZen].click();
            ga('send', 'event', 'random zen played', 'click', 'opened');
        }
    });

//    $("#news").hide();
    $(document).on('click', function(e) {
        if ($(e.target).closest('#newsIcon').length) {
            $("#news").slideToggle();
            ga('send', 'event', 'news', 'click', 'opened');
        } else if (!$(e.target).closest('#news').length) {
            $('#news').slideUp();
        }
    });

//    $("#notepad").hide();
    $(document).on('click', function(e) {
        if ($(e.target).closest('#notepadIcon').length) {
            $("#notepad").slideToggle();
            ga('send', 'event', 'notepad', 'click', 'opened');
        } else if (!$(e.target).closest('#notepad').length) {
            $('#notepad').slideUp();
        }
    });

    // TO DO: Use fixed calendar height to maintain same position for Back/Forward buttons?

    window.CalendarConfig = new (function () {
        this.accessToken = ''
        this.setAccessToken = function (accessToken) {
            this.accessToken = accessToken
            return Promise.resolve()
        }
    })

    window.CalendarHelper = new (function () {
        var that = this;
        this.getCalendars = function () {
            return new Promise(function (resolve, reject) {
                $.ajax('https://www.googleapis.com/calendar/v3/users/me/calendarList', {
                    headers: { 'Authorization': 'Bearer ' + CalendarConfig.accessToken },
                    success: function (calendars) {
                        resolve(calendars.items || []);
                    },
                    error: function(response) {
                        resolve([]);
                    }
                });
            });
        };
        this.getEvents = function (calendarId, dayOffset) {
            return new Promise(function (resolve, reject) {
                var time = moment().add(dayOffset, 'days');
                var fromDate = time.startOf('day').toISOString();
                var toDate = time.endOf('day').toISOString();
                var feedUrl = 'https://www.googleapis.com/calendar/v3/calendars/{calendarId}/events?'
                    .replace('{calendarId}', encodeURIComponent(calendarId)) + ([
                        'timeMin=' + encodeURIComponent(fromDate),
                        'timeMax=' + encodeURIComponent(toDate),
                        'maxResults=500',
                        'orderBy=startTime',
                        'singleEvents=true'
                    ].join('&'));
                $.ajax(feedUrl, {
                    headers: { 'Authorization': 'Bearer ' + CalendarConfig.accessToken },
                    success: function (events) {
                        resolve(events.items || []);
                    },
                    error: function(response) {
                        resolve([]);
                    }
                });
            });
        };
        this.getMultipleEventsSync = function (calendarIds, dayOffset) {
            calendarIds = calendarIds.slice(0)
            return new Promise(function (resolve, reject) {
                var allEvents = [];
                function get (id) {
                    if (!id) {
                        allEvents = allEvents.sort(function (a, b) {
                            return new Date(a.start.dateTime) > new Date(b.start.dateTime);
                        });
                        resolve(allEvents);
                        return;
                    }
                    that.getEvents(id, dayOffset).then(function (events) {
                        allEvents = allEvents.concat(events);
                        get(calendarIds.shift());
                    });

                }
                get(calendarIds.shift());
            })
        };
        this.getMultipleEventsAsync = function (calendarIds, dayOffset) {
            var allEvents = calendarIds.map(function (id) {
                return that.getEvents(id, dayOffset);
            });
            return Promise.all(allEvents).then(function (events) {
                return events.reduce(function (res, array) {
                    return res.concat(array);
                }, []).sort(function (a, b) {
                    return new Date(a.start.dateTime) > new Date(b.start.dateTime);
                });
            })
        };
    })

    window.CalendarSelector = new (function () {
        var that = this;
        this.selectEl = $('#calendars')[0];
        this.calendars = [];
        this.checkedCalendars = [];
        this.init = function () {
            return new Promise(function (resolve, reject) {
                CalendarHelper.getCalendars().then(function (calendars) {
                    that.calendars = calendars.map(function (calendar) {
                        return { id: calendar.id, name: calendar.summary };
                    })
                    chrome.storage.sync.get("checkedCalendars", function (save) {
                        if (save && save.checkedCalendars) {
                            that.checkedCalendars = save.checkedCalendars;
                        } else {
                            that.checkedCalendars = that.calendars.map(function (calendar) {
                                return calendar.id;
                            });
                        }
                        that.selectEl.innerHTML = that.calendars.map(function (calendar) {
                            return '<div>'
                                + '<input type="checkbox" id="' + calendar.id + '" name="' + calendar.id + '">'
                                + '<label class="checkInput" for="' + calendar.id + '">' + calendar.name + '</label>'
                            ;
                        }).join('');
                        that.calendars.forEach(function (calendar) {
                            var el = document.getElementById(calendar.id);
                            el.checked = that.checkedCalendars.indexOf(calendar.id) !== -1;
                            el.onclick = function (e) {
                                if (el.checked) {
                                    that.checkedCalendars.push(calendar.id);
                                } else {
                                    that.checkedCalendars.splice(that.checkedCalendars.indexOf(calendar.id), 1);
                                }
                            }
                        })
                        resolve();
                    });
                })
            });
        };
        this.saveSelectionToStorage = function () {
            chrome.storage.sync.set({ 'checkedCalendars': that.checkedCalendars });
        };
    })

    window.CalendarRenderer = new (function () {
        var that = this;
        this.eventsEl = $('#calendarDailyEvents')[0];
        this.backEl = $('#calBack')[0]
        this.forwardEl = $('#calForward')[0]
        this.heading = $('#calHeaderContent')[0]
        this.dayOffset = 0;
        this.currentEvents = [];
        this.init = function () {
            window.CalendarHelper.getMultipleEventsAsync(CalendarSelector.checkedCalendars, this.dayOffset).then(function (events) {
                that.currentEvents = events.map(function (event) {
                    var name = event.summary || 'Unnamed Event';
                    var when = moment(event.start.dateTime).format('LT');
                    var start = new Date(event.start.dateTime);
                    var end = new Date(event.end.dateTime);
                    var el = document.createElement('div');
                    el.innerHTML = '<div id="calStartend">' + when + '</div><div id="calSum">' + name + '</div>';
                    return { name: name, when: when, start: start, end: end, el: el };
                }).filter(function (event) {
                    return event.end > Date.now();
                })
                that.render();
                that.forwardEl.onclick = function (e) {
                    that.dayOffset++;
                    that.init();
                };
                that.backEl.onclick = function (e) {
                    that.dayOffset = (that.dayOffset > 0) ? (that.dayOffset - 1) : 0;
                    that.init();
                };
            });
        };
        this.render = function () {
            if (that.currentEvents.length > 0) {
                that.eventsEl.innerHTML = '';
                that.currentEvents.forEach(function (event) {
                    that.eventsEl.appendChild(event.el);
                })
            } else {
                that.eventsEl.innerHTML = '<div>All done! Go out and play : )</div>';
            }
            that.backEl.style.visibility = (that.dayOffset === 0) ? 'hidden' : 'visible';
            if (that.dayOffset === 0) {
                that.heading.textContent = 'Today\'s Calendar';
            } else {
                that.heading.textContent = moment().add(that.dayOffset, 'days').format('LL');
            }
        };
        window.setInterval(function () {
            that.currentEvents = that.currentEvents.filter(function (event) {
                if (Date.now() > event.end) {
                    $(event.el).hide('slow');
                    return false;
                } else if (Date.now() > event.start) {
                    $(event.el).addClass('active');
                }
                return true;
            })
        }, 1000);
    })

    function getTokenExpiresIn(token) {
        console.log('inside getTokenExpiresIn', token, !token)
        if (!token) {
            return Promise.resolve(0)
        }
        return new Promise((resolve, reject) => {
            fetch('https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=' + token).then(res => res.json()).then(res => {
                console.log('getTokenExpiresIn', res)
                resolve(res['expires_in'] || 0)
            }).catch(e => {
                console.log('CATCH', e)
                resolve(0)
            })
        })
    }

    function signOut(token, reload) {
        var btn = document.getElementById('calendarSignOut')
        btn.disabled = true
        btn.textContent = 'Signing out...'
        var attempts = 30
        function check() {
            getTokenExpiresIn(token).then(expiresIn => {
                if (expiresIn > 0 && --attempts > 0) {
                    window.setTimeout(check, 200)
                } else if (reload) {
                    window.location.reload(true)
                } else {
                    btn.disabled = false
                    btn.textContent = 'Sign out'
                }
            })
        }
        chrome.identity.removeCachedAuthToken({ 'token': token }, () => {
            fetch('https://accounts.google.com/o/oauth2/revoke?token=' + token).then(() => {
                check()
            }).catch(() => {
                window.setTimeout(() => {
                    signOut(token, reload)
                }, 1000)
            })
        })
    }

    function loadCalendar(options) {
        var signin = document.querySelector('#calendarSignIn')
        var savedLabel = signin.textContent
        function getToken() {
            chrome.identity.getAuthToken(options, function (accessToken) {
                console.log('accessToken', accessToken)
                if (!accessToken) {
                    return
                }
                getTokenExpiresIn(accessToken).then(expiresIn => {
                    console.log('expiresIn', expiresIn)
                    if (expiresIn > 0) {
                        signin.disabled = false
                        signin.textContent = savedLabel
                        if (chrome.runtime.lastError || !accessToken) {
                            console.log('getAuthToken', chrome.runtime.lastError.message);
                            return;
                        }
                        document.getElementById('calendarAskPermission').style.display = 'none';
                        document.getElementById('calendarSignOut').style.display = '';
                        window.CalendarConfig.setAccessToken(accessToken)
                            .then(window.CalendarSelector.init)
                            .then(window.CalendarRenderer.init)
                            .then(function () {
                                $('#calHeader').fadeIn(200);
                                $('#calendarDailyEvents').fadeIn(200);
                            })
                    } else {
                        // invalid token, logout
                        signOut(accessToken, false)
                    }
                })

            });
        }
        if (options.interactive) {
            signin.disabled = true
            signin.textContent = 'Authorizing...'
            chrome.permissions.request(
                { origins: [ 'https://accounts.google.com/*', 'https://calendar.google.com/*', 'https://www.googleapis.com/*' ] },
                (granted) => {
                    if (granted) {
                        getToken()
                    } else {
                        // inadequate API permissions
                        signin.disabled = false
                        signin.textContent = savedLabel
                    }
                }
            )
        } else {
            getToken()
        }

    }

    loadCalendar({ interactive: false });

    function sendActiveAnalytics () {
        const date = moment().format('L');
        function send () {
            fetch('https://leoh.io/dashboard/action.php?action=active_user')
                .then(() => {
                    chrome.storage.sync.set({ 'sendActiveAnalytics': date });
                    console.log('send active');
                })
                .catch(() => {
                    console.log('failed to send active');
                });
        }
        chrome.storage.sync.get('sendActiveAnalytics', function (save) {
            if (date !== save.sendActiveAnalytics) {
                send();
            }
        });
    }

    sendActiveAnalytics();

    $(document).on('click', function(e) {
        if ($(e.target).closest('#calendarSignIn').length) {
            loadCalendar({ interactive: true });
            ga('send', 'event', 'calendar', 'signed_in', 'opened');
        } else if ($(e.target).closest('#ignoreBtn').length) {
            chrome.storage.sync.set({ checkDisabledCal: true });
            $('#calendar').fadeOut(200);
            ga('send', 'event', 'calendar', 'ignored', 'opened');
        } else if ($(e.target).closest('#calendarSignOut').length) {
            console.log('sign out');
            signOut(CalendarConfig.accessToken, true)
        }

        // else if ($(e.target).closest('#calendarIcon').length) {
        //     $("#calendar").slideToggle();
        //     ga('send', 'event', 'calendar', 'click', 'opened');
        // } else if (!$(e.target).closest('#calendar').length) {
        //     $('#calendar').slideUp();
        // }
    });

//    $("#todoList").hide();
    $(document).on('click', function(e) {
        if ($(e.target).closest('#todoListIcon').length) {
            $("#todoList").slideToggle();
            ga('send', 'event', 'todolist', 'click', 'opened');
        } else if (!$(e.target).closest('#todoList').length) {
            $('#todoList').slideUp();
        }
        taskClicked(); //Required.
    });

    // Searching
    $('#searchTextbox').keypress(function(e) {
        if (e.keyCode == 13) {
            var searchTerm = document.getElementById('searchTextbox').value;
            searchTerm = searchTerm.replace('?', '');
            $('#searchResults').show();
            document.getElementById('searchFrame').src = 'https://leoh.io/search/?cx=partner-pub-0576076987909084%3A6866581994&cof=FORID%3A10&ie=UTF-8&q=' + searchTerm;
            ga('send', 'event', 'made_Google_search', 'click', 'opened');
        }
    });

    $('#searchClose').click(function() {
        $('.searchEngine').hide();
        $('#searchResults').hide();
    });

    $("#linkApps").click(function() {
        chrome.tabs.create({
            url: 'chrome://apps'
        });
    });
    $("#linkBookmarks").click(function() {
        chrome.tabs.create({
            url: 'chrome://bookmarks'
        });
    });
    $("#linkHistory").click(function() {
        chrome.tabs.create({
            url: 'chrome://history'
        });
    });

    //--- Always Open / Closed Tools ---//

    //Quick Links
    $('#optionsAlwaysOpenQuickLinks').click(function() {
        var checkOpenQuickLinks = document.getElementById('optionsAlwaysOpenQuickLinks').checked;
        chrome.storage.sync.set({ checkOpenQL: checkOpenQuickLinks });
    });

    chrome.storage.sync.get({ checkOpenQL: false }, function(openQL) {
        document.getElementById('optionsAlwaysOpenQuickLinks').checked = openQL.checkOpenQL;
        if (document.getElementById('optionsAlwaysOpenQuickLinks').checked == false) {
            $("#menuTools").hide();
        } else {
            $("#menuTools").show();
        }
    });

    //Search
    $('#optionsAlwaysSearch').click(function() {
        var checkOpenSearch = document.getElementById('optionsAlwaysSearch').checked;
        chrome.storage.sync.set({ checkOpenS: checkOpenSearch });
    });

    chrome.storage.sync.get({ checkOpenS: false }, function(openS) {
        document.getElementById('optionsAlwaysSearch').checked = openS.checkOpenS;
        if (document.getElementById('optionsAlwaysSearch').checked == false) {
            $(".searchEngine").hide();
        } else {
            $(".searchEngine").show();
        }
    });

    //Top Sites
    $('#optionsAlwaysTop').click(function() {
        var checkOpenTop = document.getElementById('optionsAlwaysTop').checked;
        chrome.storage.sync.set({ checkOpenT: checkOpenTop });
    });

    chrome.storage.sync.get({ checkOpenT: false }, function(openT) {
        document.getElementById('optionsAlwaysTop').checked = openT.checkOpenT;
        if (document.getElementById('optionsAlwaysTop').checked == false) {
            $("#topSitesMenu").hide();
        } else {
            $("#topSitesMenu").show();
        }
    });


    //Weather
    $('#optionsAlwaysOpenWeather').click(function() {
        var checkOpenWeather = document.getElementById('optionsAlwaysOpenWeather').checked;
        chrome.storage.sync.set({ checkOpenW: checkOpenWeather });
    });

    chrome.storage.sync.get({ checkOpenW: false }, function(openW) {
        document.getElementById('optionsAlwaysOpenWeather').checked = openW.checkOpenW;
        if (document.getElementById('optionsAlwaysOpenWeather').checked == false) {
            $("#forecast").hide();
        } else {
            $("#forecast").show();
        }
    });

    //Todo List
    $('#optionsAlwaysTodo').click(function() {
        var checkOpenTodo = document.getElementById('optionsAlwaysTodo').checked;
        chrome.storage.sync.set({ checkOpenTo: checkOpenTodo });
    });

    chrome.storage.sync.get({ checkOpenTo: false }, function(openT) {
        document.getElementById('optionsAlwaysTodo').checked = openT.checkOpenTo;
        if (document.getElementById('optionsAlwaysTodo').checked == false) {
            $("#todoList").hide();
        } else {
            $("#todoList").show();
        }


    });

    //News
    $('#optionsAlwaysNews').click(function() {
        var checkOpenNews = document.getElementById('optionsAlwaysNews').checked;
        chrome.storage.sync.set({ checkOpenN: checkOpenNews });
    });

    chrome.storage.sync.get({ checkOpenN: false }, function(openN) {
        document.getElementById('optionsAlwaysNews').checked = openN.checkOpenN;
        if (document.getElementById('optionsAlwaysNews').checked == false) {
            $("#news").hide();
        } else {
            $("#news").show();
        }

    });

    //Notepad
    $('#optionsAlwaysNotepad').click(function() {
        var checkOpenNotepad = document.getElementById('optionsAlwaysNotepad').checked;
        chrome.storage.sync.set({ checkOpenNote: checkOpenNotepad });
    });

    chrome.storage.sync.get({ checkOpenNote: false }, function(openNote) {
        document.getElementById('optionsAlwaysNotepad').checked = openNote.checkOpenNote;
        if (document.getElementById('optionsAlwaysNotepad').checked == false) {
            $("#notepad").hide();
        } else {
            $("#notepad").show();
        }

        //All 3 Open
        if (document.getElementById('optionsAlwaysNotepad').checked == true &&
            document.getElementById('optionsAlwaysNews').checked == true &&
            document.getElementById('optionsAlwaysTodo').checked == true) {
            $("#notepad").css('right', '800px');
            $("#notepadIcon").css('margin-right', '320px');
            $("#news").css('right', '335px');
            $("#newsIcon").css('margin-right', '180px');
            $('body').click(function() {
                setTimeout(function() {

                    var $notepad = $('#notepadIcon');
                    var notepad_right_pos = ($(window).width() - ($notepad.offset().left + $notepad.outerWidth()));
                    $('#notepad').css('right', notepad_right_pos + "px");

                    var $news = $('#newsIcon');
                    var news_right_pos = ($(window).width() - ($news.offset().left + $news.outerWidth()));
                    $('#news').css('right', news_right_pos + "px");

                }, 1001);
                $("#newsIcon").css('margin-right', '0px');
                $("#notepadIcon").css('margin-right', '0px');
            });
        }

        //Notepad & Todo
        else if (document.getElementById('optionsAlwaysNotepad').checked == true &&
            document.getElementById('optionsAlwaysTodo').checked == true &&
            document.getElementById('optionsAlwaysNews').checked == false) {
            $("#notepad").css('right', '330px');
            $("#notepadIcon").css('margin-right', '35px');
            $('body').click(function() {
                setTimeout(function() {

                    var $notepad = $('#notepadIcon');
                    var notepad_right_pos = ($(window).width() - ($notepad.offset().left + $notepad.outerWidth()));
                    $('#notepad').css('right', notepad_right_pos + "px");

                }, 1001);
                $("#notepadIcon").css('margin-right', '0px');
            });
        }

        //News & Todo
        else if (document.getElementById('optionsAlwaysNews').checked == true &&
            document.getElementById('optionsAlwaysTodo').checked == true &&
            document.getElementById('optionsAlwaysNotepad').checked == false) {
            $("#news").css('right', '330px');
            $("#newsIcon").css('margin-right', '170px');
            $('body').click(function() {
                setTimeout(function() {

                    var $news = $('#newsIcon');
                    var news_right_pos = ($(window).width() - ($news.offset().left + $news.outerWidth()));
                    $('#news').css('right', news_right_pos + "px");

                }, 1001);
                $("#newsIcon").css('margin-right', '0px');
            });
        }

        //Notepad & News
        else if (document.getElementById('optionsAlwaysNotepad').checked == true &&
            document.getElementById('optionsAlwaysNews').checked == true &&
            document.getElementById('optionsAlwaysTodo').checked == false) {
            $("#notepad").css('right', '625px');
            $("#notepadIcon").css('margin-right', '330px');
            $('body').click(function() {
                setTimeout(function() {

                    var $notepad = $('#notepadIcon');
                    var notepad_right_pos = ($(window).width() - ($notepad.offset().left + $notepad.outerWidth()));
                    $('#notepad').css('right', notepad_right_pos + "px");

                    var $news = $('#newsIcon');
                    var news_right_pos = ($(window).width() - ($news.offset().left + $news.outerWidth()));
                    $('#news').css('right', news_right_pos + "px");

                }, 1001);
                $("#newsIcon").css('margin-right', '0px');
                $("#notepadIcon").css('margin-right', '0px');
            });
        }

        //Quick Links & Top
        else if (document.getElementById('optionsAlwaysTop').checked == true &&
            document.getElementById('optionsAlwaysOpenQuickLinks').checked == true) {
            $("#topSitesMenu").css('left', '220px');
            $("#topSitesIcon").css('margin-left', '65px');
            $('body').click(function() {
                setTimeout(function() {

                    var $top = $('#topSitesIcon');
                    var top_right_pos = $top.offset().left;
                    $('#topSitesMenu').css('left', top_right_pos + "px");

                }, 1001);
                $("#topSitesIcon").css('margin-left', '0px');
            });
        }


    });

    //--- End of Always Open / Closed Tools ---//

    var textarea = document.querySelector("#quickLinksSave");
    chrome.storage.sync.get({ 'quickLinksSave': "Google\nhttp://google.com\nYouTube\nhttp://youtube.com\nleoh\nhttp://leoh.io" }, function(r) {
        console.log("Contacts retrieved");
        var content = r["quickLinksSave"];
        content = content.replace(/(^[ \t]*\n)/gm, "");
        textarea.value = content;
        var lines = $('#quickLinksSave').val().split('\n');
        for (var i = 0; i <= lines.length - 2; i += 2) {
            $("#quickLinksURLs").append('<a class="menuLinks" id="customLink" href="' + lines[i + 1] + '"><div id="menuItem"><div id="menuIcons"><img height="18" width="18" src="https://plus.google.com/_/favicon?domain_url=' + lines[i + 1] + '"></div><p id="menuName">' + lines[i] + '</p></div></a>');
        }
    });
    jQuery('#quickLinksSave').on('input propertychange paste', function() {
        console.log(document.querySelector("#quickLinksSave").value);
        var textarea = document.querySelector("#quickLinksSave").value;
        var quickLinksSave = {};
        quickLinksSave["quickLinksSave"] = textarea;
        // Save data using the Chrome extension storage API.
        chrome.storage.sync.set(quickLinksSave, function() {
            console.log("Links Saved");
        });
    });


    chrome.storage.sync.get('notepadText', function(result) {
        notepadText = result.notepadText;
        $("#notepadTextarea").val(notepadText);
    });


    jQuery('#notepadTextarea').on('input propertychange paste', function() {

        // Clear previous timeout
        if ($(this).data('timeout')) {
            clearInterval($(this).data('timeout'));
        }

        // Set up new one
        $(this).data('timeout', setTimeout(function() {
            var notepadText = document.getElementById('notepadTextarea').value;
            chrome.storage.sync.set({
                'notepadText': notepadText
            });
            console.log("Note Taker Saved");
        }, 500));
    });

    $(function() {
        $("#quickLinksTextbox input").keypress(function(e) {
            if (e.keyCode == 13 && $("#textboxTitle").val() != "" && $("#textboxURL").val() != "") {
                $("#quickLinksURLs").append('<a class="menuLinks" id="customLink" target="_blank" href="' + document.getElementById("textboxURL").value + '"><div id="menuItem"><div id="menuIcons"><img height="18" width="18" src="https://plus.google.com/_/favicon?domain_url=' + document.getElementById("textboxURL").value + '"></div><p id="menuName">' + document.getElementById("textboxTitle").value + '</p></div></a>');
                $("#quickLinksSave").val($("#quickLinksSave").val() + "\n" + $("#textboxTitle").val());
                $("#quickLinksSave").val($("#quickLinksSave").val() + "\n" + $("#textboxURL").val());
                $("#quickLinksTextbox input").val('');

                console.log(document.querySelector("#quickLinksSave").value);
                var textarea = document.querySelector("#quickLinksSave").value;
                var quickLinksSave = {};
                quickLinksSave["quickLinksSave"] = textarea;
                // Save data using the Chrome extension storage API.
                chrome.storage.sync.set(quickLinksSave, function() {
                    console.log("Links Saved");
                });
            }
        });
    });


    var todotextarea = document.querySelector("#todoListSave");
    chrome.storage.sync.get({ 'todoListSave': '' }, function(q) {
        console.log("Todo List retrieved");
        var todocontent = q["todoListSave"];
        todotextarea.value = todocontent;
        var todolines = $('#todoListSave').val().split('\n');
        todolines = todolines.filter(Boolean);
        for (var i = 0; i < todolines.length; i++) {
            if (todolines[i] !== "") {
                $("#listOfTodos").append('<div id="taskAtHand"><i id="todoListDone" class="fa fa-check"></i><label id="todoListItem">' + todolines[i] + '</label></div>');
            }
        }
        var mainDiv = document.getElementById('listOfTodos');
        var countOfDiv = mainDiv.getElementsByTagName('div').length;
        if ($('#listOfTodos').is(':empty')) {
            $('#todoGreeting').show();
            document.getElementById('todoGreeting').innerHTML = "Nothing Todo!";
            $('.todoListNotification').hide();
        } else {
            $('#todoGreeting').hide();
            $('.todoListNotification').show();
            document.getElementById("notificationTodo").innerHTML = countOfDiv;
        }
    });
    jQuery('#todoListSave').on('input propertychange paste', function() {
        console.log(document.querySelector("#todoListSave").value);
        var todotextarea = document.querySelector("#todoListSave").value;
        var todoListSave = {};
        todoListSave["todoListSave"] = todotextarea;
        // Save data using the Chrome extension storage API.
        chrome.storage.sync.set(todoListSave, function() {
            console.log("List Saved");
        });
    });

    $(function() {
        $("#todoListTextbox").keypress(function(e) {
            if (e.keyCode == 13 && $("#todoListTextbox").val() != "") {
                $('#todoGreeting').hide();
                $('#listOfTodos').append('<div id="taskAtHand"><i id="todoListDone" class="fa fa-check"></i><label id="todoListItem">' + document.getElementById("todoListTextbox").value + '</label></div>');
                taskClicked();
                $("#todoListSave").val($("#todoListSave").val() + $("#todoListTextbox").val() + "\n");
                $("#todoListTextbox").val('');
                var todotextarea = document.querySelector("#todoListSave").value;
                var todoListSave = {};
                todoListSave["todoListSave"] = todotextarea;
                var mainDiv = document.getElementById('listOfTodos');
                var countOfDiv = mainDiv.getElementsByTagName('div').length;
                if ($('#listOfTodos').is(':empty')) {
                    $('#todoGreeting').show();
                    document.getElementById('todoGreeting').innerHTML = "Nothing Todo!";
                    $('.todoListNotification').hide();
                } else {
                    $('#todoGreeting').hide();
                    $('.todoListNotification').show();
                    document.getElementById("notificationTodo").innerHTML = countOfDiv;
                }
                // Save data using the Chrome extension storage API.
                chrome.storage.sync.set(todoListSave, function() {
                    console.log("Links Saved");
                });
            }
        });
    });

    $("#quickLinksOptions").hide();
    $("#quickLinksOptionsHeader").click(function() {
        $("#quickLinksOptions").show();
        $("#backgroundOptions").hide();
        $("#weatherOptions").hide();
        $("#clockOptions").hide();
        $('#saveBtn').show();
        $('#closeOptions').hide();
        $("#socialOptions").hide();
        $("#zenModeOptions").hide();
        $("#todoListOptions").hide();
        $("#generalOptions").hide();
        $("#about").hide();
        $("#update").hide();
    });

    $('#quickLinksTextbox').hide();
    $("#addNewQuickLink").click(function() {
        $('#quickLinksTextbox').toggle();
    })

    $("#backgroundOptions").hide();
    $("#backgroundOptionsHeader").click(function() {
        $("#backgroundOptions").show();
        $("#weatherOptions").hide();
        $("#clockOptions").hide();
        $("#socialOptions").hide();
        $("#zenModeOptions").hide();
        $("#todoListOptions").hide();
        $('#saveBtn').show();
        $('#closeOptions').hide();
        $("#generalOptions").hide();
        $("#quickLinksOptions").hide();
        $("#about").hide();
        $("#update").hide();
    });

    $("#weatherOptions").hide();
    $("#weatherOptionsHeader").click(function() {
        $("#weatherOptions").show();
        $("#clockOptions").hide();
        $("#socialOptions").hide();
        $("#todoListOptions").hide();
        $("#generalOptions").hide();
        $("#zenModeOptions").hide();
        $('#saveBtn').show();
        $('#closeOptions').hide();
        $("#quickLinksOptions").hide();
        $("#backgroundOptions").hide();
        $("#about").hide();
        $("#update").hide();
    });

    $("#clockOptions").hide();
    $("#clockOptionsHeader").click(function() {
        $("#clockOptions").show();
        $("#socialOptions").hide();
        $("#todoListOptions").hide();
        $("#generalOptions").hide();
        $('#saveBtn').show();
        $('#closeOptions').hide();
        $("#zenModeOptions").hide();
        $("#quickLinksOptions").hide();
        $("#backgroundOptions").hide();
        $("#weatherOptions").hide();
        $("#about").hide();
        $("#update").hide();
    });

    $("#zenModeOptions").hide();
    $("#zenModeOptionsHeader").click(function() {
        $("#zenModeOptions").show();
        $("#clockOptions").hide();
        $('#saveBtn').hide();
        $('#closeOptions').show();
        $("#socialOptions").hide();
        $("#todoListOptions").hide();
        $("#generalOptions").hide();
        $("#quickLinksOptions").hide();
        $("#backgroundOptions").hide();
        $("#weatherOptions").hide();
        $("#about").hide();
        $("#update").hide();
    });

    $("#socialOptions").hide();
    $("#socialOptionsHeader").click(function() {
        $("#socialOptions").show();
        $("#todoListOptions").hide();
        $('#saveBtn').show();
        $('#closeOptions').hide();
        $("#generalOptions").hide();
        $("#quickLinksOptions").hide();
        $("#zenModeOptions").hide();
        $("#backgroundOptions").hide();
        $("#weatherOptions").hide();
        $("#clockOptions").hide();
        $("#about").hide();
        $("#update").hide();
    });

    $("#todoListOptions").hide();
    $("#todoListOptionsHeader").click(function() {
        $("#todoListOptions").show();
        $("#generalOptions").hide();
        $("#quickLinksOptions").hide();
        $("#backgroundOptions").hide();
        $('#saveBtn').show();
        $('#closeOptions').hide();
        $("#weatherOptions").hide();
        $("#clockOptions").hide();
        $("#socialOptions").hide();
        $("#zenModeOptions").hide();
        $("#about").hide();
        $("#update").hide();
    });

    $("#generalOptions").show();
    $("#generalOptionsHeader").click(function() {
        $("#generalOptions").show();
        $("#quickLinksOptions").hide();
        $("#backgroundOptions").hide();
        $("#weatherOptions").hide();
        $("#clockOptions").hide();
        $('#saveBtn').show();
        $('#closeOptions').hide();
        $("#socialOptions").hide();
        $("#todoListOptions").hide();
        $("#zenModeOptions").hide();
        $("#about").hide();
        $("#update").hide();
    });

    $("#about").hide();
    $("#aboutOptionsHeader").click(function() {
        $("#about").show();
        $("#update").hide();
        $("#generalOptions").hide();
        $("#quickLinksOptions").hide();
        $("#backgroundOptions").hide();
        $("#weatherOptions").hide();
        $("#clockOptions").hide();
        $('#saveBtn').hide();
        $("#zenModeOptions").hide();
        $("#socialOptions").hide();
        $("#todoListOptions").hide();
    });

    $("#update").hide();
    $("#updateOptionsHeader").click(function() {
        ga('send', 'event', 'new_update', 'click', 'opened');
        $('.notification').hide();
        $("#update").show();
        $("#about").hide();
        $('#saveBtn').hide();
        $("#generalOptions").hide();
        $("#quickLinksOptions").hide();
        $("#backgroundOptions").hide();
        $("#weatherOptions").hide();
        $("#clockOptions").hide();
        $("#zenModeOptions").hide();
        $("#socialOptions").hide();
        $("#todoListOptions").hide();
    });

    $("#saveBtn").click(function() {

        if($('#clockCustom').is(':checked')){
            console.log("checked");
            var arr = [true, parseInt($('#xAxis').val()), parseInt($('#yAxis').val())]
            chrome.storage.sync.set({ getClockLocation: arr });
        } else if($('#clockMiddle').is(':checked')) {
            var arr = [false, 50, 50]
            chrome.storage.sync.set({ getClockLocation: arr });
        }
        var clockOptions = {font:$('#clockFont').val(), opacity:$('#clockOpacity').val()/100, bold:$('#clockBold').prop('checked'), date:$('#dateShow').prop('checked')}
        chrome.storage.sync.set({ getClockFeatures: clockOptions });

        chrome.storage.sync.set({ showQuotes: $('#quoteShow').prop('checked') });

        var customRSSArr = {rss:$('#rss').prop('checked'), RSSURL:$("#rssTextbox").val() }
        chrome.storage.sync.set({ 'customRSS':customRSSArr });

        window.CalendarSelector.saveSelectionToStorage()

        location.reload();
    });


    $(".playZen").click(function() {

        var vid = $(this).attr('id');
        $('#zenVideoPlayer iframe').attr('src', "https://youtube.com/embed/" + vid + "?autoplay=1&controls=0&showinfo=0&autohide=1&iv_load_policy=3&vq=HD1080");
        $('#zenVideoPlayer').show();
        ga('send', 'event', 'played_zen', 'click', 'button');

    });

    $('#zenCustomVideo').keypress(function(e) {
        if (e.keyCode == 13) {
            var video_id = $('#zenCustomVideo').val().split('v=')[1];
            var ampersandPosition = video_id.indexOf('&');
            if (ampersandPosition != -1) {
                video_id = video_id.substring(0, ampersandPosition);
            }
            $('#zenVideoPlayer iframe').attr('src', "https://youtube.com/embed/" + video_id + "?autoplay=1&controls=0&showinfo=0&autohide=1&iv_load_policy=3");
            $('#zenVideoPlayer').show();
            ga('send', 'event', 'played_custom_zen', 'click', 'button');
        }
    });

    chrome.storage.sync.get({ 'getClockLocation': [false, 50, 50] }, function(result) {
            $('#time').css({
                top: result.getClockLocation[1]+'%',
                left: result.getClockLocation[2]+'%'
            });
            $('#greeting').css({
                top: result.getClockLocation[1]+'%',
                left: result.getClockLocation[2]+'%'
            });
            $('#timeDate').css({
                top: result.getClockLocation[1]+'%',
                left: result.getClockLocation[2]+'%'
            });
            $('#xAxis').val(result.getClockLocation[1]);
            $('#yAxis').val(result.getClockLocation[2]);

            if(result.getClockLocation[0] === true) {
                $('#clockCustom').prop("checked", true);
                $('#xAxis').removeAttr('disabled');
                $('#yAxis').removeAttr('disabled');
            } else {
                $('#clockMiddle').prop("checked", true);
            }
    });

    chrome.storage.sync.get({ 'getClockFeatures': {font:'helvetica neue', opacity:0.9, bold:false, date:false} }, function(result) {
            $('#time').css({
                'font-family': result.getClockFeatures.font,
                opacity: result.getClockFeatures.opacity
            });
            $('#timeDate').css({
                'font-family': result.getClockFeatures.font,
                opacity: result.getClockFeatures.opacity
            });
            if(result.getClockFeatures.bold) {
                $('#time').css({
                    'font-weight': 'bold'
                });
            } else {
                $('#time').css({
                    'font-weight': 500
                });
            }

            if(result.getClockFeatures.date) {
                $('#timeDate').css({
                    'display': 'block'
                });
                $('#dateShow').prop("checked", true);
            } else {
                $('#timeDate').css({
                    'display': 'none'
                });
            }


            console.log(result)
            $('#clockOpacity').val(Math.floor(result.getClockFeatures.opacity*100));
            $('#clockBold').prop("checked", result.getClockFeatures.bold);
            $("#clockFont").val(result.getClockFeatures.font);

    });

    $('#xAxis').on('input', function() {
        $('#time').css('top', $('#xAxis').val()+"%");
    });
    $('#yAxis').on('input', function() {
        $('#time').css('left', $('#yAxis').val()+"%");
    });
    $('#clockOpacity').on('input', function() {
        $('#time').css('opacity', $('#clockOpacity').val()/100);
    });

    $('input[type=radio][name=clockLocation]').on('change', function() {
         switch($(this).val()) {
             case 'clockMiddle':
                 $('#xAxis').attr('disabled');
                 $('#yAxis').attr('disabled');
                 $('#time').css({
                     top: '50%',
                     left: '50%'
                 });
                 break;
             case 'clockCustom':
                 $('#xAxis').removeAttr('disabled');
                 $('#yAxis').removeAttr('disabled');
                 break;
         }
    });

    $('#clockFont').children('option').each(function () {
        $(this).css('font-family', $(this).attr('value'));
    });

    chrome.storage.sync.get({ 'showQuotes': true }, function(result) {
        if(result.showQuotes === true) {
            $('#quoteShow').prop('checked', 'true');
            getQuotes();
        }
    });

    $('.newsOption').change(function(){
        var value = $(this).val();
        $('#newsArticles').html('');
        newsOutlet(value);
        chrome.storage.sync.set({ newsOption: $(this).val() });
    });

    chrome.storage.sync.get({ 'customRSS': {rss:false, RSSURL:""} }, function(result) {
        if(result.customRSS.rss) {
            $('#rss').prop('checked', 'true');
            $('#rssTextbox').val(result.customRSS.RSSURL);
            newsOutlet(result.customRSS.RSSURL, true);
            $('#news').children('#optionsGreeting').html("Custom RSS");
        } else {
            $('#rssTextbox').val(result.customRSS.RSSURL);
            getNews();
        }
    });

    //Google search

    var googleSearchIframeName = "cse-search-results";
    var googleSearchFormName = "cse-search-box";
    var googleSearchFrameWidth = 800;
    var googleSearchDomain = "www.google.com";
    var googleSearchPath = "";

    // Standard Google Universal Analytics code
    (function(i, s, o, g, r, a, m) {
        i['GoogleAnalyticsObject'] = r;
        i[r] = i[r] || function() {
            (i[r].q = i[r].q || []).push(arguments)
        }, i[r].l = 1 * new Date();
        a = s.createElement(o),
            m = s.getElementsByTagName(o)[0];
        a.async = 1;
        a.src = g;
        m.parentNode.insertBefore(a, m)
    })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga'); // Note: https protocol here

    ga('create', 'UA-61284683-1', 'auto');
    ga('set', 'checkProtocolTask', function() {}); // Removes failing protocol check. @see: http://stackoverflow.com/a/22152353/1958200
    ga('require', 'displayfeatures');
    ga('send', 'pageview', '/index.html');
}, 0);

//});
