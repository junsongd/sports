var admobid = {}
if (/(android)/i.test(navigator.userAgent)) {
  admobid = {
    banner: 'ca-app-pub-4468518752177103/9253504274',
    interstitial: 'ca-app-pub-4468518752177103/9982697476',
  }
} else if (/(ipod|iphone|ipad)/i.test(navigator.userAgent)) {  // for ios
  admobid = {
    banner: 'ca-app-pub-4468518752177103/1730237476',
    interstitial: 'ca-app-pub-4468518752177103/3936163872',
  }
}

document.addEventListener('deviceready', function() {
  admob.banner.config({
    id: admobid.banner,
    autoShow: true,
  });
  admob.banner.prepare();

  admob.interstitial.config({
    id: admobid.interstitial,
    autoShow: true,
  });
  admob.interstitial.prepare();
}, false);