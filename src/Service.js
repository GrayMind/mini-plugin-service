import PluginAPI from "./PluginAPI.js";

export default class Service {
  constructor(context) {
    // 上下文，记录当前命令执行路径
    this.context = context;
    // 收集插件中的处理操作
    this.processFn = [];
    // 存储所有插件
    this.plugins = [];
  }
  /**
   * 获取所有插件：内部核心插件+外部插件
   */
  async loadPlugins(config) {
    const idToPlugin = async (id, absolutePath) => {
      return {
        id: id.replace(/^.\//, "build-in:"),
        apply: (await import(absolutePath || id)).default,
      };
    };

    const plugins = [];
    // 内部插件
    const builtInPlugins = ["./config/base.js", "./config/base2.js"];
    // 外部插件
    const externalPlugins = config.plugins || [];
    // 所有插件
    const allPlugins = [...builtInPlugins, ...externalPlugins];
    // 根据id加载所有插件
    for (const id of allPlugins) {
      const plugin = await idToPlugin(id);
      plugins.push(plugin);
    }

    return plugins;
  }

  /**
   * 加载配置信息
   * @returns
   */
  async loadConfig() {
    let config = (await import("../my.config.js")).default;
    return config;
  }

  /**
   * 开始运行
   * @param {*} content 需要处理的文本内容
   */
  async run(content) {
    const config = await this.loadConfig();
    this.plugins = await this.loadPlugins(config);
    // 运行插件,将插件中的处理操作保存到 processFn 中
    for (const { id, apply } of this.plugins) {
      apply(new PluginAPI(id, this), config);
    }
    // 运行最终命令
    let contentList = this.resolveContent(content);
    console.log(contentList.join("\n"));
  }

  /**
   * 对在插件中添加的处理逻辑进行运行
   */
  resolveContent(content = "") {
    const list = [content];
    this.processFn.forEach((fn) => fn(list));
    return list;
  }
}
