'use client'
import { FileToBase64 } from "@/actions/convert-file-to-base64";
import { Dropzone, ExtFile, FileMosaic, FileMosaicProps } from "@files-ui/react";
import * as React from "react";

export default function DrapAndDropImage( { handleImage } : { handleImage: (url: string) => void } ) {

  const [files, setFiles] = React.useState<ExtFile[]>([]);

  // * Obtenemos el archivo y lo convertimos en base64
  const updateFiles = async (incommingFiles: ExtFile[]) => {
    
    const file = incommingFiles[0].file as File
    const base64 = await FileToBase64(file)
    handleImage(base64)
    
    setFiles(incommingFiles);

  };
  const removeFile = (id: FileMosaicProps['id']) => {
    // * Si el usuario borra la imagen
    handleImage('')
    setFiles(files.filter((x) => x.id !== id));
  };
  return (
    <Dropzone
      onChange={updateFiles}
      value={files}
      header={false}
      footer={false}
      label="Agregar una imagen"
      accept=".webp,.png,.jpg,.jpeg/*"
      maxFiles={1}
      minHeight={135}
    >
      {files.map((file) => (
        <FileMosaic 
          key={file.id} 
          {...file} 
          onDelete={removeFile} 
          preview
          resultOnTooltip
          alwaysActive 
        />
      ))}
    </Dropzone>
  );
}
