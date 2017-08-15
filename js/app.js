/* Set the width of the side navigation to 250px */
function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
}

/* Set the width of the side navigation to 0 */
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}

/* Set the width of the side navigation to 250px and the left margin of the page content to 250px */
function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
}

/* Set the width of the side navigation to 0 and the left margin of the page content to 0 */
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
}


var bounds;
var viewModel = function() {
    "use strict";

    var self = this;
    self.markers = ko.observableArray([]);
    var marker;
    var content;

    self.searchPlace = ko.observable('');

    self.mrkers = function() {
        if (this.searchPlace().length === '') {
            this.showAll();
        } else {
            for (var i = 0; i < locations.length; i++) {
                if (locations[i].title.indexOf(this.searchPlace().toLowerCase()) >= 0) {
                    self.markers()[i].setMap(map);
                    self.markers()[i].visiblity(true);
                } else {
                    self.markers()[i].visiblity(false);
                    self.markers()[i].setMap(null);
                }
            }
        }
    };

    self.infowindow = new google.maps.InfoWindow({
        maxWidth: 300,
        content: ""
    });

    self.populateinfowindow = function(marker, infowindow) {
        // check to mk sure infowindow is not alrdy closed
        if (self.infowindow.marker != marker) {
            self.infowindow.marker = marker;
            content = '<div>' + marker.title + '<br>' + marker.likes + '<br>' + marker.rating + '<br><img src="' + marker.img + '" alt="marker-img" height="100" width="100"/>' + '</div>';
            self.infowindow.setContent(content);
            self.infowindow.open(map, marker);
            self.infowindow.addListener('closeclick', function() {
                self.infowindow.marker = "";
            });
            // map.panTo(marker.getPosition())

        }
    };

    self.showWindow = function() {
        self.populateinfowindow(this, self.infowindow);
    };

    self.toggleBounce = function(marker) {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {
            marker.setAnimation(null);
        }, 500);
    };

    self.addInfoToWindow = function(marker) {
        $.ajax({
            url: "https://api.foursquare.com/v2/venues/" + marker.id + '?client_id=4KZBB34R2W4APRMIJIJX1DWUO04NP2PNCQJX2EFK5PZLV1CD&client_secret=CPT2SIUZAV5WTUNTVGG0WI3ZAJKO4I0HJ5TV2TE3U3I3KW5R&v=20170208',
            dataType: "json",
            success: function(data) {
                // stores results to display likes and ratings
                var result = data.response.venue;
                // add likes and ratings to marker
                marker.likes = result.hasOwnProperty('likes') ? result.likes.summary : "";
                marker.rating = result.hasOwnProperty('rating') ? result.rating : "";
            },
            //alert if there is error in recievng json
            error: function(xhr, status, thrownError) {
                console.log("Foursquare data is unavailable. Please try again later.");
            }
        });
    };
    //this.addListener = google.maps.event.addListener(this.map, 'click', (this.infowindow.close(this.infowindow)));
    self.bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < locations.length; i++) {
        marker = new google.maps.Marker({
            position: locations[i].location,
            title: locations[i].title,
            animation: google.maps.Animation.DROP,
            id: locations[i].id,
            img: locations[i].icon,
            visiblity: ko.observable(false),
        });
        self.addInfoToWindow(marker);
        self.markers().push(marker);
        marker.addListener('click', function() {
            self.toggleBounce(this);
        });
        marker.addListener('click', function() {
            self.populateinfowindow(this, self.infowindow);
        });

    }

    self.showAll = function() {
        for (var i = 0; i < locations.length; i++) {
            self.markers()[i].visiblity(true);
            self.markers()[i].setMap(map);
        }
    };
    self.showAll();
};
