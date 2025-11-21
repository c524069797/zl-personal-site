import { ThemeToggle } from "@/components/ThemeToggle";
import { DownloadPDFButton } from "@/components/DownloadPDFButton";
import { LinkTransition } from "@/lib/link-transition";

export const metadata = {
  title: "简历",
  description: "陈灼的个人简历",
};

export default function ResumePage() {
  return (
    <div className="min-h-screen">
      <div className="absolute top-4 right-4 print:hidden">
        <ThemeToggle />
      </div>

      <div className="mx-auto max-w-3xl px-4 py-16 print:py-8">
        <div className="mb-8 print:hidden">
          <LinkTransition
            href="/"
            className="text-gray-600 hover:text-gray-900 dark:text-white dark:hover:text-gray-300"
          >
            ← 返回首页
          </LinkTransition>
          <div className="mt-4 flex items-center justify-between">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              简历
            </h1>
            <DownloadPDFButton />
          </div>
        </div>

        <div className="resume-content space-y-8" style={{ backgroundColor: 'white', color: 'black', padding: '20px' }}>
          {/* 基本信息 */}
          <section>
            <h2 className="mb-4 text-2xl font-bold" style={{ color: 'black' }}>
              基本信息
            </h2>
            <div className="space-y-2" style={{ color: 'black' }}>
              <p style={{ color: 'black' }}>
                <strong style={{ color: 'black' }}>姓名：</strong>陈灼
              </p>
              <p style={{ color: 'black' }}>
                <strong style={{ color: 'black' }}>邮箱：</strong>
                <a
                  href="mailto:chenzhuo995@gmail.com"
                  style={{ color: 'black', textDecoration: 'underline' }}
                >
                  chenzhuo995@gmail.com
                </a>
              </p>
            </div>
          </section>

          {/* 教育经历 */}
          <section>
            <h2 className="mb-4 text-2xl font-bold" style={{ color: 'black' }}>
              教育经历
            </h2>
            <div>
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-xl font-semibold" style={{ color: 'black' }}>
                  吉首大学 ｜ 软件工程 ｜ 本科
                </h3>
                <span className="text-sm" style={{ color: 'black' }}>
                  2017.09 – 2021.06
                </span>
              </div>
            </div>
          </section>

          {/* 个人概述 */}
          <section>
            <h2 className="mb-4 text-2xl font-bold" style={{ color: 'black' }}>
              个人概述
            </h2>
            <p className="text-gray-700" style={{ color: 'black', lineHeight: '1.8' }}>
              近 5 年前端经验，专注企业级后台与备份/存储场景。擅长复杂流程建模、组件化沉淀，界面性能优化与业务结合，推动效率与业务指标双提升。
            </p>
          </section>

          {/* 核心技能 */}
          <section>
            <h2 className="mb-4 text-2xl font-bold" style={{ color: 'black' }}>
              核心技能
            </h2>
            <ul className="ml-6 list-disc space-y-1" style={{ color: 'black' }}>
              <li>Web 基础：HTML5 / CSS3 / JavaScript / TypeScript</li>
              <li>框架组件：Vue / React / Next.js / Ant Design / ECharts</li>
              <li>数据库：MySQL / PostgreSQL</li>
              <li>工程化：Vite / Webpack / NPM / Monorepo / 代码规范与单元测试</li>
              <li>协作与质量：RESTful API、异常与埋点规范、性能分析、自动化部署(CI/CD)</li>
              <li>微信小程序开发部署</li>
              <li>uni-app开发与部署</li>
              <li>AI工具的使用</li>
            </ul>
          </section>

          {/* 工作经历 */}
          <section>
            <h2 className="mb-4 text-2xl font-bold" style={{ color: 'black' }}>
              工作经历
            </h2>
            <div className="space-y-6">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-xl font-semibold" style={{ color: 'black' }}>
                    广州某软件公司 ｜ 前端开发工程师
                  </h3>
                  <span className="text-sm" style={{ color: 'black' }}>
                    2021.07 – 至今
                  </span>
                </div>

                {/* 项目1：主力备份软件 */}
                <div className="mb-6" style={{ marginTop: '24px' }}>
                  <h4 className="mb-3 text-lg font-bold" style={{ color: 'black', fontSize: '18px' }}>
                    主力备份软件
                  </h4>
                  <p className="mb-3 text-sm" style={{ color: 'black', opacity: 0.8 }}>
                    技术栈：Vue3
                  </p>
                  <ul className="ml-6 list-disc space-y-2" style={{ color: 'black' }}>
                    <li>负责存储池配置、容量/配额/策略等核心页面与交互；抽象通用备份/恢复流程态机与表单/向导组件，适配文件/数据库/虚机等多资源类型。</li>
                    <li><strong>许可证模块（模块负责人）</strong>：主导信息架构、交互与实现，覆盖许可证生成、导入校验、续期/升级、套餐/功能映射、设备绑定与异常处理；打通内管/商务/供应链流程，支持按套餐售卖。签发耗时【3-5 分钟 → 10 秒】；错误/退单率【&lt; 20%】；覆盖【2 条产品线 / 100+ 种套餐】</li>
                    <li><strong>结果</strong>：复用减少重复实现【Web组人均任务工时下降1到2小时】；首屏渲染优化【TTI ↓30%】；上线版本缺陷密度极大程度的减少。</li>
                  </ul>
                </div>

                {/* 项目2：公司内部管理系统 */}
                <div className="mb-6" style={{ marginTop: '24px' }}>
                  <h4 className="mb-3 text-lg font-bold" style={{ color: 'black', fontSize: '18px' }}>
                    公司内部管理系统（核心办公系统）
                  </h4>
                  <ul className="ml-6 list-disc space-y-2" style={{ color: 'black' }}>
                    <li>负责许可证、合同/维保、出货/归档等模块前端架构与开发；对接商务与供应链系统（单点登录/统一权限/流程状态与日志），实施&ldquo;按套餐售卖&rdquo;的功能分层与配置化。</li>
                    <li><strong>许可证模块（项目负责人/前端开发，后台设计）</strong>：主导信息架构、交互与实现，覆盖许可证生成、导入校验、续期/升级、套餐/功能映射、TOTP设备绑定与异常处理，合同/出货系统；打通内管/商务/供应链流程，支持按套餐售卖。</li>
                    <li><strong>结果</strong>：签发耗时从钉钉审批化为系统化，从天级的审批流程与人工记录转为小时级别的系统记录；减少了供应链档案人员的50%-60%的工作量，错误/退单率减少百分之五十以上，作为前线支持的系统；覆盖【3 条产品线 / 50+ 种许可套餐】；上线后支撑【2000+ 笔合同 / 500+ 客户】</li>
                    <li><strong>结果</strong>：合同→出货平均周期【↓50%】；跨部门沟通工单【↓30%】；套餐化上线后销售额【↑30%】</li>
                  </ul>
                </div>

                {/* 项目3：个人网站项目 */}
                <div className="mb-6" style={{ marginTop: '24px' }}>
                  <h4 className="mb-3 text-lg font-bold" style={{ color: 'black', fontSize: '18px' }}>
                    个人网站项目
                  </h4>
                  <p className="mb-3 text-sm" style={{ color: 'black', opacity: 0.8 }}>
                    技术栈：Next.js 15、React 19、TypeScript、Ant Design、PostgreSQL、Prisma
                  </p>
                  <ul className="ml-6 list-disc space-y-2" style={{ color: 'black' }}>
                    <li>功能：博客系统（文章发布、分类、标签）、评论系统（游客评论、审核机制）、用户认证（注册/登录）、文章管理（CRUD）、简历展示、PDF导出</li>
                    <li>特点：响应式设计、暗黑模式支持、SEO优化、RSS订阅、最新/最热文章展示</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
