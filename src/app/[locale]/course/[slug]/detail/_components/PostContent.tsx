// PostTimer.tsx
import NEditor from "@/components/_commons/NEditor";
import {
  SectionProgress,
  UpdateSectionProgressPayload,
} from "@/models/course/section-progress.model";
import {
  Section,
  SectionContent,
  SectionType,
} from "@/models/course/section.model";
import { useEffect, useState } from "react";

interface PostTimerProps {
  content: SectionContent;
  section: Section;
  progress: SectionProgress;
  updateProgress: (payload: UpdateSectionProgressPayload) => void;
}

const PostContent = ({ progress, content, updateProgress }: PostTimerProps) => {
  const [viewedTime, setViewedTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const stopTimer = () => {
      clearInterval(interval);
    };

    const startTimer = () => {
      interval = setInterval(() => {
        setViewedTime((prevTime) => prevTime + 5);
      }, 5000);
    };

    if (progress?.section?.id === content?.id && !progress.completed) {
      startTimer();
    } else {
      stopTimer();
    }
    return () => {
      stopTimer();
    };
  }, [content, progress]);

  useEffect(() => {
    if (
      content &&
      content?.type === SectionType.Post &&
      content.estimatedTime &&
      viewedTime >= content.estimatedTime / 3
    ) {
      updateProgress({ completed: true });
    }
  }, [content, viewedTime]);

  useEffect(() => {
    setViewedTime(0);
  }, [content]);

  return (
    <div>
      {content.post?.content && (
        <NEditor value={content.post?.content} readOnly={true} />
      )}
    </div>
  );
};

export default PostContent;
