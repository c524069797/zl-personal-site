'use client'

import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export function DownloadPDFButton() {
  const handleDownloadPDF = async () => {
    const resumeElement = document.querySelector('.resume-content') as HTMLElement

    if (!resumeElement) {
      alert('未找到简历内容')
      return
    }

    try {
      const originalBodyBg = document.body.style.backgroundColor
      const originalBodyColor = document.body.style.color
      const originalResumeBg = resumeElement.style.backgroundColor
      const originalResumeColor = resumeElement.style.color

      const hiddenElements = document.querySelectorAll('.print\\:hidden')
      const hiddenStyles: Array<{ element: HTMLElement; display: string }> = []

      hiddenElements.forEach(el => {
        const htmlEl = el as HTMLElement
        hiddenStyles.push({ element: htmlEl, display: htmlEl.style.display })
        htmlEl.style.display = 'none'
      })

      document.body.style.backgroundColor = 'white'
      document.body.style.color = 'black'
      resumeElement.style.backgroundColor = 'white'
      resumeElement.style.color = 'black'

      const allTextElements = resumeElement.querySelectorAll('*')
      const originalStyles: Array<{
        element: HTMLElement
        styles: {
          color?: string
          backgroundColor?: string
          borderColor?: string
        }
      }> = []

      allTextElements.forEach(el => {
        const htmlEl = el as HTMLElement
        const computedStyle = window.getComputedStyle(htmlEl)
        const styles: {
          color?: string
          backgroundColor?: string
          borderColor?: string
        } = {}

        if (computedStyle.color && !computedStyle.color.includes('lab')) {
          styles.color = htmlEl.style.color || ''
        }
        if (computedStyle.backgroundColor && !computedStyle.backgroundColor.includes('lab')) {
          styles.backgroundColor = htmlEl.style.backgroundColor || ''
        }
        if (computedStyle.borderColor && !computedStyle.borderColor.includes('lab')) {
          styles.borderColor = htmlEl.style.borderColor || ''
        }

        originalStyles.push({ element: htmlEl, styles })

        if (computedStyle.color && computedStyle.color.includes('lab')) {
          htmlEl.style.color = 'black'
        } else if (htmlEl.tagName.match(/^(H[1-6]|P|LI|SPAN|DIV|STRONG|A)$/i)) {
          htmlEl.style.color = 'black'
        }

        if (computedStyle.backgroundColor && computedStyle.backgroundColor.includes('lab')) {
          htmlEl.style.backgroundColor = 'white'
        }

        if (computedStyle.borderColor && computedStyle.borderColor.includes('lab')) {
          htmlEl.style.borderColor = '#e5e7eb'
        }
      })

      await new Promise(resolve => setTimeout(resolve, 200))

      const canvas = await html2canvas(resumeElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: resumeElement.scrollWidth,
        height: resumeElement.scrollHeight,
        windowWidth: resumeElement.scrollWidth,
        windowHeight: resumeElement.scrollHeight,
        ignoreElements: () => false,
        onclone: clonedDoc => {
          const allElements = clonedDoc.querySelectorAll('*')

          allElements.forEach(el => {
            const htmlEl = el as HTMLElement
            const style = htmlEl.style
            const computedStyle = window.getComputedStyle(htmlEl)

            ;['color', 'backgroundColor', 'borderColor', 'borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor'].forEach(prop => {
              const value = computedStyle.getPropertyValue(prop)

              if (value && value.includes('lab')) {
                if (prop === 'color') {
                  style.setProperty(prop, 'black', 'important')
                } else if (prop.includes('background')) {
                  style.setProperty(prop, 'white', 'important')
                } else {
                  style.setProperty(prop, '#e5e7eb', 'important')
                }
              }
            })
          })
        },
      })

      document.body.style.backgroundColor = originalBodyBg
      document.body.style.color = originalBodyColor
      resumeElement.style.backgroundColor = originalResumeBg
      resumeElement.style.color = originalResumeColor

      hiddenStyles.forEach(({ element, display }) => {
        element.style.display = display
      })

      originalStyles.forEach(({ element, styles }) => {
        element.style.color = styles.color !== undefined ? styles.color : ''
        element.style.backgroundColor = styles.backgroundColor !== undefined ? styles.backgroundColor : ''
        element.style.borderColor = styles.borderColor !== undefined ? styles.borderColor : ''
      })

      const imgWidth = 210
      const pageHeight = 297
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      const pdf = new jsPDF('p', 'mm', 'a4')

      let heightLeft = imgHeight
      let position = 0

      pdf.addImage(canvas.toDataURL('image/png', 1.0), 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft > 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(canvas.toDataURL('image/png', 1.0), 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      pdf.save('resume.pdf')
    } catch {
      alert('生成 PDF 失败，请重试')
    }
  }

  return (
    <button
      onClick={handleDownloadPDF}
      className="rounded-lg bg-gray-900 px-6 py-2 text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
    >
      下载 PDF
    </button>
  )
}
