const https = require("https");
const fs = require("fs");

const options = {
  hostname: "api.coingecko.com",
  port: 443,
  path: "/api/v3/coins/list?include_platform=true",
  method: "GET",
};

const process = (data) => {
  return data.reduce((result, curr) => {
    const { id, name } = curr;
    Object.keys(curr.platforms).map((key) => {
      result[curr.platforms[key]] = { id, name };
    });
    return result;
  }, {});
};

const req = https.request(options, (res) => {
  const chunks = [];

  res.on("data", (d) => {
    chunks.push(d);
  });

  res.on("end", () => {
    const data = JSON.parse(Buffer.concat(chunks).toString());
    const processedData = process(data);
    const filepath = "./src/repos/tokenAddressMapping.json";

    fs.writeFileSync(filepath, JSON.stringify(processedData, 2, 2));
    console.log(`[DONE] Generated token address mapping file to ${filepath}`);
  });
});

req.on("error", (error) => {
  console.error(`[Error] ${error.message}`);
});

req.end();
