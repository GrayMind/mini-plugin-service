const text = "===============================";
export default function (api, options) {
  console.log("plugin 1 run ==>", api.id);
  api.configProcess((content) => {
    content.push(text);
    content.unshift(text);
  });
}
