import FileUpload from "@/components/_commons/FileUpload";
import NButton from "@/components/_commons/NButton";
import NEditor from "@/components/_commons/NEditor";
import SvgIcon from "@/components/_commons/SvgIcon";
import { formatFileSize } from "@/helpers";
import { formatDate } from "@/helpers/date";
import {
  Post,
  Section,
  SectionContent,
  SectionType,
  Video,
} from "@/models/course/section.model";
import { NFile, SystemFileType } from "@/models/file.model";
import { sectionService } from "@/services/section.service";
import { toastService } from "@/services/toast.service";
import { videoService } from "@/services/video.service";
import { Button, Empty, Popconfirm } from "antd";
import { useEffect, useState } from "react";

export function SectionFileContent({
  section,
  content,
  setContent,
}: {
  section: Section;
  content: SectionContent;
  setContent: (content: SectionContent) => void;
}) {
  const handleFileUpload = (file: File) => {
    // append(newItem);
  };

  const addFile = (file: NFile) => {
    const _content = { ...content };
    if (_content.files) {
      _content.files.push(file);
    } else {
      _content.files = [file];
    }
    setContent(_content);
  };

  const removeFile = (file: NFile) => {
    const _content = { ...content };
    setContent(_content);
  };

  const updateVideo = (video: Video) => {
    const _content = { ...content };
    _content.video = video;
    setContent(_content);
  };

  const removeVideo = (video: Video) => {
    const _content = { ...content };
    _content.video = video;
    setContent(_content);
  };

  const updatePost = (post: Post) => {};

  return (
    <div className="space-y-4 border border-stroke p-3 rounded-lg bg-slate-100">
      <div className="space-y-2 overflow-y-auto relative p-2 bg-white rounded-lg">
        <div className="border border-stroke rounded-md p-2">
          {content?.type === SectionType.Video && (
            <VideoContent
              section={section}
              content={content}
              updateVideo={updateVideo}
              removeVideo={removeVideo}
            />
          )}
          {content?.type === SectionType.Post && (
            <PostContent
              section={section}
              content={content}
              updatePost={updatePost}
            />
          )}
        </div>
        <FileList
          section={section}
          files={content?.files || []}
          addFile={addFile}
          removeFile={removeFile}
        />
      </div>
    </div>
  );
}

const PostContent = ({
  section,
  content,
  updatePost,
}: {
  section: Section;
  content: SectionContent;
  updatePost: (file: Post) => void;
}) => {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState("");

  useEffect(() => {
    setText(content?.post?.content || "");
  }, [content?.post?.content]);

  const onUpdate = () => {

    // setEditing(false);
  }

  return (
    <div className="max-h-[300px] overflow-auto">
      {editing && (
        <div className="relative p-3">
          <NEditor value={content.post?.content} onChange={(e) => setText(e)} />
        </div>
      )}
      {!editing && (
        <>
          <NEditor value={text} onChange={(e) => setText(e)} />
          <div className="flex justify-end items-center mt-3">
            <NButton onClick={onUpdate}>Save</NButton>
          </div>
        </>
      )}
    </div>
  );
};

