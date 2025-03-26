import { useDropzone } from "react-dropzone";
import { useTranslation } from "react-i18next";
import { outerStyles, innerStyles } from "./styles";

const CustomFileUploader = ({
  accept,
  filePreprocessHandler,
  multipleFilesEnabled = false,
  maxNoOfFiles,
  dropzoneHeight = "h-[400px]",
  outerStyle = "default",
  innerStyle = "default",
  icon,
}) => {
  const { t } = useTranslation();

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      accept: accept,
      multiple: multipleFilesEnabled,
      maxFiles: maxNoOfFiles,
      onDrop(acceptedFiles) {
        acceptedFiles.forEach((file) => {
          filePreprocessHandler(file);
        });
      },
    });

  return (
    <div className="flex flex-col gap-y-5 w-full items-center">
      {isDragReject && (
        <p className="font-bold text-sm text-red-warning-heavy">
          {t("common_phases.file_uploader.invalid_file_format")}
        </p>
      )}
      <div className={`w-full ${dropzoneHeight} ${outerStyles[outerStyle]}`}>
        <div {...getRootProps()} className={`${innerStyles[innerStyle]}`}>
          {icon}
          <div className="text-center px-5">
            <input {...getInputProps()} />
            <span className="font-bold text-s7">
              {isDragActive && !isDragReject
                ? t("common_phases.file_uploader.drop_here")
                : isDragReject
                ? t("common_phases.file_uploader.select_another_files")
                : t("common_phases.file_uploader.drop_files")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomFileUploader;
