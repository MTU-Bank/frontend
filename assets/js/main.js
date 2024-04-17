let baseAPIdomain = `http://127.0.0.1:80`;
function APImethod(method) {
  return `${baseAPIdomain}${method}`;
}

function getToken() {
  return localStorage.getItem("authToken");
}

function setToken(token) {
  localStorage.setItem("authToken", token);
}

function setTokenXHR(xhr, token=null) {
  if (token == null) token = getToken();
  xhr.setRequestHeader('Authorization', `Bearer ${token}`);
}

function error(text) {
  $("#alertBoxText").text(text);
  $(".alertBox").removeClass("hiddenAlertBox");
  $(".alertBox").addClass("shownAlertBox");
  setTimeout(hideError, 3000);
}

function hideError() {
  $(".alertBox").removeClass("shownAlertBox");
  $(".alertBox").addClass("hiddenAlertBox");
}

function addErrorPopup() {
  divAlert = $(`<div class="alertBox"><span class="closebtn" onclick="this.parentElement.className='alertBox hiddenAlertBox';">&times;</span> <strong>ОШИБКА!</strong> <span id="alertBoxText">Boo!</span></div>`);
  $("body").append(divAlert);
}

particlesJS('particles-js',
  
  {
    "particles": {
      "number": {
        "value": 40,
        "density": {
          "enable": true,
          "value_area": 1500
        }
      },
      "color": {
        "value": "#332974"
      },
      "shape": {
        "type": "circle",
        "stroke": {
          "width": 0,
          "color": "#000000"
        },
        "polygon": {
          "nb_sides": 5
        },
        "image": {
          "src": "img/github.svg",
          "width": 100,
          "height": 100
        }
      },
      "opacity": {
        "value": 1,
        "random": false,
        "anim": {
          "enable": false,
          "speed": 1,
          "opacity_min": 0.1,
          "sync": false
        }
      },
      "size": {
        "value": 3,
        "random": false,
        "anim": {
          "enable": false,
          "speed": 10,
          "size_min": 0.1,
          "sync": false
        }
      },
      "line_linked": {
        "enable": true,
        "distance": 450,
        "color": "#332974",
        "opacity": 2,
        "width": 1
      },
      "move": {
        "enable": true,
        "speed": 1,
        "direction": "none",
        "random": false,
        "straight": false,
        "out_mode": "bounce",
        "attract": {
          "enable": false,
          "rotateX": 600,
          "rotateY": 1200
        }
      }
    },
    "interactivity": {
      "detect_on": "window",
      "events": {
        "onhover": {
          "enable": true,
          "mode": "grab"
        },
        "onclick": {
          "enable": false,
          "mode": "push"
        },
        "resize": true
      },
      "modes": {
        "grab": {
          "distance": 200,
          "line_linked": {
            "opacity": 5
          }
        },
        "bubble": {
          "distance": 400,
          "size": 40,
          "duration": 2,
          "opacity": 8,
          "speed": 3
        },
        "repulse": {
          "distance": 200
        },
        "push": {
          "particles_nb": 4
        },
        "remove": {
          "particles_nb": 2
        }
      }
    },
    "retina_detect": true,
    "config_demo": {
      "hide_card": false,
      "background_color": "#b61924",
      "background_image": "",
      "background_position": "50% 50%",
      "background_repeat": "no-repeat",
      "background_size": "cover"
    }
  }

);