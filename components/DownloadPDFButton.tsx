"use client";

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export function DownloadPDFButton() {

  const handleDownloadPDF = async () => {
    const resumeElement = document.querySelector('.resume-content') as HTMLElement;

    if (!resumeElement) {
      alert('未找到简历内容');
      return;
    }

    try {
      // 保存原始样式
      const originalBodyBg = document.body.style.backgroundColor;
      const originalBodyColor = document.body.style.color;
      const originalResumeBg = resumeElement.style.backgroundColor;
      const originalResumeColor = resumeElement.style.color;

      // 临时移除打印隐藏的元素
      const hiddenElements = document.querySelectorAll('.print\\:hidden');
      const hiddenStyles: Array<{ element: HTMLElement; display: string }> = [];
      hiddenElements.forEach((el) => {
        const htmlEl = el as HTMLElement;
        hiddenStyles.push({ element: htmlEl, display: htmlEl.style.display });
        htmlEl.style.display = 'none';
      });

      // 确保页面是白色背景和黑色文字
      document.body.style.backgroundColor = 'white';
      document.body.style.color = 'black';
      resumeElement.style.backgroundColor = 'white';
      resumeElement.style.color = 'black';

      // 强制所有文本为黑色，并移除所有可能包含 lab() 的颜色
      const allTextElements = resumeElement.querySelectorAll('*');
      const originalStyles: Array<{ element: HTMLElement; styles: { color?: string; backgroundColor?: string; borderColor?: string } }> = [];

      allTextElements.forEach((el) => {
        const htmlEl = el as HTMLElement;
        const computedStyle = window.getComputedStyle(htmlEl);
        const styles: { color?: string; backgroundColor?: string; borderColor?: string } = {};

        // 保存原始样式
        if (computedStyle.color && !computedStyle.color.includes('lab')) {
          styles.color = htmlEl.style.color || '';
        }
        if (computedStyle.backgroundColor && !computedStyle.backgroundColor.includes('lab')) {
          styles.backgroundColor = htmlEl.style.backgroundColor || '';
        }
        if (computedStyle.borderColor && !computedStyle.borderColor.includes('lab')) {
          styles.borderColor = htmlEl.style.borderColor || '';
        }

        originalStyles.push({ element: htmlEl, styles });

        // 设置简单的颜色值
        if (computedStyle.color && computedStyle.color.includes('lab')) {
          htmlEl.style.color = 'black';
        } else if (htmlEl.tagName.match(/^(H[1-6]|P|LI|SPAN|DIV|STRONG|A)$/i)) {
          htmlEl.style.color = 'black';
        }

        if (computedStyle.backgroundColor && computedStyle.backgroundColor.includes('lab')) {
          htmlEl.style.backgroundColor = 'white';
        }

        if (computedStyle.borderColor && computedStyle.borderColor.includes('lab')) {
          htmlEl.style.borderColor = '#e5e7eb';
        }
      });

      // 等待一小段时间确保样式应用
      await new Promise(resolve => setTimeout(resolve, 200));

      // 创建 canvas，忽略不支持的颜色函数
      const canvas = await html2canvas(resumeElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: resumeElement.scrollWidth,
        height: resumeElement.scrollHeight,
        windowWidth: resumeElement.scrollWidth,
        windowHeight: resumeElement.scrollHeight,
        ignoreElements: (element) => {
          // 忽略可能包含不支持颜色的元素
          return false;
        },
        onclone: (clonedDoc) => {
          // 在克隆的文档中移除所有 lab() 颜色
          const allElements = clonedDoc.querySelectorAll('*');
          allElements.forEach((el) => {
            const htmlEl = el as HTMLElement;
            const style = htmlEl.style;
            const computedStyle = window.getComputedStyle(htmlEl);

            // 检查并替换所有包含 lab() 的颜色
            ['color', 'backgroundColor', 'borderColor', 'borderTopColor',
             'borderRightColor', 'borderBottomColor', 'borderLeftColor'].forEach((prop) => {
              const value = computedStyle.getPropertyValue(prop);
              if (value && value.includes('lab')) {
                if (prop === 'color') {
                  style.setProperty(prop, 'black', 'important');
                } else if (prop.includes('background')) {
                  style.setProperty(prop, 'white', 'important');
                } else {
                  style.setProperty(prop, '#e5e7eb', 'important');
                }
              }
            });
          });
        },
      });

      // 恢复原始样式
      document.body.style.backgroundColor = originalBodyBg;
      document.body.style.color = originalBodyColor;
      resumeElement.style.backgroundColor = originalResumeBg;
      resumeElement.style.color = originalResumeColor;

      hiddenStyles.forEach(({ element, display }) => {
        element.style.display = display;
      });

      // 恢复原始样式
      originalStyles.forEach(({ element, styles }) => {
        if (styles.color !== undefined) {
          element.style.color = styles.color;
        } else {
          element.style.color = '';
        }
        if (styles.backgroundColor !== undefined) {
          element.style.backgroundColor = styles.backgroundColor;
        } else {
          element.style.backgroundColor = '';
        }
        if (styles.borderColor !== undefined) {
          element.style.borderColor = styles.borderColor;
        } else {
          element.style.borderColor = '';
        }
      });

      // 计算 PDF 尺寸
      const imgWidth = 210; // A4 宽度 (mm)
      const pageHeight = 297; // A4 高度 (mm)
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const pdf = new jsPDF('p', 'mm', 'a4');

      let heightLeft = imgHeight;
      let position = 0;

      // 添加第一页
      pdf.addImage(canvas.toDataURL('image/png', 1.0), 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // 如果内容超过一页，添加更多页面
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(canvas.toDataURL('image/png', 1.0), 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // 下载 PDF
      pdf.save('resume.pdf');
    } catch (error) {
      console.error('生成 PDF 失败:', error);
      alert('生成 PDF 失败，请重试');
    }
  };

  return (
    <button
      onClick={handleDownloadPDF}
      className="rounded-lg bg-gray-900 px-6 py-2 text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
    >
      下载 PDF
    </button>
  );
}
