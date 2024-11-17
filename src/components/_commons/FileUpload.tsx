import React, { useState } from 'react';
import CustomImage from './CustomImage';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);

      // Create a Blob from the selected file
      const blob = new Blob([selectedFile], { type: selectedFile.type });

      // Generate a URL from the Blob
      const blobUrl = URL.createObjectURL(blob);

      // Save the Blob URL to the previewUrl state
      setPreviewUrl(blobUrl);
    }
  };


  const handleRemoveFile = () => {
    setFile(null);
    setFileName('');
    setPreviewUrl('');
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <div className="flex flex-col items-center">
        {/* File Input */}
        <label
          htmlFor="file-upload"
          className="cursor-pointer flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Upload File
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>

        {/* File name and preview */}
        {file && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-700">{fileName}</p>
            {previewUrl && (
              <div className="mt-2">
                <CustomImage
                  src={previewUrl}
                  alt="preview"
                  className="w-32 h-32 object-cover rounded-lg"
                />
              </div>
            )}
            <button
              onClick={handleRemoveFile}
              className="mt-2 text-sm text-red-500 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Remove File
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
