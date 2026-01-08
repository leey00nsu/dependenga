import { toast } from "sonner";
import type { Dependency } from "@/entities/dependency/model/types";
import { SHARE_QUERY_LIMIT } from "@/shared/lib/share-query";
import { buildShareUrl } from "../model/share-utils";

interface ShareUrlButtonProps {
  dependencies: Dependency[];
  className?: string;
  label?: string;
}

export function ShareUrlButton({
  dependencies,
  className,
  label = "URL 복사",
}: ShareUrlButtonProps) {
  const handleCopy = async () => {
    const { url, tooLong } = buildShareUrl(dependencies, window.location.origin);
    if (tooLong) {
      toast.error(`URL 길이가 ${SHARE_QUERY_LIMIT}자를 초과했습니다.`);
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      toast.success("URL이 복사되었습니다.");
    } catch {
      toast.error("URL 복사에 실패했습니다.");
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={className}
      disabled={dependencies.length === 0}
    >
      {label}
    </button>
  );
}
