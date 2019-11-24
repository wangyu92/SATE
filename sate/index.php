<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, user-scalable=no">
    <title>Adaptive Streaming in HTML5</title>
    <link rel="stylesheet" type="text/css" href="css/index.css">
</head>

<body>
    <h2>Wangyu's Bitrate Adaptation Player in DASH</h2>
    <video id="videoPlayer" controls></video>

    <script src="dash.js/dist/dash.all.min.js"></script>
    <script>
            (function(){
                var url = "https://dash.akamaized.net/envivio/EnvivioDash3/manifest.mpd";
                var player = dashjs.MediaPlayer().create();
                player.initialize(document.querySelector("#videoPlayer"), url, true);
            })();
    </script>
</body>

</html>
