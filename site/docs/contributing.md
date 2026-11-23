# 参与贡献

kuul 处于早期阶段，非常欢迎参与。

## 可以从哪里开始

- **讨论设计**：对[设计文档](./design-docs)有疑问或建议，欢迎提 [Issue](https://github.com/likun758/kuul/issues)。
- **认领任务**：带 `good-first-issue` 标签的任务适合入门；新增内置 Tool、MCP 适配、Channel 都是很好的起点。
- **完善文档**：API 参考、运维手册、本站内容都欢迎 PR。

## 本地开发

```bash
git clone https://github.com/likun758/kuul.git
cd kuul
./mvnw package            # 编译、测试、打包（JDK 21+）
./mvnw -pl kuul-core -am test   # 只测某个模块
```

本站在 `site/` 目录，用 VitePress 构建：

```bash
cd site
npm install
npm run docs:dev
```

## 工作流

1. Fork 并 clone 仓库；
2. 新建分支，描述要做的改动，在现有代码上修改并补测试；
3. 本地 `./mvnw package` 全部通过；
4. 提 PR，CI（JDK 21 / 25）通过后由维护者 review 合并。

## 必须遵守的约束

贡献需遵守项目宪章，以下几条是硬约束：

- **治理不可绕过**：所有 Tool 调用都必须经过统一的执行管线和审计，不得给任何 Tool 开捷径；
- **不修改 `kuul-core` 的接口契约**，`kuul-core` 不依赖 Spring AI；
- **Spring AI 只用一半**：只做协议适配和 `@Tool` Schema 生成，必须关闭内部工具执行；
- **Provider 显式映射**：按名称创建实例，禁止按 Bean 类型扫描；
- **存储**：SQLite + JDBC + Flyway，不用 JPA、不用 `ddl-auto`、不引入向量库；
- **SKILL.md 不是 Tool**，由上下文加载器注入 prompt；
- 密钥不落明文。

提交前请对照仓库根目录 [`CLAUDE.md`](https://github.com/likun758/kuul/blob/main/CLAUDE.md) 中的审查清单自查。

## 许可证

kuul 以 [Apache License 2.0](https://github.com/likun758/kuul/blob/main/LICENSE) 发布，提交贡献即表示同意以该许可证发布你的代码。
