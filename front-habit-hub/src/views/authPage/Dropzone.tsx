import { useDropzone } from 'react-dropzone'

const Dropzone = ({
    onFileAccepted,
    previewUrl,
}: {
    onFileAccepted: (file: File) => void;
    previewUrl?: string;
}) => {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: { 'image/*': [] },
        maxFiles: 1,
        onDrop: (acceptedFiles) => {
            if (acceptedFiles.length > 0) {
                onFileAccepted(acceptedFiles[0]);
            }
        }
    });

    return (
        <div
            {...getRootProps()}
            className={`cursor-pointer rounded-full h-32 w-32 mx-auto shadow border-2 border-indigo-600 flex items-center justify-center overflow-hidden`}
        >
            <input {...getInputProps()} />
            {previewUrl ? (
                <img
                    src={previewUrl}
                    alt="profile preview"
                    className="h-full w-full object-cover"
                />
            ) : (
                <p className="text-sm text-gray-500 text-center px-2">
                    Drag & drop or click to upload
                </p>
            )}
        </div>
    );
};

export default Dropzone