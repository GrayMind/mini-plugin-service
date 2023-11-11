const text = "*******************************";
export default function (api, options) {
  console.log("plugin 2 run ==>", api.id);
  api.configProcess((content) => {
    content.push(text);
    content.unshift(text);
  });
}
