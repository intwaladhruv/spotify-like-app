$(document).ready(function () {
    var selection = "";
    basic();

    $(".alphabet").click(function () {
        var data = {
            "q": this.id,
            "type": "",
            "limit": "50",
            "offset": "0"
        };
        performOperation(selection, data);
    });
    $("a").click(function () {
        var data = {
            "q": "a",
            "type": "",
            "limit": "50",
            "offset": "0"
        };
        selection = this.id;
        if (selection == 'search') {
            var display = `
                <div id="searchPanel">
                    <input type="text" class="form-control" id="txtSearch" placeholder="Search Keyword">
                </div>
                <div id="searched-content"></div>
            `;
            $("#result").html(display);
        }
        performOperation(selection, data);
    });

    $(document).on('keyup', '#txtSearch', function () {
        var q = "a";
        if ($(this).val() != "")
            q = $(this).val();
        var data = {
            "q": q,
            "type": "",
            "limit": "50",
            "offset": "0"
        };
        console.log($(this).val());
        performOperation(selection, data);
    });

    $(document).on('click', 'button', function () {
        
            
            // Now you have the access token, you can use it for API requests
         
            $.ajax({
                type: "GET",
                url: `https://api.spotify.com/v1/me/playlists`,
                headers: {
                    Authorization:
                    "Bearer BQAVTvt9Nn0lI81INJCmcWD2xTRKP6ic6tBNcXwX705wtJBrVE1Wfg-hqjGoR0gKTvoNmTWbOOZlQKjmjibPDZIza5lMqEOYF-Kn7YzDsmZ8aXxhQk4"
                },
                dataType : "application/json",
                success: function (data) {
                    console.log(data);
                }
            });
       
    });
});

function authorizeUser() {
    var authUrl = `https://accounts.spotify.com/authorize?client_id=97beedf8ea74431fb7dd688c01ffab40&redirect_uri=${encodeURIComponent('http://127.0.0.1:5500/phase%202/index.html')}&response_type=token&scope=playlist-modify-public`;
    window.location.href = authUrl;
}

function basic() {
    var display = `<div class="alphabet-container">`;
    for (var i = 65; i <= 90; i++) {
        display += `
            <div class="alphabet"id="${String.fromCharCode(i)}">
                ${String.fromCharCode(i)}
            </div>
        `;
    }
    display += `
        </div>
        <br>
        <div id="result"></div>
    `;
    $("#main-content").html(display);
    $(".alphabet").hide();
}

function sliderSetting() {
    if ($('.bbb_viewed_slider').length) {
        var viewedSlider = $('.bbb_viewed_slider');

        viewedSlider.owlCarousel(
            {
                loop: true,
                margin: 30,
                autoplay: true,
                autoplayTimeout: 6000,
                nav: false,
                dots: false,
                responsive:
                {
                    0: { items: 1 },
                    575: { items: 2 },
                    768: { items: 3 },
                    991: { items: 4 },
                    1199: { items: 6 }
                }
            });

        if ($('.bbb_viewed_prev').length) {
            var prev = $('.bbb_viewed_prev');
            prev.on('click', function () {
                viewedSlider.trigger('prev.owl.carousel');
            });
        }

        if ($('.bbb_viewed_next').length) {
            var next = $('.bbb_viewed_next');
            next.on('click', function () {
                viewedSlider.trigger('next.owl.carousel');
            });
        }
    }
}

function performOperation(selection, data_pass) {
    var selection = selection;
    var url = 'https://api.spotify.com/v1/';
    if (selection != 'genre')
        var data = data_pass;
    switch (selection) {
        case 'artist':
            url += 'search';
            data.type = "artist";
            break;
        case 'playlist':
            url += 'search';
            data.type = "playlist";
            break;
        case 'album':
            url += 'search';
            data.type = "album";
            break;
        case 'genre':
            url += 'recommendations/available-genre-seeds';
            break;
        case 'search':
            url += 'search';
            data.type = 'album,artist,playlist,track,show,episode,audiobook';
            break;
        case 'category':
            url += 'browse/categories/';
            break;
        case 'track':
            url += 'search';
            data.type = "track";
            break;
        case 'user':
            url += 'me';
            break;
        default:
            break;
    }
    $.ajax({
        type: "GET",
        url: url,
        headers: {
            Authorization:
                "Bearer BQAVTvt9Nn0lI81INJCmcWD2xTRKP6ic6tBNcXwX705wtJBrVE1Wfg-hqjGoR0gKTvoNmTWbOOZlQKjmjibPDZIza5lMqEOYF-Kn7YzDsmZ8aXxhQk4",
        },
        data: data,
        dataType: "json",
        success: function (data) {
            switch (selection) {
                case 'artist':
                    $(".alphabet").show();
                    $("#result").html(setArtists(data));
                    new DataTable('#tblArtist');
                    break;
                case 'playlist':
                    $(".alphabet").show();
                    $("#result").html(setPlaylists(data));
                    new DataTable('#tblPlaylist');
                    break;
                case 'album':
                    url += 'search';
                    data.type = "album";
                    break;
                case 'genre':
                    $("#result").html(setGenre(data));
                    new DataTable('#tblGenre');
                    break;
                case 'search':
                    $("#searched-content").html(setSearch(data));
                    sliderSetting();
                    break;
                case 'category':
                    $("#result").html(setCategories(data));
                    new DataTable("#tblCategory");
                    break;
                case 'track':
                    $(".alphabet").show();
                    $("#result").html(setTracks(data));
                    new DataTable("#tblTracks");
                    break;
                case 'user':
                    console.log(data);
                    break;
                default:
                    break;
            }
        }
    });
}

