---
title: 'datahub-web-react'
---

# DataHub React 应用

## 关于

此模块包含一个作为 DataHub UI 的 React 应用程序。

欢迎随时查看、部署和贡献。

## 功能目标

应用程序的初始里程碑是实现与之前 Ember 应用的功能对等。这意味着支持：

- 数据集配置、搜索、浏览体验
- 用户配置、搜索
- LDAP 认证流程

目前已经实现。新的功能目标反映在最新版本的 [DataHub 路线图](../docs/roadmap.md) 中。

## 设计目标

在构建客户端体验时，我们打算利用从之前基于 Ember 的应用程序中获得的经验，并结合从运营 DataHub 的组织收集的反馈。两个主题已成为指导方针：

1. **可配置性**：客户端体验应该是可配置的，以便部署组织可以根据其需求定制某些方面。这包括主题/样式可配置性、显示和隐藏特定功能、自定义文案和徽标等。
2. **可扩展性**：扩展 DataHub 的_功能_应该尽可能简单。像扩展现有实体和添加新实体这样的更改应该需要最少的工作量，并且应该在详细文档中有很好的覆盖。

## 启动应用程序

### 快速开始

按照[此处](https://docs.datahub.com/docs/developers#building-the-project)的说明在本地构建和部署项目。初始构建可能需要一些时间。您将能够在 `http://localhost:9002` 访问应用程序。

如果您想对 UI 进行更改并实时查看它们，而无需重新构建 `datahub-frontend-react` docker 镜像，您可以在此目录中运行：

`yarn install && yarn run start`

这将在 `localhost:3000` 启动一个转发服务器。请注意，要获取真实数据，`datahub-frontend` 服务器仍然需要部署在 `http://localhost:9002`，以处理 GraphQL API 请求。

您也可以选择在不运行 docker 容器的情况下使用模拟服务器启动应用程序，执行 `yarn start:mock`。可用的登录用户请参见[此处](src/graphql-mock/fixtures/searchResult/userSearchResult.ts#L6)。

### 测试您的自定义

有两种方法可以测试您的自定义：

- **选项 1**：使用 `quickstart.sh` 脚本（或任何自定义 docker-compose 文件）初始化 docker 容器，然后在此目录中运行 `yarn start`。这将在 `localhost:3000` 启动一个转发服务器，使用 `http://localhost:9002` 的 `datahub-frontend` 服务器获取真实数据。
- **选项 2**：将 `.env` 文件中的环境变量 `REACT_APP_PROXY_TARGET` 更改为指向您的 `datahub-frontend` 服务器（例如：https://my_datahub_host.com），然后在此目录中运行 `yarn start`。这将在 `localhost:3000` 启动一个转发服务器，使用某个域的 `datahub-frontend` 服务器获取真实数据。

如果您想在不必在本地运行整个 DataHub 堆栈的情况下测试 React 自定义，选项 2 非常有用。但是，如果您更改了 DataHub 堆栈的其他组件，则需要在本地运行整个堆栈（构建 docker 镜像）并使用选项 1。

### 功能测试

要启动服务器并使用 react-testing-framework 运行前端单元测试，请运行：

`yarn test :e2e`

在仓库根目录的 `smoke-test` 文件夹中还有更多使用 Cypress 的自动化测试。

#### 故障排除

`Error: error:0308010C:digital envelope routines::unsupported`：由于与 md5 相关的 OpenSSL 更新，使用 Node 17 时会出现此错误消息。
最佳解决方法是使用命令 `nvm install 16.13.0` 恢复到 Node 的活跃 LTS 版本 16.13.0，如有必要，重新安装 yarn `npm install --global yarn`。

### 主题设置

#### 无需重建资源即可自定义应用程序

要查看主题更改的结果，您需要重建 datahub-frontend-react 容器。虽然这对某些用户可能有效，但如果您不想重建容器，可以在不重建的情况下更改两项内容：

1. 您可以通过在部署 GMS 时设置 `REACT_APP_LOGO_URL` 环境变量来自定义主页和搜索栏标题上的徽标。
2. 您可以通过在部署 GMS 时设置 `REACT_APP_FAVICON_URL` 环境变量来自定义 favicon（浏览器标签上的图标）。

#### 选择主题

主题配置在 `./src/conf/theme/themes.ts` 中定义。默认情况下，主题根据 GMS 中的 `REACT_APP_CUSTOM_THEME_ID` 环境变量选择。如果未指定主题，则根据是否启用 V2 UI 使用默认主题 `themeV2` 或 `themeV1`，这由 GMS 中的环境变量 `THEME_V2_ENABLED`、`THEME_V2_DEFAULT` 和 `THEME_V2_TOGGLEABLE` 控制。详情请参见 `metadata-service/configuration/src/main/resources/application.yaml`。

对于快速本地开发，您可以在 `.env` 中将环境变量 `REACT_APP_THEME` 设置为 `themes.ts` 中定义的任何主题。

我们正在逐步淘汰 Ant 主题，但某些样式仍然依赖它。Ant 主题存储在 `./src/conf/theme` 中的 json 文件中。要选择 Ant 主题，选择一个 json 文件并在 `.env` 中将环境变量 `ANT_THEME_CONFIG` 设置为主题的文件名（包括 `.json`），然后从 `datahub/datahub-web-react` 重新运行 `yarn start`。

#### 编辑主题

要编辑现有主题，建议将现有主题之一克隆到名为 `<your_themes_name>.ts` 的新文件中，然后通过导入您的主题并将其添加到 `themes` 对象来更新 `themes.ts`。您也可以通过在 `./src/conf/theme` 中创建名为 `<your_themes_name>.config.json` 的新文件来创建 json 主题。主题接口在 `./src/conf/theme/types.ts` 中定义，有四个部分：

`colors` 配置语义颜色标记。
这些尚未广泛使用，但将是未来配置应用程序颜色的主要方式。

`styles` 配置应用程序已弃用的主题变量和 Ant 组件的覆盖。

`assets` 配置徽标 URL。

`content` 指定可自定义的文本字段。

在开发主题时，对 assets 和 content 的所有更改会立即在本地应用程序中显示。但是，对 styles 的更改需要您终止并重新运行 `yarn start` 才能看到更新的样式。

## 设计详情

### 包组织

应用程序的 `src` 目录分为以下模块：

**conf** - 存储可在整个应用程序中引用的全局配置标志。例如，每页显示的搜索结果数量，或搜索框中的占位符文本。它作为功能可配置性级别应该存在的位置。

**app** - 包含应用程序的所有重要组件。它有几个子模块：

- `auth`：用于渲染用户认证体验的组件。
- `browse`：用于渲染"按路径浏览"体验的共享组件。该体验类似于导航文件系统层次结构。
- `preview`：用于渲染实体"预览"视图的共享组件。这些可以出现在搜索结果、浏览结果和实体配置页面中。
- `search`：用于渲染全文搜索体验的共享组件。
- `shared`：杂项共享组件
- `entity`：包含实体定义，其中存放特定于实体的功能。
  通过实现"Entity"接口提供配置。（参见 DatasetEntity.tsx 示例）
  每个实体应提供 2 个可视化组件：

    - `profiles`：显示有关单个实体的相关详细信息。这作为实体的"配置文件"。
    - `previews`：提供"预览"或较小的详细信息卡，包含有关实体实例的最重要信息。

        在渲染预览时，提供实体的数据和预览类型（SEARCH、BROWSE、PREVIEW）。这允许您可选地自定义实体预览在不同视图中的渲染方式。

    - `entity registry`：此模块中还有另一个非常重要的代码：**EntityRegistry**。这是对渲染特定实体细节的抽象层。它用于渲染与特定实体类型（用户、数据集等）关联的视图。

<p align="center">
  <img width="70%"  src="https://raw.githubusercontent.com/datahub-project/static-assets/main/imgs/entity-registry.png"/>
</p>

**graphql** - React 应用程序使用 GraphQL 与 `datahub-frontend` 服务器通信。此模块是定义针对服务器发出的_查询_的地方。定义后，运行 `yarn run generate` 将代码生成 TypeScript 对象，使调用这些查询变得极其简单。示例可以在 `SearchPage.tsx` 顶部找到。

**images** - 要在应用程序中显示的图像。这是放置自定义徽标图像的地方。

## 添加实体

以下概述了在 React 应用程序中引入新实体所需的一系列步骤：

1. 声明显示新实体所需的 GraphQL 查询

    - 如果应支持搜索功能，请扩展 `search.graphql` 中的"search"查询以获取新实体数据。
    - 如果应支持浏览功能，请扩展 `browse.graphql` 中的"browse"查询以获取新实体数据。
    - 如果应支持显示"配置文件"（最常见），请引入一个新的 `<entity-name>.graphql` 文件，其中包含一个通过主键（urn）获取实体的 `get` 查询。

    请注意，您的新实体_必须_实现 `Entity` GraphQL 类型接口，因此必须具有相应的 `EntityType`。

2. 实现 `Entity` 接口

    - 在 `src/components/entity` 下创建一个与您的实体对应的新文件夹
    - 创建一个实现 `Entity` 接口的类（示例：`DatasetEntity.tsx`）
    - 为接口上定义的每个方法提供实现。
        - 此类指定您的新实体是否应该可搜索和可浏览，定义在渲染实例时用于标识您的实体的名称/当实体出现在 URL 路径中时，并提供根据 GQL API 返回的数据渲染您的实体的能力。

3. 在 `EntityRegistry` 中注册新实体
    - 更新 `App.tsx` 以注册您的新实体的实例。现在您的实体将可通过注册表访问并显示在 UI 中。要手动检索有关您的实体或其他实体的信息，只需使用 `EntityRegistry` 的实例，该实例通过 `ReactContext` 提供给层次结构中的_所有_组件。
      例如：
        ```
        entityRegistry.getCollectionName(EntityType.YOUR_NEW_ENTITY)
        ```

就是这样！如有任何问题，请随时在 DataHub Slack 社区的 #datahub-react 频道联系我们。
