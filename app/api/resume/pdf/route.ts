import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function GET(request: NextRequest) {
  let browser;
  
  try {
    const protocol = request.headers.get('x-forwarded-proto') || 'http';
    const host = request.headers.get('host') || 'localhost:3000';
    const resumeUrl = `${protocol}://${host}/resume`;

    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
      ],
    });

    const page = await browser.newPage();

    await page.setViewport({
      width: 794,
      height: 1123,
      deviceScaleFactor: 2,
    });

    await page.goto(resumeUrl, {
      waitUntil: 'networkidle0',
      timeout: 30000,
    });

    await page.waitForSelector('.resume-paper', { timeout: 10000 });

    await page.addStyleTag({
      url: 'https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&display=swap'
    });

    await page.addStyleTag({
      content: `
        * {
          font-family: "Noto Sans SC", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif !important;
        }
      `
    });

    await page.evaluateHandle('document.fonts.ready');

    await new Promise(resolve => setTimeout(resolve, 2000));

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '15mm',
        right: '10mm',
        bottom: '15mm',
        left: '10mm',
      },
      preferCSSPageSize: false,
    });

    await browser.close();

    const filename = `陈灼-前端工程师-简历-${new Date().getFullYear()}.pdf`;
    const encodedFilename = encodeURIComponent(filename);

    return new NextResponse(Buffer.from(pdf), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename*=UTF-8''${encodedFilename}`,
      },
    });
  } catch (error) {
    console.error('[PDF] 生成失败:', error instanceof Error ? error.message : String(error));
    
    if (browser) {
      try {
        await browser.close();
      } catch (closeError) {
        console.error('[PDF] 关闭浏览器失败:', closeError);
      }
    }

    return NextResponse.json(
      { 
        error: '生成 PDF 失败，请稍后重试',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
