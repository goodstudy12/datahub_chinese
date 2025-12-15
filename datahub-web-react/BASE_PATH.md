# DataHub 前端 Base Path 支持

DataHub 的 React 前端支持运行时 Base Path（基础路径）检测，使同一份构建产物可以部署在不同的 URL 路径下（例如 `/` 或 `/datahub/`），无需重新构建或重新配置。

## 工作原理

Base Path 通过分层的检测机制确定：

1. **服务端模板**（优先）：Play Framework 后端将 base path 注入到 HTML 模板中
2. **配置端点**（回退）：尝试从 `/config` 或 `config` 端点获取 base path
3. **默认值**（最后手段）：回退到根路径 `/`

## 在代码中使用 Base Path

### 资源（Asset）URL

使用 `resolveRuntimePath()` 函数解析任何资源路径：

```typescript
import { resolveRuntimePath } from '../utils/runtimeBasePath';

// 解析资源路径
const logoUrl = resolveRuntimePath('/assets/logo.png');
const apiUrl = resolveRuntimePath('/api/graphql');

// 在组件中使用
<img src={resolveRuntimePath('/assets/icons/favicon.ico')} alt="DataHub" />
```

### 导航链接

使用 React Router 的相对路径，或在需要时解析绝对路径：

```typescript
import { resolveRuntimePath } from '../utils/runtimeBasePath';

// React Router 导航（推荐 - 自动处理）
<Link to="/datasets">Datasets</Link>

// 需要绝对 URL 时
<a href={resolveRuntimePath('/browse')}>Browse</a>
```

### API 端点

```typescript
import { resolveRuntimePath } from '../utils/runtimeBasePath';

// 解析 API 端点
const endpoint = resolveRuntimePath('/api/v2/graphql');
fetch(endpoint, { ... });
```

## 配置

### 服务端配置

在后端 Play 应用中配置 base path：

```hocon
# datahub-frontend/conf/application.conf
datahub.basePath = "/datahub"
```

### 环境变量

容器化部署时：

```bash
# Docker/Kubernetes
DATAHUB_BASE_PATH=/datahub
```

## 示例

### 开发环境

```bash
# 以根路径提供服务
yarn start  # 访问 http://localhost:3000/

# 以子路径提供服务
yarn preview --base /datahub  # 访问 http://localhost:3000/datahub/
```

### 生产部署

**部署在根路径：**

```bash
DATAHUB_BASE_PATH="" docker run datahub-frontend
# 访问：https://datahub.company.com/
```

或取消设置（unset）：

```
unset DATAHUB_BASE_PATH
docker run datahub-frontend
```

**部署在子路径：**

```bash
DATAHUB_BASE_PATH=/datahub docker run datahub-frontend
# 访问：https://company.com/datahub/
```

## 浏览器支持

该实现使用标准 HTML `<base>` 标签与现代 JavaScript 特性：

- 所有现代浏览器（Chrome 60+、Firefox 60+、Safari 12+、Edge 79+）
- 通过回退检测实现渐进增强

## 故障排查

### 资源无法加载

1. 检查浏览器控制台是否有 404
2. 确认 `window.__DATAHUB_BASE_PATH__` 是否正确设置
3. 确保所有资源引用都使用 `resolveRuntimePath()`

### 重定向不正确

1. 检查认证相关端点是否使用了解析后的路径
2. 确认 React Router 的 basename 配置
3. 验证配置端点是否可访问

### 开发环境问题

```bash
# 清理缓存并重新构建
yarn clean
yarn build

# 检查 base path 检测结果
console.log(window.__DATAHUB_BASE_PATH__);
```

## 实现细节

- **HTML 模板**：`datahub-frontend/app/views/index.scala.html`
- **运行时工具**：`src/utils/runtimeBasePath.ts`
- **资源解析**：所有 `src/` 文件通过 `resolveRuntimePath()` 使用
- **服务端处理器**：`datahub-frontend/app/controllers/Application.java`

该机制会自动处理：

- favicon 与 manifest 路径
- 主应用 JS/CSS 资源路径
- 平台 logo 与主题资源路径
- API 端点解析
- 认证重定向
