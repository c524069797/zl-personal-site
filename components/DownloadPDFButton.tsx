"use client";

export function DownloadPDFButton() {
  const handleDownloadPDF = () => {
    window.print();
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

