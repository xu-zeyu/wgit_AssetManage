# 唯刚资产管理后台

现代化资产管理后台，使用 Next.js App Router + React 19 + TypeScript + TailwindCSS + shadcn/ui 重构。

## 技术栈

- **框架**：Next.js 15 (App Router) + React 19
- **样式**：TailwindCSS + shadcn/ui (Radix Primitives) + Framer Motion
- **状态**：Zustand（UI 状态） + TanStack Query（服务端缓存）
- **表单**：React Hook Form + Zod
- **图表**：Recharts
- **HTTP**：Axios（保留原后端协议，含 401 自动刷新与请求队列）

## 项目结构

```
src/
  app/                  # 路由（按权限分组：(admin)/(company)）
  features/             # 业务 feature（每个 feature 自闭环：api/ hooks/ components/ schemas/）
    admin/              # 平台管理端：companies / assets / rentals / policies
    company/            # 公司管理端：info / members / office-areas / assets / inventory / reviews
    dashboard/          # 仪表盘
    login/              # 登录（账号 + 二维码）
  components/
    ui/                 # shadcn/ui 组件
    common/             # 通用业务组件（PageHeader / Pagination / SearchBar / ConfirmDialog 等）
    layout/             # AppShell / Sidebar / Topbar / Breadcrumb / CompanySwitcher
    charts/             # Recharts 图表卡片
  services/             # 跨 feature 服务（http、auth、files）
  stores/               # Zustand：user / company / badge
  permissions/          # 角色、路由守卫、Can 组件
  providers/            # AppProviders（QueryClient / Theme / Toast / Token）
  hooks/                # 通用 hooks
  lib/                  # 工具函数
  styles/               # 全局样式
```

## API 路径

所有原始 API 路径未做改动，详见 `src/features/**/api`：

- `/v1/auth/*` 登录、登出、刷新令牌
- `/v1/connect/qrcode/*` 二维码会话与状态轮询
- `/v1/connect/wgit` 二维码 code 换 token
- `/v1/ams/admin/*` 平台管理端
- `/v1/ams/company-admin/*` 公司管理端
- `/v1/files/upload` 文件上传

## 开发

```bash
npm install
npm run dev    # http://localhost:5176
npm run dev:test
npm run build
npm run start
```

`.env.development` 与 `.env.test` 都已配置 `/api` 代理模式，会通过 `next.config.ts` rewrites 转发到测试环境。

## 测试环境

```bash
npm run build:test
npm run start:test
```

测试环境使用 `.env.test`：

- `NEXT_PUBLIC_API_BASE_URL=/api`
- `AUTH_PROXY_TARGET=https://auth-api-test.wgit123.com`
- `API_PROXY_TARGET=http://ams-api-test.wgit123.com`

如果后续要切生产环境，保留同样的变量结构即可：

- 继续走 `/api` 代理模式，只替换 `AUTH_PROXY_TARGET` / `API_PROXY_TARGET`
- 或者将 `NEXT_PUBLIC_API_BASE_URL` 直接改成生产网关完整地址，此时 rewrites 会自动关闭

## 权限设计

- 角色由后端 `/users/me` 决定：
  - 拥有 `AMS_ADMIN` 角色 → `admin`
  - 否则有 `/v1/ams/company-admin/companies` 数据 → `company`
  - 其它 → `visitor`（无权限访问后台）
- 客户端路由守卫位于 `src/permissions/route-guard.tsx`，包裹在 `(admin)` 与 `(company)` 路由组的 layout 中
- 中间件 `src/middleware.ts` 处理根路径重定向，敏感的鉴权由客户端守卫执行（因为 token 存放于 localStorage）
- 精细权限可通过 `<CanRole roles={['admin']}>` 或 `<CanPermission code="...">` 控制按钮级显示
