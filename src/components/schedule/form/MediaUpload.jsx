import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Image as ImageIcon, Video as VideoIcon } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

const MediaUpload = ({ mediaFile, setMediaFile, mediaPreview, setMediaPreview, mediaType, setMediaType, postImage }) => {
  const { toast } = useToast();

  const handleMediaChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 20 * 1024 * 1024) { 
        toast({ title: "Arquivo muito grande", description: "O arquivo de mídia não pode exceder 20MB.", variant: "destructive" });
        return;
      }
      setMediaFile(file);
      const fileType = file.type.split('/')[0];
      setMediaType(fileType);
      setMediaPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div>
      <Label htmlFor="post-media" className="text-sm font-medium text-foreground">Mídia (Imagem/Vídeo - JPG, PNG, GIF, MP4 - Máx 20MB)</Label>
      <div className="mt-1 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
        {/* Custom file input */}
        <div className="flex-1 flex items-center gap-2">
          <input
            type="file"
            id="post-media"
            onChange={handleMediaChange}
            accept="image/jpeg,image/png,image/gif,video/mp4"
            className="hidden"
          />
          <label
            htmlFor="post-media"
            className="px-3 py-2 bg-red-100 text-red-700 rounded cursor-pointer border border-red-300 hover:bg-red-200 transition text-sm font-semibold"
          >
            Escolher arquivo
          </label>
          <span className="text-xs text-muted-foreground truncate max-w-xs">
            {mediaFile ? mediaFile.name : "Nenhum arquivo escolhido"}
          </span>
        </div>
      </div>
      {mediaPreview && (
        <div className="mt-2 border border-border rounded-md p-2 bg-muted/50 max-w-xs">
          {mediaType === 'image' && <img  alt="Preview da mídia" className="max-h-40 w-auto rounded" src={mediaPreview} />}
          {mediaType === 'video' && (
            <video controls poster={mediaPreview} className="max-h-40 w-auto rounded">
              <source src={mediaPreview} type={mediaFile?.type || 'video/mp4'} />
              {"Seu navegador não suporta a tag de vídeo."}
            </video>
          )}
        </div>
      )}
      {!mediaPreview && mediaType === 'video' && postImage && (
         <div className="mt-2 border border-border rounded-md p-2 bg-muted/50 max-w-xs flex items-center justify-center h-40">
           <VideoIcon className="h-16 w-16 text-muted-foreground" />
           <p className="ml-2 text-sm text-muted-foreground">Vídeo: {postImage}</p>
         </div>
      )}
      {!mediaPreview && mediaType === 'image' && !postImage && (
          <div className="mt-2 h-20 w-full rounded-md bg-muted flex items-center justify-center border border-dashed border-border">
            <ImageIcon className="h-10 w-10 text-muted-foreground" />
          </div>
      )}
    </div>
  );
};

export default MediaUpload;
