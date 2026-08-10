"use client";

import { useState } from "react";
import { logDownloadAction } from "@/lib/actions/downloads";
import { PdfViewerModal } from "@/app/components/PdfViewerModal";
import { VideoIcon, PdfIcon, DownloadIcon, EyeIcon } from "@/app/components/icons";

function resolvePdfUrl(url: string | null): string {
  if (!url || url.includes("cultiva.demo") || url.includes("example.com")) {
    return "/guias/guia-buenas-practicas-agroindustria.pdf";
  }
  return url;
}

export function LessonMediaActions({
  puntoId,
  courseId,
  lessonId,
  lessonTitle,
  videoUrl,
  pdfUrl,
}: {
  puntoId: number;
  courseId: number;
  lessonId: number;
  lessonTitle: string;
  videoUrl: string | null;
  pdfUrl: string | null;
}) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const activePdfUrl = resolvePdfUrl(pdfUrl);

  return (
    <div className="flex flex-wrap items-center gap-3 w-full">
      {/* Video Download Form */}
      {videoUrl && (
        <form action={logDownloadAction} className="w-full sm:w-auto">
          <input type="hidden" name="puntoId" value={puntoId} />
          <input type="hidden" name="courseId" value={courseId} />
          <input type="hidden" name="lessonId" value={lessonId} />
          <input type="hidden" name="fileType" value="video" />
          <input type="hidden" name="url" value={videoUrl} />
          <button type="submit" className="btn-farmer-primary w-full text-base cursor-pointer">
            <VideoIcon className="w-5 h-5" />
            <span>Descargar Video (MP4)</span>
            <DownloadIcon className="w-4 h-4 opacity-70" />
          </button>
        </form>
      )}

      {/* PDF Direct Download Form */}
      {pdfUrl && (
        <form action={logDownloadAction} className="w-full sm:w-auto">
          <input type="hidden" name="puntoId" value={puntoId} />
          <input type="hidden" name="courseId" value={courseId} />
          <input type="hidden" name="lessonId" value={lessonId} />
          <input type="hidden" name="fileType" value="pdf" />
          <input type="hidden" name="url" value={activePdfUrl} />
          <a
            href={activePdfUrl}
            download
            className="btn-farmer-secondary w-full sm:w-auto text-base cursor-pointer inline-flex items-center gap-2"
          >
            <PdfIcon className="w-5 h-5 text-emerald-700" />
            <span>Descargar Guía (PDF)</span>
            <DownloadIcon className="w-4 h-4 opacity-70" />
          </a>
        </form>
      )}

      {/* PDF Preview Modal Trigger Button */}
      {pdfUrl && (
        <button
          type="button"
          onClick={() => setIsPreviewOpen(true)}
          className="btn-farmer-secondary w-full sm:w-auto text-base hover:border-emerald-700 hover:bg-emerald-50 cursor-pointer"
        >
          <EyeIcon className="w-5 h-5 text-emerald-700" />
          <span>Ver PDF (Previsualizar)</span>
        </button>
      )}

      {/* PDF Modal Overlay */}
      {pdfUrl && (
        <PdfViewerModal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          pdfUrl={activePdfUrl}
          title={`Guía PDF: ${lessonTitle}`}
        />
      )}
    </div>
  );
}