function setArtists(data) {
    var display = `
        <table id="tblArtist" class="table table-striped table-bordered" style="width:100%">
            <thead>
                <th></th>
                <th>Name</th>
                <th>Genre</th>
                <th>Popularity</th>
                <th>Followers</th>
            </thead>
            <tbody>
    `;
    $.each(data.artists.items, function (key, value) {
        var genre = "";
        var image = "images.png";
        $.each(value.genres, function () {
            console.log(typeof (this));
            genre += this + ", ";
        });
        if (value.images.length > 0)
            image = value.images[0].url
        display += `
            <tr>
                <td><img src="${image}" height=100px width=100px></td>
                <td>${value.name}</td>
                <td>${genre}</td>
                <td>${value.popularity}</td>
                <td>${value.followers.total}</td>
            </tr>
        `;
    });

    display += `
            </tbody>
        </table>
    `;
    return display;
}

function setPlaylists(data) {
    var display = `
        <table id="tblPlaylist" class="table table-striped table-bordered" style="width:100%">
            <thead>
                <th></th>
                <th>Playlist</th>
                <th>Created By</th>
                <th>Description</th>
                <th>Number Of Tracks</th>
                <th>Follow/Unfollow</th>
            </thead>
            <tbody>
    `;
    $.each(data.playlists.items, function (key, value) {
        var image = "images.png";
        if (value.images.length > 0)
            image = value.images[0].url
        display += `
            <tr>
                <td><img src="${image}" height=100px width=100px></td>
                <td>${value.name}</td>
                <td>${value.owner.display_name}</td>
                <td>${value.description}</td>
                <td>${value.tracks.total}</td>
                <td><button id='${value.id}' class='form-control' text='follow'>Follow</button> <button id='${value.id}' class='form-control' text='unfollow'>Unfollow</button></td>
            </tr>
        `;
    });

    display += `
            </tbody>
        </table>
    `;
    return display;
}

function setGenre(data) {
    console.log(data);
    var display = `
        <table id="tblGenre" class="table table-striped table-bordered" style="width:100%">
            <thead>
                <th>Genre</th>
            </thead>
            <tbody>
    `;
    $.each(data.genres, function () {
        display += `
            <tr>
                <td>${this}</td>
            </tr>
        `;
    });

    display += `
            </tbody>
        </table>
    `;
    return display;
}

