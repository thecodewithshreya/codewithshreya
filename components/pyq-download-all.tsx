import { Download } from "lucide-react";

export function PyqDownloadAll({
  bulkDownloadUrl,
}: {
  bulkDownloadUrl: string;
}) {
  return (
    <a
      href={bulkDownloadUrl}
      target="_blank"
      rel="noreferrer"
      className="button-primary shrink-0 !rounded-md !px-6 !py-3 !text-white shadow-purple-900/25"
    >
      <Download size={17} className="shrink-0" />
      Download all PYQs
    </a>
  );
}
