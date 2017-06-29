var admobid = {}
if (/(android)/i.test(navigator.userAgent)) {
  admobid = {
    banner: 'ca-app-pub-9948820751707625/7884995598',
    interstitial: 'ca-app-pub-9948820751707625/1838461995',
  }
} else if (/(ipod|iphone|ipad)/i.test(navigator.userAgent)) {  // for ios
  admobid = {
    banner: 'ca-app-pub-9948820751707625/7884995598',
    interstitial: 'ca-app-pub-9948820751707625/1838461995',
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