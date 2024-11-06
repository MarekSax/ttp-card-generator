import { useState } from "react";
import Cropper, { Area, Point } from "react-easy-crop";
import styles from "./ImageCropper.module.scss";

interface ImageCropperProps {
  image: string;
  setImage: (image: string) => void;
  reset: () => void;
}
export const ImageCropper = ({ image, setImage, reset }: ImageCropperProps) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropComplete = (_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const getCroppedImage = async (imageSrc: string, croppedAreaPixels: Area) => {
    const image = new Image();
    image.src = imageSrc;

    return new Promise<string>((resolve, reject) => {
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) return reject(new Error("Failed to get canvas context"));

        canvas.width = croppedAreaPixels.width;
        canvas.height = croppedAreaPixels.height;

        ctx.drawImage(
          image,
          croppedAreaPixels.x,
          croppedAreaPixels.y,
          croppedAreaPixels.width,
          croppedAreaPixels.height,
          0,
          0,
          croppedAreaPixels.width,
          croppedAreaPixels.height
        );

        resolve(canvas.toDataURL("image/jpeg"));
      };

      image.onerror = () => reject(new Error("Failed to load image"));
    });
  };

  const handleSaveImage = async () => {
    if (!croppedAreaPixels) return;
    const croppedImage = await getCroppedImage(image, croppedAreaPixels);

    reset();
    setImage(croppedImage);
  };

  return (
    <div className={styles.imageCropper__container}>
      <div className={styles.imageCropper__wrapper}>
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={3 / 4}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>
        <div className={styles.imageCropper__controls}>
          <label htmlFor="zoom">Powiększenie: </label>
          <input
            type="range"
            name="zoom"
            id="zoom"
            min={1}
            max={1.5}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(+e.target.value)}
          />
        </div>
        <div>
          <button onClick={reset}>Anuluj</button>
          <button onClick={handleSaveImage}>Zapisz</button>
        </div>
      </div>
    </div>
  );
};