const VideoContent = ({
  section,
  content,
  updateVideo,
  removeVideo,
}: {
  section: Section;
  content: SectionContent;
  updateVideo: (file: Video) => void;
  removeVideo: (video: Video) => void;
}) => {
  const file = content?.video?.file;
  const [editing, setEditing] = useState(false);

  const handleVideoUpload = async (file: File) => {
    setEditing(false);
    const data: Video = await videoService.addVideoSection(section?.id, file);
    updateVideo(data);
  };

  const onRemoveVideo = async () => {
    try {
      await videoService.removeFile(content.video?.id);
      content.video.file = null;
      removeVideo(content.video);
    } catch (error) {
      toastService.error(error.message);
    }
  };

  return (
    <div className="max-h-[300px] overflow-auto">
      {(!file || editing) && (
        <div className="relative p-3">
          {file && (
            <NButton
              className="absolute top-3 right-3 p-0"
              size="sm-circle"
              variant="transparent"
              onClick={() => setEditing(false)}
            >
              <SvgIcon className="icon icon-sm" icon="close" />
            </NButton>
          )}
          <div className="flex justify-center">
            <FileUpload
              upload={handleVideoUpload}
              accept={"video/*"}
              label={"Upload"}
            />
          </div>
        </div>
      )}
      {!(!file || editing) && (
        <>
          <div className="mb-2">
            {file && (
              <div className="flex items-center overflow-hidden py-1">
                <div className="mr-4">
                  {/* <video className="h-[200px]" src={file.url} controls/> */}
                  <div className="min-h-[200px] min-w-[300px] bg-gray-200"></div>
                </div>
                <div className="w-[80px]">{formatFileSize(file.size)}</div>
                <div className="w-[120px]">{formatDate(file.createdAt)}</div>
                <div className=" flex items-center space-x-4">
                  <NButton onClick={() => setEditing(true)}>Edit</NButton>
                  <Popconfirm
                    placement="left"
                    title={"Delete Video"}
                    description={"Do you want to delete this Video?"}
                    okText="Yes"
                    cancelText="No"
                    onConfirm={() => onRemoveVideo()}
                  >
                    <Button className="p-0 border-0 hover:!text-red">
                      <SvgIcon className="icon icon-sm" icon="close" />
                    </Button>
                  </Popconfirm>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

const FileList = ({
  section,
  files,
  addFile,
  removeFile,
}: {
  section: Section;
  files: NFile[];
  addFile: (file: NFile) => void;
  removeFile: (file: NFile) => void;
}) => {
  const [editing, setEditing] = useState(false);

  const handleFileUpload = async (file: File) => {
    const data: NFile = await sectionService.addFile(section?.id, file);
    setEditing(false);
    if (data) {
      addFile(data);
    }
  };

  const onRemoveFile = async (file: NFile) => {
    try {
      await sectionService.removeFile(file.id);
      file.deleted = true;
      removeFile(file);
    } catch (error) {
      toastService.error(error.message);
    }
  };

  return (
    <div className="max-h-[300px] overflow-auto">
      {editing && (
        <div className="relative border border-stroke p-3">
          <NButton
            className="absolute top-3 right-3 p-0"
            size="sm-circle"
            variant="transparent"
            onClick={() => setEditing(false)}
          >
            <SvgIcon className="icon icon-sm" icon="close" />
          </NButton>
          <div className="flex justify-center">
            <FileUpload upload={handleFileUpload} label={"Upload"} />
          </div>
          {/* <div className="flex justify-end items-center">
            <NButton onClick={() => setEditing(false)}>Save</NButton>
          </div> */}
        </div>
      )}
      {!editing && (
        <>
          <div className="mb-2">
            {files?.map((file, index) => (
              <>
                {!file.deleted &&
                  file.systemType !== SystemFileType.VIDEO_CONTENT && (
                    <div
                      key={index}
                      className="flex items-center overflow-hidden py-1"
                    >
                      <div className="flex-1 text-ellipsis">{file.name}</div>
                      <div className="w-[80px]">
                        {formatFileSize(file.size)}
                      </div>
                      <div className="w-[120px]">
                        {formatDate(file.createdAt)}
                      </div>
                      <div className="w-[20px]">
                        <Popconfirm
                          placement="left"
                          title={"Delete File"}
                          description={"Do you want to delete this file?"}
                          okText="Yes"
                          cancelText="No"
                          onConfirm={() => onRemoveFile(file)}
                        >
                          <Button className="p-0 border-0 hover:!text-red">
                            <SvgIcon className="icon icon-sm" icon="close" />
                          </Button>
                        </Popconfirm>
                      </div>
                    </div>
                  )}
              </>
            ))}
          </div>
          <NButton variant="primary-outline" onClick={() => setEditing(true)}>
            Add Resources
          </NButton>
        </>
      )}
    </div>
  );
};
