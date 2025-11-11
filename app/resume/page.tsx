import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { DownloadPDFButton } from "@/components/DownloadPDFButton";

export const metadata = {
  title: "简历",
  description: "我的个人简历",
};

export default function ResumePage() {
  return (
    <div className="min-h-screen">
      <div className="absolute top-4 right-4 print:hidden">
        <ThemeToggle />
      </div>

      <div className="mx-auto max-w-3xl px-4 py-16 print:py-8">
        <div className="mb-8 print:hidden">
          <Link
            href="/"
            className="text-gray-600 hover:text-gray-900 dark:text-white dark:hover:text-gray-300"
          >
            ← 返回首页
          </Link>
          <div className="mt-4 flex items-center justify-between">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              简历
            </h1>
            <DownloadPDFButton />
          </div>
        </div>

        <div className="resume-content space-y-8">
          {/* 基本信息 */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
              基本信息
            </h2>
            <div className="space-y-2 text-gray-700 dark:text-white">
              <p>
                <strong className="dark:text-white">姓名：</strong>您的姓名
              </p>
              <p>
                <strong className="dark:text-white">位置：</strong>所在城市
              </p>
              <p>
                <strong className="dark:text-white">邮箱：</strong>
                <a
                  href="mailto:your.email@example.com"
                  className="text-blue-600 hover:underline dark:text-white dark:border-white"
                >
                  your.email@example.com
                </a>
              </p>
              <p>
                <strong className="dark:text-white">GitHub：</strong>
                <a
                  href="https://github.com/yourusername"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline dark:text-white dark:border-white"
                >
                  github.com/yourusername
                </a>
              </p>
            </div>
          </section>

          {/* 技能 */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
              技能
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                  编程语言
                </h3>
                <p className="text-gray-700 dark:text-white">
                  JavaScript, TypeScript, Python, Java
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                  前端技术
                </h3>
                <p className="text-gray-700 dark:text-white">
                  React, Next.js, Vue.js, HTML, CSS, Tailwind CSS
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                  后端技术
                </h3>
                <p className="text-gray-700 dark:text-white">
                  Node.js, Express, PostgreSQL, MongoDB
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                  工具
                </h3>
                <p className="text-gray-700 dark:text-white">
                  Git, Docker, AWS, Vercel
                </p>
              </div>
            </div>
          </section>

          {/* 工作经历 */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
              工作经历
            </h2>
            <div className="space-y-6">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    高级前端工程师
                  </h3>
                  <span className="text-sm text-gray-600 dark:text-white">
                    2022.01 - 至今
                  </span>
                </div>
                <p className="mb-2 text-gray-600 dark:text-white">
                  公司名称
                </p>
                <ul className="ml-6 list-disc space-y-1 text-gray-700 dark:text-white">
                  <li className="dark:text-white">负责前端架构设计和开发</li>
                  <li className="dark:text-white">优化网站性能，提升用户体验</li>
                  <li className="dark:text-white">带领团队完成多个重要项目</li>
                </ul>
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    前端工程师
                  </h3>
                  <span className="text-sm text-gray-600 dark:text-white">
                    2020.06 - 2021.12
                  </span>
                </div>
                <p className="mb-2 text-gray-600 dark:text-white">
                  公司名称
                </p>
                <ul className="ml-6 list-disc space-y-1 text-gray-700 dark:text-white">
                  <li className="dark:text-white">开发响应式 Web 应用</li>
                  <li className="dark:text-white">与设计师和后端工程师协作</li>
                  <li className="dark:text-white">维护和优化现有代码</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 项目 */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
              项目经验
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                  项目名称
                </h3>
                <p className="mb-2 text-gray-700 dark:text-white">
                  项目描述：这是一个使用 Next.js 和 TypeScript
                  构建的现代化 Web 应用，具有优秀的性能和用户体验。
                </p>
                <p className="text-sm text-gray-600 dark:text-white">
                  技术栈：Next.js, TypeScript, Tailwind CSS, Vercel
                </p>
              </div>
              <div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                  项目名称
                </h3>
                <p className="mb-2 text-gray-700 dark:text-white">
                  项目描述：一个全栈应用，包含用户认证、数据管理和实时通信功能。
                </p>
                <p className="text-sm text-gray-600 dark:text-white">
                  技术栈：React, Node.js, PostgreSQL, Socket.io
                </p>
              </div>
            </div>
          </section>

          {/* 教育背景 */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
              教育背景
            </h2>
            <div>
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  计算机科学 学士
                </h3>
                <span className="text-sm text-gray-600 dark:text-white">
                  2016.09 - 2020.06
                </span>
              </div>
              <p className="text-gray-700 dark:text-white">大学名称</p>
            </div>
          </section>
        </div>
      </div>

    </div>
  );
}