function setSearch(data) {
    var display = "<div class='sliders'>";

    if (data.albums.items.length > 0) {
        display += `
    <div class="bbb_viewed">
        <div class="container">
            <div class="row">
                <div class="col">
                    <div class="bbb_main_container">
                        <div class="bbb_viewed_title_container">
                            <h3 class="bbb_viewed_title">Albums</h3>
                    </div>
                    <div class="bbb_viewed_slider_container">
                        <div class="owl-carousel owl-theme bbb_viewed_slider">
    `;
        $.each(data.albums.items, function (key, value) {
            var artists = "";
            var image = "";
            if (value.artists.length > 0) {
                $.each(value.artists, function (key, value) {
                    artists += value.name + ", ";
                });
            }
            if (value.images.length)
                image = value.images[0].url;
            display += `
            <div class="owl-item">
                <div class="bbb_viewed_item discount d-flex flex-column align-items-center justify-content-center text-center">
                <div class="bbb_viewed_image">
                    <img src="${image}"/>
                </div>
                <div class="bbb_viewed_content text-center">
                    <div class="bbb_viewed_price">
                        <span>${value.name}</span>
                    </div>
                    <div class="bbb_viewed_name">
                      <span>${artists}</span>
                    </div>
                </div>
                </div>
            </div>
        `;
        });

        display += `
                            </div>
                         </div>
                       </div> 
                    </div>
                </div>
            </div>
        </div>
    `;
    }

    if (data.artists.items.length > 0) {
        display += `
        <br>
    <div class="bbb_viewed">
        <div class="container">
            <div class="row">
                <div class="col">
                    <div class="bbb_main_container">
                        <div class="bbb_viewed_title_container">
                            <h3 class="bbb_viewed_title">Artists</h3>
                    </div>
                    <div class="bbb_viewed_slider_container">
                        <div class="owl-carousel owl-theme bbb_viewed_slider">
    `;

        $.each(data.artists.items, function (key, value) {
            var image = "";
            var genre = "";
            if (value.images.length > 0)
                image = value.images[0].url;

            if (value.genres.length > 0) {
                $.each(value.genres, function () {
                    genre += this + ", ";
                });
            }
            display += `
            <div class="owl-item">
                <div class="bbb_viewed_item discount d-flex flex-column align-items-center justify-content-center text-center">
                    <div class="bbb_viewed_image">
                        <img src="${image}"/>
                    </div>
                    <div class="bbb_viewed_content text-center">
                        <div class="bbb_viewed_price">
                            <span>${value.name}</span>
                        </div>
                        <div class="bbb_viewed_name">
                            <span>${genre}</span>
                        </div>
                        <div class="bbb_viewed_name">
                            <span>Followers: ${value.followers.total}</span>
                        </div>
                    </div>
                </div>
            </div>
            `;

        });

        display += `
                            </div>
                         </div>
                       </div> 
                    </div>
                </div>
            </div>
        </div>
    `;
    }

    if (data.tracks.items.length > 0) {
        display += `
            <br>
            <div class="bbb_viewed">
            <div class="container">
                <div class="row">
                    <div class="col">
                        <div class="bbb_main_container">
                            <div class="bbb_viewed_title_container">
                                <h3 class="bbb_viewed_title">Tracks</h3>
                        </div>
                        <div class="bbb_viewed_slider_container">
                            <div class="owl-carousel owl-theme bbb_viewed_slider">
        `;

        $.each(data.tracks.items, function (key, value) {
            var artists = "";
            var image = "";
            if (value.album.artists.length > 0) {
                $.each(value.album.artists, function (key, value) {
                    artists += value.name + ", ";
                });
            }
            if (value.album.images.length > 0)
                image = value.album.images[0].url;

            display += `
            <div class="owl-item">
                <div class="bbb_viewed_item discount d-flex flex-column align-items-center justify-content-center text-center">
                    <div class="bbb_viewed_image">
                        <img src="${image}"/>
                    </div>
                    <div class="bbb_viewed_content text-center">
                        <div class="bbb_viewed_price">
                            <span>${value.name}</span>
                        </div>
                        <div class="bbb_viewed_name">
                            <span>${artists}</span>
                        </div>
                        <div class="bbb_viewed_name">
                            <span>Total Tracks: ${value.total_tracks}</span>
                        </div>
                    </div>
                </div>
            </div>
            `;
        });

        display += `
                            </div>
                         </div>
                       </div> 
                    </div>
                </div>
            </div>
        </div>
    `;
    }

    if (data.playlists.items.length > 0) {
        display += `
        <div class="bbb_viewed">
            <div class="container">
                <div class="row">
                    <div class="col">
                        <div class="bbb_main_container">
                            <div class="bbb_viewed_title_container">
                                <h3 class="bbb_viewed_title">Playlists</h3>
                        </div>
                        <div class="bbb_viewed_slider_container">
                            <div class="owl-carousel owl-theme bbb_viewed_slider">
        `;

        $.each(data.playlists.items, function (key, value) {
            var image = "";
            if (value.images.length > 0)
                image = value.images[0].url;

            display += `
            <div class="owl-item">
                <div class="bbb_viewed_item discount d-flex flex-column align-items-center justify-content-center text-center">
                    <div class="bbb_viewed_image">
                        <img src="${image}"/>
                    </div>
                    <div class="bbb_viewed_content text-center">
                        <div class="bbb_viewed_price">
                            <span>${value.name}</span>
                        </div>
                        <div class="bbb_viewed_name">
                            <span>${value.owner.display_name}</span>
                        </div>
                        <div class="bbb_viewed_name">
                            <span>Total Tracks: ${value.tracks.total}</span>
                        </div>
                    </div>
                </div>
            </div>
            `;
        });

        display += `
                            </div>
                         </div>
                       </div> 
                    </div>
                </div>
            </div>
        </div>
    `;
    }
    display += "</div>";
    return display;
}

function setTracks(data) {
    console.log(data);
    var display = `
        <table id="tblTracks" class="table table-striped table-bordered" style="width:100%">
            <thead>
                <th></th>
                <th>Track</th>
                <th>Created By</th>
                <th>Release Date</th>
                <th>Number Of Tracks</th>
            </thead>
            <tbody>
    `;
    $.each(data.tracks.items, function (key, value) {
        var artists = "";
        var image = "images.png";
        console.log(value);
        if (value.album.artists.length > 0) {
            $.each(value.album.artists, function (key, value) {
                artists += value.name + ", ";
            });
        }
        if (value.album.images.length > 0)
            image = value.album.images[0].url

        display += `
            <tr>
                <td><img src="${image}" height=100px width=100px></td>
                <td>${value.name}</td>
                <td>${artists}</td>
                <td>${value.album.release_date}</td>
                <td>${value.album.total_tracks}</td>
            </tr>
        `;
    });

    display += `
            </tbody>
        </table>
    `;
    return display;
}