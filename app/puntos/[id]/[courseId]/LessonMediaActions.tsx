"use client";

import { useState } from "react";
import { logDownloadAction } from "@/lib/actions/downloads";
import { PdfViewerModal } from "@/app/components/PdfViewerModal";
import { VideoViewerModal } from "@/app/components/VideoViewerModal";
import { VideoIcon, PdfIcon, DownloadIcon, EyeIcon } from "@/app/components/icons";

function resolvePdfUrl(url: string | null): string {
  if (!url || url.includes("cultiva.demo") || url.includes("example.com")) {
    return "/guias/guia-buenas-practicas-agroindustria.pdf";
  }
  return url;
}

function resolveVideoUrl(url: string | null): string {
  if (!url || url.includes("cultiva.demo") || url.includes("example.com")) {
    return "/videos/video-leccion-oficial.mp4";
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
  const [isPdfPreviewOpen, setIsPdfPreviewOpen] = useState(false);
  const [isVideoPreviewOpen, setIsVideoPreviewOpen] = useState(false);

  const activePdfUrl = resolvePdfUrl(pdfUrl);
  const activeVideoUrl = resolveVideoUrl(videoUrl);

  return (
    <div className="flex flex-wrap items-center gap-3 w-full">
      {/* Video Direct Download Form */}
      {videoUrl && (
        <form action={logDownloadAction} className="w-full sm:w-auto">
          <input type="hidden" name="puntoId" value={puntoId} />
          <input type="hidden" name="courseId" value={courseId} />
          <input type="hidden" name="lessonId" value={lessonId} />
          <input type="hidden" name="fileType" value="video" />
          <input type="hidden" name="url" value={activeVideoUrl} />
          <a
            href={activeVideoUrl}
            download
            className="btn-farmer-primary w-full sm:w-auto text-base cursor-pointer inline-flex items-center gap-2"
          >
            <VideoIcon className="w-5 h-5" />
            <span>Descargar Video (MP4)</span>
            <DownloadIcon className="w-4 h-4 opacity-70" />
          </a>
        </form>
      )}

      {/* Video Preview Modal Trigger Button */}
      {videoUrl && (
        <button
          type="button"
          onClick={() => setIsVideoPreviewOpen(true)}
          className="btn-farmer-primary w-full sm:w-auto text-base hover:bg-emerald-900 cursor-pointer"
        >
          <EyeIcon className="w-5 h-5" />
          <span>Ver Video (Previsualizar)</span>
        </button>
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
          onClick={() => setIsPdfPreviewOpen(true)}
          className="btn-farmer-secondary w-full sm:w-auto text-base hover:border-emerald-700 hover:bg-emerald-50 cursor-pointer"
        >
          <EyeIcon className="w-5 h-5 text-emerald-700" />
          <span>Ver PDF (Previsualizar)</span>
        </button>
      )}

      {/* PDF Modal Overlay */}
      {pdfUrl && (
        <PdfViewerModal
          isOpen={isPdfPreviewOpen}
          onClose={() => setIsPdfPreviewOpen(false)}
          pdfUrl={activePdfUrl}
          title={`Guía PDF: ${lessonTitle}`}
        />
      )}

      {/* Video Modal Overlay */}
      {videoUrl && (
        <VideoViewerModal
          isOpen={isVideoPreviewOpen}
          onClose={() => setIsVideoPreviewOpen(false)}
          videoUrl={activeVideoUrl}
          title={`Video Lección: ${lessonTitle}`}
        />
      )}
    </div>
  );
}
