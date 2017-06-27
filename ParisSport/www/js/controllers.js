angular.module('starter.controllers', [])
.controller('AppCtrl', function($scope, $http, $localStorage, $state, $ionicHistory, $ionicSideMenuDelegate,$translate){
	if(rtl_language) $scope.menuDirection = "right";
	else $scope.menuDirection = "left";
	$localStorage.category = [];
	var overCategory;
	var pageCategory = 1;
	$scope.loadCategory = function(){
		if(!overCategory){
			$http.get(wordpress_url+'/wp-json/wp/v2/categories',{
				params:{"page":pageCategory,"per_page":100}
			}).then(function(response){
				$localStorage.category = $localStorage.category.concat(response.data);
				if(response.data.length == 0) {
					$scope.loaded();
					overCategory = true;
				} else {
					pageCategory++;
					$scope.loadCategory();
				}
			});
		}
	};
	$scope.loadCategory();
	$scope.loaded = function(){
		$scope.category = $localStorage.category;
		$scope.categoryParent = [];
		$scope.categoryChild = {};
		angular.forEach($scope.category, function(item){
			if(item.parent == 0) $scope.categoryParent.push(item);
			else{
				if(!$scope.categoryChild[item.parent]) $scope.categoryChild[item.parent] = [];
				$scope.categoryChild[item.parent].push(item);
			}
		});
		$scope.openCategory = function(id,child){
			if(!child) $scope.now = id;
			$scope.categoryNowChild = [];
			if(angular.isArray($scope.categoryChild[id])){
				$scope.categoryNowChild = $scope.categoryChild[id];
			}else{
				$ionicHistory.nextViewOptions({
					disableAnimate: true,
					disableBack: true,
					historyRoot: true
				});
				if(rtl_language) $ionicSideMenuDelegate.toggleRight(false);
				else $ionicSideMenuDelegate.toggleLeft(false);
				$state.go("app.category",{id:id});
			}
		};
	};
	$scope.loaded();
	$scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
		if($state.current.name=="app.home") $scope.now = "home";
		else if($state.current.name=="app.photo") $scope.now = "photo";
		else if($state.current.name=="app.video") $scope.now = "video";
	});
	$scope.$watch(
		function() {
		  return $ionicSideMenuDelegate.isOpen();
		}, 
		function(isOpen){
			if(!isOpen){
				$scope.categoryNowChild = [];
				if($state.current.name=="app.home") $scope.now = "home";
				else if($state.current.name=="app.photo") $scope.now = "photo";
				else if($state.current.name=="app.video") $scope.now = "video";
			}
		}
	);
})
.controller('LastestCtrl', function($scope, $http ,$translate){
	$scope.latest = [];
	$scope.page = 1;
	$scope.load = function(isRefreshing){
		$http.get(wordpress_url+'/wp-json/wp/v2/posts' ,{
			params:{"page":$scope.page,"per_page":wordpress_per_page}
		}).then(function(response){
			if(isRefreshing) {
				$scope.latest = [];
				$scope.over = false;
			}
			$scope.refreshing = false;
			if(response.data.length == 0) {
				$scope.page = $scope.page -1;
				$scope.over = true;
			}
			angular.forEach(response.data, function(item){
				item.time = new Date(item.date_gmt).getTime();
				$scope.latest.push(item);
			});
			$scope.$broadcast('scroll.infiniteScrollComplete');
			$scope.page = $scope.page +1;
		});
	};
	$scope.doRefresh = function(){
		$scope.$broadcast('scroll.refreshComplete');
		$scope.page = 1;
		$scope.over = true;
		$scope.$apply();
		$scope.refreshing = true;
		$scope.load(true);
	};
})
.controller('TopnewsCtrl', function($scope, $http,$translate){
	$scope.topnews = [];
	$scope.page = 1;
	$scope.load = function(isRefreshing){
		$http.get(wordpress_url+'/wp-json/wp/v2/posts?filter[orderby]=post_views&filter[order]=desc' ,{
			params:{"page":$scope.page,"per_page":wordpress_per_page}
		}).then(function(response){
			if(isRefreshing) {
				$scope.topnews = [];
				$scope.over = false;
			}
			$scope.refreshing = false;
			if(response.data.length == 0) {
				$scope.page = $scope.page -1;
				$scope.over = true;
			}
			angular.forEach(response.data, function(item){
				item.time = new Date(item.date_gmt).getTime();
				$scope.topnews.push(item);
			});
			$scope.$broadcast('scroll.infiniteScrollComplete');
			$scope.page = $scope.page +1;
		});
	};
	$scope.doRefresh = function(){
		$scope.$broadcast('scroll.refreshComplete');
		$scope.page = 1;
		$scope.over = true;
		$scope.$apply();
		$scope.refreshing = true;
		$scope.load(true);
	};
})
.controller('VideoCtrl', function($scope, $http,$translate){
	$scope.videos = [];
	$scope.page = 1;
	$scope.load = function(isRefreshing){
		$http.get(wordpress_url+'/wp-json/wp/v2/posts?filter[post_format]=post-format-video' ,{
			params:{"page":$scope.page,"per_page":wordpress_per_page}
		}).then(function(response){
			if(isRefreshing) {
				$scope.videos = [];
				$scope.over = false;
			}
			$scope.refreshing = false;
			if(response.data.length == 0) {
				$scope.page = $scope.page -1;
				$scope.over = true;
			}
			angular.forEach(response.data, function(item){
				item.time = new Date(item.date_gmt).getTime();
				$scope.videos.push(item);
			});
			$scope.$broadcast('scroll.infiniteScrollComplete');
			$scope.page = $scope.page +1;
		});
	};
	$scope.doRefresh = function(){
		$scope.$broadcast('scroll.refreshComplete');
		$scope.page = 1;
		$scope.over = true;
		$scope.$apply();
		$scope.refreshing = true;
		$scope.load(true);
	};
})
.controller('TrendingCtrl', function($scope, $http, $ionicScrollDelegate,$translate){
	$scope.trending = [];
	$scope.page = 1;
	$scope.load = function(isRefreshing){
		$http.get(wordpress_url+'/wp-json/wp/v2/posts?filter[orderby]=comment_count&filter[order]=desc' ,{
			params:{"page":$scope.page,"per_page":wordpress_per_page}
		}).then(function(response){

		   if(isRefreshing) {
				$scope.trending = []; 
			}
			$scope.refreshing = false;
			if(response.data.length == 0) {
				$scope.page = $scope.page -1;
				$scope.over = true;
			}
			angular.forEach(response.data, function(item){
				item.time = new Date(item.date_gmt).getTime();
				$scope.trending.push(item);
			});
			$scope.$broadcast('scroll.infiniteScrollComplete');
			$scope.page = $scope.page +1;
		});
	};
	$scope.doRefresh = function(){
		$scope.$broadcast('scroll.refreshComplete');
		$scope.page = 1;
		$scope.over = true;
		$scope.$apply();
		$scope.refreshing = true;
		$scope.load(true);
	};
})
.controller('DetailCtrl', function($scope, $http, $sce, $state, $stateParams, $ionicPopover, $localStorage, $ionicPopup, IonicClosePopupService, $ionicHistory,$translate){
	if(angular.isUndefined($localStorage.bookmark)) $localStorage.bookmark = {};
	$scope.$sce = $sce;
	$scope.posts = Number($stateParams.id);
	$scope.incategory = [];
	$scope.page = 1;
	var msg = "";
	if(angular.isDefined($localStorage.bookmark[$scope.posts])) $scope.bookmarked = true;
	  msg =  $translate.instant('loading'); 
	 $scope.showLoading(msg);
	$scope.$on('$stateChangeStart', function(event, toState, toParams){
		var iframe = document.querySelectorAll('iframe');
		for(var i=0; i < iframe.length; i++){
			if(iframe[i].src.indexOf("youtube.com") != -1){
				iframe[i].contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
			}
		}
	});
	$http.get(wordpress_url+'/wp-json/wp/v2/posts/'+$scope.posts)
	.then(function(response){
		$scope.loadDetail = true;
		var tmp = document.createElement('div');
		tmp.innerHTML = response.data.content.rendered;
		var a = tmp.querySelectorAll('a');
		for(var i=0; i<a.length; i++){
			var attributes = "openLink('"+a[i].getAttribute('href')+"')";
			a[i].setAttribute("ng-click", attributes);
			a[i].setAttribute("href", "javascipt:void(0)");
		}
		var iframe = tmp.querySelectorAll('iframe');
		for (var i = 0; i < iframe.length; i++) {
			if(iframe[i].src.indexOf("youtube.com") != -1){
				if(iframe[i].src.split('?').length > 1) iframe[i].src += "&enablejsapi=1";
				else iframe[i].src += "?enablejsapi=1";
			}
		}
		response.data.content.rendered = tmp.innerHTML;
		$scope.data = response.data;
		$scope.data.time = new Date($scope.data.date).getTime();
		$scope.load = function(){
			$http.get(wordpress_url+'/wp-json/wp/v2/posts?categories='+$scope.data.categories[0] ,{
				params:{"exclude":$scope.posts,"page":$scope.page,"per_page":4}
			}).then(function(response){
				if(response.data.length == 0) {
					$scope.page = $scope.page -1;
					$scope.over = true;
				}
				angular.forEach(response.data, function(item){
					$scope.incategory.push(item);
				});
				$scope.$broadcast('scroll.infiniteScrollComplete');
				$scope.page = $scope.page +1;
			});
		};
		$http.get(wordpress_url+'/wp-json/mobiconnector/post/counter_view?post_id='+$scope.posts)
		.then(function(){ $scope.hideLoading(); });
	});
	$scope.onDrag = function(e){
		switch(e.gesture.direction){
			case "left":
				if(Math.abs(e.gesture.deltaX) > 5 && Math.abs(e.gesture.deltaY) < 50){
					if($scope.data.mobiconnector_next_id){
						$ionicHistory.currentView($ionicHistory.backView());
						$state.go('app.news', {id:$scope.data.mobiconnector_next_id}, {location:'replace'});
					}
				}
				break;
			case "right":
				if(Math.abs(e.gesture.deltaX) > 5 && Math.abs(e.gesture.deltaY) < 50){
					if($scope.data.mobiconnector_previous_id){
						$ionicHistory.currentView($ionicHistory.backView());
						$state.go('app.news', {id:$scope.data.mobiconnector_previous_id}, {location:'replace'});
					}
				}
				break;
		}
	};
	$scope.share = function(){
		window.plugins.socialsharing.share(null,null,null,$scope.data.link);
	};
	$ionicPopover.fromTemplateUrl('templates/dailynews/menu.html', {
		scope: $scope
	}).then(function(popover){
		$scope.popover = popover;
	});
	$scope.openPopover = function($event) {
		$scope.popover.show($event);
	};
	$scope.closePopover = function($event) {
		$scope.popover.hide($event);
	};
	$scope.showPopupText = function() {
		$scope.closePopover();
		var popup = $ionicPopup.show({
			title: 'Choose default text size for story pages',
			templateUrl:'templates/popup/text.html',
			cssClass: 'popup-choose',
			scope: $scope
		});
		$scope.closePopupText = function(){popup.close()};
		IonicClosePopupService.register(popup);
	};
	$scope.settings = {};
	if(angular.isDefined($localStorage.textSize)) $scope.settings.text = $localStorage.textSize;
	else $scope.settings.text = "normal";
	$scope.$watch('settings.text', function(newVal, oldVal){
		if(newVal != oldVal) {
			$scope.closePopupText();
			$localStorage.textSize = newVal;
		}
	});
	$scope.bookmark = function(){
		$scope.closePopover();
		if($scope.bookmarked){
			delete $localStorage.bookmark[$scope.posts];
			$scope.bookmarked = false;
			 msg =  $translate.instant('removeBookmark'); 
			window.plugins.toast.showShortBottom(msg);
		} else {
			$localStorage.bookmark[$scope.posts] = true;
			$scope.bookmarked = true;
			 msg =  $translate.instant('bookmarkSuccess');  
			window.plugins.toast.showShortBottom(msg);
		}
	};
})
.controller('PhotoCtrl', function($scope, $http, $ionicScrollDelegate,$translate){
	$scope.photos = [];
	$scope.page = 1;
	$scope.load = function(isRefreshing){
		$http.get(wordpress_url+'/wp-json/wp/v2/posts?filter[post_format]=post-format-image' ,{
			params:{"page":$scope.page,"per_page":wordpress_per_page}
		}).then(function(response){
			if(isRefreshing) {
				$scope.photos = [];
				$scope.over = false;
			}
			$scope.refreshing = false;
			if(response.data.length == 0) {
				$scope.page = $scope.page -1;
				$scope.over = true;
			}
			angular.forEach(response.data, function(item){
				item.time = new Date(item.date_gmt).getTime();
				$scope.photos.push(item);
			});
			$scope.$broadcast('scroll.infiniteScrollComplete');
			$scope.page = $scope.page +1;
		});
	};
	$scope.doRefresh = function(){
		$scope.$broadcast('scroll.refreshComplete');
		$scope.page = 1;
		$scope.over = true;
		$scope.$apply();
		$scope.refreshing = true;
		$scope.load(true);
	};
})
.controller('PhotoDetail', function($scope, $state, $http, $sce, $stateParams, $localStorage, $ionicSlideBoxDelegate, $ionicHistory,$translate){
	if(angular.isUndefined($localStorage.bookmark)) $localStorage.bookmark = {};
	$scope.$sce = $sce;
	$scope.posts = $stateParams.id;
	var msg = "";
	 msg =  $translate.instant('loading'); 
	$scope.showLoading(msg);
	if(angular.isDefined($localStorage.bookmark[$scope.posts])) $scope.bookmarked = true;
	$http.get(wordpress_url+'/wp-json/wp/v2/posts/'+$scope.posts)
	.then(function(response){
		$scope.data = response.data;
		$scope.code = $sce.trustAsHtml($scope.data.content.rendered);
		$scope.list = [];
		var tmp = document.createElement('div');
		tmp.innerHTML = $scope.code;
		var img = tmp.querySelectorAll('img');
		for(var i=0; i<img.length; i++){
			var nowImg = {};
			nowImg.src = img[i].getAttribute('src');
			nowImg.title = img[i].getAttribute('title');
			nowImg.alt = img[i].getAttribute('alt');
			$scope.list.push(nowImg);
		}
		$scope.hideLoading();
		$ionicSlideBoxDelegate.update();
		$scope.share = function(){
			window.plugins.socialsharing.share(null, null, $scope.data.mobiconnector_feature_image.source_url, null);
		};
	});
	$scope.onRelease = function(e, index){
		if(index != 0 && index != $scope.list.length-1) return;
		switch(e.gesture.direction){
			case "left":
				if(Math.abs(e.gesture.deltaX) > 100 && Math.abs(e.gesture.deltaY) < 50){
					if(index == $scope.list.length-1 && $scope.data.mobiconnector_next_id){
						$ionicHistory.currentView($ionicHistory.backView());
						$state.go('app.newsPhoto', {id:$scope.data.mobiconnector_next_id});
					}
				}
				break;
			case "right":
				if(Math.abs(e.gesture.deltaX) > 100 && Math.abs(e.gesture.deltaY) < 50){
					if(index == 0 && $scope.data.mobiconnector_previous_id){
						$ionicHistory.currentView($ionicHistory.backView());
						$state.go('app.newsPhoto', {id:$scope.data.mobiconnector_previous_id});
					}
				}
				break;
		}
	};
	$scope.bookmark = function(){
		if($scope.bookmarked){
			delete $localStorage.bookmark[$scope.posts];
			$scope.bookmarked = false;
			 msg =  $translate.instant('removeBookmark'); 
			window.plugins.toast.showShortBottom(msg);
		} else {
			$localStorage.bookmark[$scope.posts] = true;
			$scope.bookmarked = true;
		    msg =  $translate.instant('bookmarkSuccess');  
			window.plugins.toast.showShortBottom(msg);
		}
	};
})
.controller('CommentCtrl', function($scope, $http, $state, $sce, $stateParams, $localStorage, $ionicScrollDelegate,$translate){
	$scope.comments = [];
	$scope.page = 1;
	$scope.$sce = $sce;
	$scope.posts = $stateParams.id;
    var msg = "";
	$scope.load = function(){
		$http.get(wordpress_url+'/wp-json/wp/v2/comments?post='+$scope.posts ,{
			params:{"orderBy":"date","order":"desc","page":$scope.page,"per_page":10}
		}).then(function (response){
			if(response.data.length == 0) {
				$scope.page = $scope.page -1;
				$scope.overComments = true;
			}
			angular.forEach(response.data, function(item){
				item.time = new Date(item.date_gmt).getTime();
				$scope.comments.push(item);
			});
			$scope.$broadcast('scroll.infiniteScrollComplete');
			$scope.page = $scope.page +1;
		});
	};
	$scope.data = {}; 
	$scope.AddAComment = function(){
		if(angular.isDefined($localStorage.login)){
			 msg =  $translate.instant('loading');
		    $scope.showLoading(msg);
			$scope.checkToken().then(function(response){
				$http({
					method: 'POST',
					url: wordpress_url+'/wp-json/wp/v2/comments',
					data: {'content':$scope.data.content,'post':$scope.posts},
					cache: false,
					headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'Authorization': 'Bearer '+$localStorage.login.token},
					withCredentials: true,
					transformRequest: function(obj) {
							var str = [];
							for(var p in obj)
							str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
							return str.join("&");
					}
				}).success(function(){
					$state.reload();
					$scope.hideLoading();
					delete $scope.data.content;
				}).error(function(response){
					$scope.hideLoading();
					if(response == null){
						 msg =  $translate.instant('msgSent');
						window.plugins.toast.showShortBottom(msg);
					} else {
						window.plugins.toast.showShortBottom(response.message);
					}
				});
			}).catch(function(){
				$scope.hideLoading();
				$scope.autoLogin();
			});
		} else $state.go('app.login');
	};
})
.controller('CategoryCtrl', function($scope, $http, $sce, $stateParams, $ionicScrollDelegate,$translate){
	$scope.$sce = $sce;
	$scope.category = [];
	$scope.page = 1;
	$scope.load = function(){
		$http.get(wordpress_url+'/wp-json/wp/v2/posts?categories='+$stateParams.id, {
			params:{"page":$scope.page,"per_page":wordpress_per_page}
		}).then(function(response){
			$scope.refreshing = false;
			if(response.data.length == 0) {
				$scope.page = $scope.page -1;
				$scope.over = true;
			}
			angular.forEach(response.data, function(item){
				item.time = new Date(item.date_gmt).getTime();
				$scope.category.push(item);
			});
			$scope.$broadcast('scroll.infiniteScrollComplete');
			$scope.page = $scope.page +1;
		});
	};
	$scope.doRefresh = function(){
		$scope.$broadcast('scroll.refreshComplete');
		$scope.page = 1;
		$scope.over = true;
		$scope.$apply();
		$scope.refreshing = true;
		$scope.load(true);
	};
    var msg =  $translate.instant('loading');
	 $scope.showLoading(msg);
	$http.get(wordpress_url+'/wp-json/wp/v2/categories/'+$stateParams.id)
	.then(function(response){
		$scope.nameCategory = response.data;
		$scope.hideLoading();
	});
})
.controller('SettingsCtrl', function($scope, $state, $http, $ionicPopup, $localStorage, IonicClosePopupService, Camera,$translate){
	$scope.login = $localStorage.login;
	if($scope.login) {
		$http.post(wordpress_url+'/wp-json/mobiconnector/user/get_info',{
			email: $scope.login.user_nicename
		},{
			cache: false,
			headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'Authorization': 'Bearer '+$scope.login.token},
			withCredentials: true,
			transformRequest: function(obj) {
					var str = [];
					for(var p in obj)
					str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
					return str.join("&");
			}
		}).then(function(response){
			$scope.login.avatar = response.data.wp_user_avatar;
		}).catch(function(error){
			window.plugins.toast.showShortBottom(error.data.message);
		});
	}
	$scope.settings = {};
	// $scope.settings.theme = "1";
	// $scope.showPopupTheme = function() {
		// var popup = $ionicPopup.show({
			// title: 'Choose application theme',
			// templateUrl:'templates/popup/theme.html',
			// cssClass: 'popup-choose',
			// scope: $scope
		// });
		// $scope.closePopupTheme = function(){popup.close()};
		// IonicClosePopupService.register(popup);
	// };
	// $scope.$watch('settings.theme', function(newVal, oldVal){
		// if(newVal != oldVal) $scope.closePopupTheme();
	// });
	if(angular.isDefined($localStorage.textSize)) $scope.settings.text = $localStorage.textSize;
	else $scope.settings.text = "normal";
	$scope.showPopupText = function() {
		var popup = $ionicPopup.show({
			scope: $scope,
			title: 'Choose default text size for story pages',
			templateUrl:'templates/popup/text.html',
			cssClass: 'popup-choose'
		});
		$scope.closePopupText = function(){popup.close()};
		IonicClosePopupService.register(popup);
	};
	$scope.$watch('settings.text', function(newVal, oldVal){
		if(newVal != oldVal) {
			$scope.closePopupText();
			$localStorage.textSize = newVal;
		}
	});
	if(angular.isDefined($localStorage.notification))
		$scope.settings.notification = $localStorage.notification;
	else $scope.settings.notification = true;
	$scope.$watch('settings.notification', function(newVal, oldVal){
		if(newVal != oldVal) {
			if(newVal){
				$localStorage.notification = true;
				if(window.plugins) window.plugins.OneSignal.setSubscription(true);
			} else {
				$localStorage.notification = false;
				if(window.plugins) window.plugins.OneSignal.setSubscription(false);
			}
		}
	});
	$scope.editAvatar = function(){
		var options = {
			sourceType:0,
			allowEdit:true,
			targetWidth:160,
			targetHeight:160,
			destinationType:0
		};
		Camera.getPicture(options).then(function(imageData) {
			$scope.avatar = "data:image/jpeg;base64,"+imageData;
			 var msg =  $translate.instant('loading');
		    $scope.showLoading(msg);
			$scope.checkToken().then(function(response){
				$http.post(wordpress_url+'/wp-json/mobiconnector/user/update_profile',{
					user_profile_picture: $scope.avatar
				},{
					cache: false,
					headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'Authorization': 'Bearer '+$scope.login.token},
					withCredentials: true,
					transformRequest: function(obj) {
							var str = [];
							for(var p in obj)
							str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
							return str.join("&");
					}
				}).then(function(response){
					$scope.hideLoading();
					$scope.login.avatar = $scope.avatar;
				}).catch(function(error){
					$scope.hideLoading();
					window.plugins.toast.showShortBottom(error.data.message);
				});
			}).catch(function(){
				$scope.hideLoading();
				$scope.autoLogin();
			});
		}, function(err) {
			console.log(err);
		});
	};
	$scope.showLogout = function() {
		var title =    $translate.instant('logoutMsg');
		var yesButton =    $translate.instant('yes');
		var noButton =    $translate.instant('no'); 
	    var confirmPopup = $ionicPopup.show({
		 title: title,
		 cssClass: 'popup-confirm',
		 buttons:[
			{
				text:yesButton,
				type:'bar-button',
				onTap: function(e){
					delete $localStorage.login;
					$state.reload();
				}
			},
			{
				text:noButton,
				type:'bar-button'
			}
		]
	   });
	};
	$scope.rateApp = function(){
		if(ionic.Platform.isAndroid())
		cordova.InAppBrowser.open("market://details?id="+android_packageName, "_system");
		else cordova.InAppBrowser.open("itms-apps://itunes.apple.com/app/id"+apple_id+"?mt=8", "_system");
	};
	$scope.shareApp = function(){
		if(ionic.Platform.isAndroid())
		window.plugins.socialsharing.share(null,null,null,"https://play.google.com/store/apps/details?id="+android_packageName);
		else window.plugins.socialsharing.share(null,null,null,"https://itunes.apple.com/app/id"+apple_id+"?mt=8");
	};
})
.controller('BookmarkCtrl', function($scope, $http, $localStorage, $sce, $stateParams, $ionicTabsDelegate,$translate){
    var msg = "";
	if($stateParams.type == "photo") setTimeout(function(){ $ionicTabsDelegate.select(1); },10);
	$scope.$sce = $sce;
	
	if($localStorage.bookmark && angular.isObject($localStorage.bookmark)){
	    msg =  $translate.instant('loading');
		$scope.showLoading(msg);
		$scope.include = [];
		angular.forEach($localStorage.bookmark, function(value, key){
			$scope.include.push(key);
		});
		$scope.include = $scope.include.join(",");
		$http.get(wordpress_url+'/wp-json/wp/v2/posts',{
			params:{"include":$scope.include}
		}).then(function(response){
			$scope.news = response.data;
			angular.forEach($scope.news, function(item){
				item.time = new Date(item.date_gmt).getTime();
			});
			$scope.hideLoading();
		},function(error){ 
			$scope.hideLoading();
		});
		$scope.deleteNews = function(id){
			delete $localStorage.bookmark[id];
			angular.forEach($scope.news, function(item){
				if(item.id == id) item.remove = true;
			});
		};
	}
})
.controller('LoginCtrl', function($scope, $state, $http, $localStorage, $ionicHistory, base64, $stateParams,$translate){
	$scope.dataLogin = $stateParams;
	$scope.data = {};
	var msg = "";
	$scope.login = function(){
	    msg =  $translate.instant('loading');
		$scope.showLoading(msg);
		$http.post(wordpress_url+'/wp-json/jwt-auth/v1/token', {
			username: $scope.data.username,
			password: $scope.data.password
		},{
			cache: false,
			headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
			withCredentials: true,
			transformRequest: function(obj) {
					var str = [];
					for(var p in obj)
					str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
					return str.join("&");
			}
		}).then(function(response){
			$scope.hideLoading();
			$localStorage.login = response.data;
			$localStorage.login.user_nicename = $scope.data.username;
			$scope.base = {};
			$scope.base.one = base64.encode($scope.data.username);
			$scope.base.two = base64.encode($scope.data.password);
			$localStorage.login.base = $scope.base;
			$ionicHistory.goBack();
		}).catch(function(error){
			$scope.hideLoading();
			 msg =  $translate.instant('invalidCredentials');
			window.plugins.toast.showShortBottom(msg);
		});
	};
	if($scope.dataLogin.username && $scope.dataLogin.password){
		$scope.data = $scope.dataLogin;
		$scope.login();
	}
	else if(angular.isDefined($localStorage.login)) $ionicHistory.goBack();
})
.controller('ForgotCtrl', function($scope, $http, $state,$translate){
	$scope.data = {};
	var msg = "";
	$scope.reset = function(){
		msg =  $translate.instant('loading');
		$scope.showLoading(msg);
		$http.post(wordpress_url+'/wp-json/mobiconnector/user/forgot_password',{
			email: $scope.data.email,
		},{
			cache: false,
			headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
			withCredentials: true,
			transformRequest: function(obj) {
					var str = [];
					for(var p in obj)
					str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
					return str.join("&");
			}
		}).then(function(response){
			$scope.hideLoading();
			$state.go('app.login');
		    msg =  $translate.instant('resetpwlink');
			window.plugins.toast.showShortBottom(msg);
		}).catch(function(error){
			$scope.hideLoading();
			window.plugins.toast.showShortBottom(error.data.message);
		});
	};
})
.controller('SignupCtrl', function($scope, $http, $state,$translate){
	$scope.data = {};
	var msg = ""; 					

	$scope.register = function(){
		if(!$scope.data.username){
			msg =  $translate.instant('userNameRequired');
			window.plugins.toast.showShortBottom(msg);
		}
		if(!$scope.data.email){
			msg =  $translate.instant('emailRequired');
			window.plugins.toast.showShortBottom(msg);
		}
		else if(!$scope.data.password){
			msg =  $translate.instant('passwordRequired');
			window.plugins.toast.showShortBottom(msg);
		}
		else if(!$scope.data.repass){
			msg =  $translate.instant('passwordRequired');
			window.plugins.toast.showShortBottom(msg);
		}
		else if(!$scope.data.name.first || !$scope.data.name.last){
			msg =  $translate.instant('nameRequired');
			window.plugins.toast.showShortBottom(msg);
		}
		else if(!$scope.data.term){
			msg =  $translate.instant('conditionRequired');
			window.plugins.toast.showShortBottom(msg);
		}
		else {
			if($scope.data.password != $scope.data.repass){
				msg =  $translate.instant('pwnotmatchRequired');
				window.plugins.toast.showShortBottom(msg);
			} else {
				msg =  $translate.instant('loading');
				$scope.showLoading(msg);
				$http.post(wordpress_url+'/wp-json/mobiconnector/user/register',{
					username: $scope.data.username,
					email: $scope.data.email,
					first_name: $scope.data.name.first,
					last_name: $scope.data.name.last,
					password: $scope.data.password,
				},{
					cache: false,
					headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
					withCredentials: true,
					transformRequest: function(obj) {
							var str = [];
							for(var p in obj)
							str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
							return str.join("&");
					}
				}).then(function(response){
					$scope.hideLoading();
					$state.go('app.login');
					 msg =  $translate.instant('emailValidation');
					window.plugins.toast.showShortBottom(msg);
				}).catch(function(error){
					$scope.hideLoading();
					window.plugins.toast.showShortBottom(error.data.message);
				});
			}
		}
	};
})
.controller('SearchCtrl', function($scope, $http, $ionicScrollDelegate,$translate){
	$scope.data = {};
	$scope.load = function(){
		$http.get(wordpress_url+'/wp-json/wp/v2/posts?search='+$scope.data.keyword,{
			params:{"page":$scope.page,"per_page":wordpress_per_page}
		}).then(function(response){
			if(response.data.length == 0) {
				$scope.page = $scope.page -1;
				$scope.over = true;
			}
			angular.forEach(response.data, function(item){
				item.time = new Date(item.date_gmt).getTime();
				if(item.format == "video") item.content.rendered = "[video]";
				$scope.search.push(item);
			});
			$scope.$broadcast('scroll.infiniteScrollComplete');
			$scope.page = $scope.page +1;
		});
	};
	$scope.startSearch = function(){
		$scope.search = [];
		$scope.page = 1;
		$scope.over = false;
		$scope.isSearch = true;
		$ionicScrollDelegate.scrollBottom();
	};
})