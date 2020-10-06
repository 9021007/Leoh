function newsOutlet(media, custom) {
    if(!custom) {
        $.getJSON('http://www.reddit.com/r/' + media + '.json?limit=10',
        function(news) {
            for (var pos = 0; pos <= 5; pos++) {
                var newsTitle = news.data.children[pos].data.title;
                var newsURL = news.data.children[pos].data.url;
                var newsCreated = news.data.children[pos].data.created_utc;
                var newsDomain = news.data.children[pos].data.domain;
                var is_self = news.data.children[pos].data.is_self;

                if(is_self == true) {
                    console.log(newsTitle);
                } else {
                var iImage = "http://" + newsDomain + "/apple-touch-icon.png";
                var favicon = "https://plus.google.com/_/favicon?domain_url=" + newsDomain;

                $('#newsArticles').append(
                    '<a href="' +
                    newsURL + '" base target="_blank"><div id="newsHighlight"><img id="newsLogo" src="' + favicon + '"/><p id="newsHeadline">' +
                    newsTitle +
                    '</p><p id="newsUnderbar">' +
                    newsDomain +
                    ' - <span data-livestamp="' + newsCreated + '"></span></p></div></a>');
                    }
                }

            }
        )
    } else {
        $.ajax({
          url      : 'https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=10&callback=?&q=' + encodeURIComponent(media) + '?nocache',
          dataType : 'json',
          success  : function (data) {
            if (data.responseData.feed && data.responseData.feed.entries) {
              $.each(data.responseData.feed.entries, function (i, e) {
                var newsTitle = e.title;
                var newsURL = e.link;
                var newsCreated = e.publishedDate;
                var a = document.createElement('a');
                a.setAttribute('href', e.link)
                var newsDomain = a.hostname.replace("www.", "");

                var iImage = "http://" + newsDomain + "/apple-touch-icon.png";
                var favicon = "https://plus.google.com/_/favicon?domain_url=" + newsDomain;

                $('#newsArticles').append(
                    '<a href="' +
                    newsURL + '" base target="_blank"><div id="newsHighlight"><img id="newsLogo" src="' + favicon + '"/><p id="newsHeadline">' +
                    newsTitle +
                    '</p><p id="newsUnderbar">' +
                    newsDomain +
                    ' - <span data-livestamp="' + newsCreated + '"></span></p></div></a>');
              });
            }
          }
        });
    }
}
