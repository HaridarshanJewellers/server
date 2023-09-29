const http = require("http");

const axios = function (url) {
  return new Promise((resolve, reject) => {
    return http.get(
      "http://bcast.rakshabullion.com:7767/VOTSBroadcastStreaming/Services/xml/GetLiveRateByTemplateID/raksha?_=" +
        Date.now(),
      function (response) {
        if (response.statusCode === 200) {
          const data = [];
          response.on("data", (chunk) => {
            data.push(chunk);
          });

          response.on("end", () => {
            resolve(data.toString());
          });

          response.on("error", () => {
            reject("Request failed!");
          });
        }
      }
    );
  });
};

const _goldDigger = async function () {
  try {
    const date = Date.now();
    const response = await axios(
      "http://bcast.rakshabullion.com:7767/VOTSBroadcastStreaming/Services/xml/GetLiveRateByTemplateID/raksha?_=" +
        date
    );

    let gold = 0;
    // For gold
    response.split("\n").map((line) => {
      const columns = line
        .split("\t")
        .map((col) => col.trim())
        .filter((col) => !!col);

      if (columns[1] === "GOLD 999 IMP WITH GST") {
        gold = parseInt(columns[3]);
      }
    });

    return gold;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const server = http.createServer(async (req, res) => {
  if (req.method === "GET" && req.url === "/get-gold") {
    try {
      const goldValue = await _goldDigger();
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end(JSON.stringify({ goldValue }));
    } catch (err) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Internal Server Error");
    }
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
});

