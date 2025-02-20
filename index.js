window.addEventListener("load", function () {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("ServiceWorker.js");
    }
  });

  window.addEventListener("fetch", event => {
    event.respondWith(handleRequest(event.request));
  });
  
  async function handleRequest(request) {
    // Nếu là preflight request (OPTIONS), trả về phản hồi phù hợp
    if (request.method === "POST") {
      return new Response(null, {
        status: 204, // No Content
        headers: getCORSHeaders()
      });
    }
  
    // Fetch request gốc
    const response = await fetch(request);
  
    // Clone response để chỉnh sửa headers
    let modifiedResponse = new Response(response.body, response);
    const corsHeaders = getCORSHeaders();
  
    // Gán thêm CORS headers
    Object.keys(corsHeaders).forEach(header => {
      modifiedResponse.headers.set(header, corsHeaders[header]);
    });
  
    console.log("Request URL:", modifiedResponse);
    return modifiedResponse;
  }
  
  // Hàm lấy CORS headers
  function getCORSHeaders() {
    return {
      "Access-Control-Allow-Origin": "*", // Hoặc thay bằng domain cụ thể
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400"
    };
  }
  
  var unityInstanceRef;
  var unsubscribe;
  var container = document.querySelector("#unity-container");
  var canvas = document.querySelector("#unity-canvas");
  var loadingBar = document.querySelector("#unity-loading-bar");
  var progressBarFull = document.querySelector("#unity-progress-bar-full");
  var warningBanner = document.querySelector("#unity-warning");

  // Shows a temporary message banner/ribbon for a few seconds, or
  // a permanent error message on top of the canvas if type=='error'.
  // If type=='warning', a yellow highlight color is used.
  // Modify or remove this function to customize the visually presented
  // way that non-critical warnings and error messages are presented to the
  // user.
  function unityShowBanner(msg, type) {
    function updateBannerVisibility() {
      warningBanner.style.display = warningBanner.children.length ? 'block' : 'none';
    }
    var div = document.createElement('div');
    div.innerHTML = msg;
    warningBanner.appendChild(div);
    if (type == 'error') div.style = 'background: red; padding: 10px;';
    else {
      if (type == 'warning') div.style = 'background: yellow; padding: 10px;';
      setTimeout(function() {
        warningBanner.removeChild(div);
        updateBannerVisibility();
      }, 5000);
    }
    updateBannerVisibility();
  }

  var buildUrl = "Build";
  var loaderUrl = buildUrl + "/LamHD-DPT.github.io.loader.js?v=1.0.0";
  var config = {
    dataUrl: buildUrl + "/LamHD-DPT.github.io.data.gz?v=1.0.0",
    frameworkUrl: buildUrl + "/LamHD-DPT.github.io.framework.js.gz?v=1.0.0",
    codeUrl: buildUrl + "/LamHD-DPT.github.io.wasm.gz?v=1.0.0",
    streamingAssetsUrl: "StreamingAssets",
    companyName: "echelonstudios",
    productName: "Imposter Red Alert",
    productVersion: "1.0.0",
    showBanner: unityShowBanner,
  };

  // By default Unity keeps WebGL canvas render target size matched with
  // the DOM size of the canvas element (scaled by window.devicePixelRatio)
  // Set this to false if you want to decouple this synchronization from
  // happening inside the engine, and you would instead like to size up
  // the canvas DOM size and WebGL render target sizes yourself.
  // config.matchWebGLToCanvasSize = false;

  if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
    // Mobile device style: fill the whole browser client area with the game canvas:
    var meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, height=device-height, initial-scale=1.0, user-scalable=no, shrink-to-fit=yes';
    document.getElementsByTagName('head')[0].appendChild(meta);
  }

  loadingBar.style.display = "block";

  var script = document.createElement("script");
  script.src = loaderUrl;
  script.onload = () => {
    createUnityInstance(canvas, config, (progress) => {
      progressBarFull.style.width = 100 * progress + "%";
    }).then((unityInstance) => {
      unityInstanceRef = unityInstance;
      loadingBar.style.display = "none";
    }).catch((message) => {
      alert(message);
    });
  };
  document.body.appendChild(script);
