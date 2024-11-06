import { FaDroplet } from "react-icons/fa6";
import styles from "./CardTemplate.module.scss";
import jsPDF from "jspdf";
import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import { ImageCropper } from "./ImageCropper";

interface CardStyles {
  [key: string]: React.CSSProperties;
}

const cardStyles: CardStyles = {
  card: {
    display: "flex",
    flexDirection: "column",
    width: "85.6mm",
    height: "53.98mm",
    border: "0.3mm solid black",
    borderRadius: "2mm",
    padding: "2mm 4mm",
  },

  header: {
    display: "grid",
    gridTemplateColumns: "1fr max-content 1fr",
    alignItems: "center",
    justifyContent: "space-between",
    height: "18mm",
    width: "100%",
    gap: "2mm",
    textAlign: "center",
  },

  droplet: {
    margin: "0 auto",
    color: "red",
    fontSize: "10mm",
  },

  photo: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  photoContent: {
    maxWidth: "100%",
    maxHeight: "18mm",
    objectFit: "cover",
  },

  body: {
    display: "flex",
    padding: "3mm",
  },

  left: {
    width: "50%",
  },

  right: {
    width: "50%",
    display: "flex",
    flexDirection: "column",
    gap: "2mm",
    textAlign: "right",
  },

  label: {
    color: "#000",
    fontSize: "2.5mm",
    lineHeight: "100%",
    fontWeight: 800,
    textTransform: "uppercase",
    margin: 0,
    padding: 0,
  },

  labelEng: {
    fontSize: "2mm",
    lineHeight: "100%",
    margin: "0",
    padding: "0",
  },

  textName: {
    color: "red",
    fontSize: "3mm",
    fontWeight: 800,
    margin: "0",
    padding: "0",
  },

  textContent: {
    color: "red",
    fontSize: "2.5mm",
    fontWeight: 800,
    margin: "0",
    padding: "0",
  },

  textPhone: {
    color: "#000",
    fontSize: "2.5mm",
    fontWeight: 800,
    margin: "0",
    padding: "0",
  },

  h1: {
    color: "red",
    fontSize: "6mm",
    lineHeight: "100%",
    fontWeight: 800,
    margin: 0,
    padding: 0,
  },

  h2: {
    color: "red",
    fontSize: "3mm",
    lineHeight: "100%",
    fontWeight: 600,
    margin: 0,
    padding: 0,
  },

  h3: {
    color: "#000",
    fontSize: "2mm",
    lineHeight: "100%",
    fontWeight: 600,
    margin: 0,
    padding: 0,
  },

  h4: {
    color: "#000",
    fontSize: "1.5mm",
    lineHeight: "100%",
    fontWeight: 600,
    margin: 0,
    padding: 0,
  },

  p: {
    margin: 0,
    padding: 0,
  },
};
export const CardTemplate = () => {
  const templateRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    fullName: "Jan Kowalski",
    consultantName: "Anna Nowak",
    consultantPhone: "+48 123 456 789",
    familyPhone: "+48 987 654 321",
  });
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetImage = () => {
    setImageSrc(null);
    setCroppedImage(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const generatePDF = async () => {
    if (templateRef.current) {
      const canvas = await html2canvas(templateRef.current, {
        scale: 2,
      });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: [85.6, 53.98],
      });

      pdf.addImage(imgData, "PNG", 0, 0, 85.6, 53.98);
      pdf.save("ttp-card.pdf");
    }
  };
  return (
    <div className={styles.container}>
      {imageSrc && (
        <ImageCropper
          image={imageSrc}
          setImage={setCroppedImage}
          reset={resetImage}
        />
      )}
      <div>
        <label htmlFor="name">Imię i nazwisko pacjenta:</label>
        <input
          type="text"
          id="name"
          value={formData.fullName}
          onChange={(e) =>
            setFormData({ ...formData, fullName: e.target.value })
          }
        />
        <label htmlFor="consultantName">Imię i nazwisko lekarza:</label>
        <input
          type="text"
          id="consultantName"
          value={formData.consultantName}
          onChange={(e) =>
            setFormData({ ...formData, consultantName: e.target.value })
          }
        />
        <label htmlFor="consultantPhone">Numer telefonu lekarza:</label>
        <input
          type="text"
          id="consultantPhone"
          value={formData.consultantPhone}
          onChange={(e) =>
            setFormData({ ...formData, consultantPhone: e.target.value })
          }
        />
        <label htmlFor="consultantPhone">Numer telefonu do rodziny:</label>
        <input
          type="text"
          id="consultantPhone"
          value={formData.familyPhone}
          onChange={(e) =>
            setFormData({ ...formData, familyPhone: e.target.value })
          }
        />
        <label htmlFor="image">Dodaj zdjęcie:</label>
        <input
          type="file"
          accept="image/*"
          id="image"
          onChange={onFileChange}
          ref={fileInputRef}
        />
      </div>
      <div style={cardStyles.card} ref={templateRef}>
        <div style={cardStyles.header}>
          <FaDroplet style={cardStyles.droplet} />
          <div>
            <h1 style={cardStyles.h1}>CHORUJĘ NA TTP</h1>
            <h2 style={cardStyles.h2}>I suffer from TTP</h2>
            <h3 style={cardStyles.h3}>TTP - zakrzepowa plamica małopłytkowa</h3>
            <h4 style={cardStyles.h4}>
              TTP - Thrombotic Thrombocytopenic Purpura
            </h4>
          </div>
          <div style={cardStyles.photo}>
            {croppedImage ? (
              <img
                src={croppedImage}
                alt="User upload"
                style={cardStyles.photoContent}
              />
            ) : (
              <img
                src="https://placehold.co/350x450"
                alt=""
                style={cardStyles.photoContent}
              />
            )}
          </div>
        </div>
        <div style={cardStyles.body}>
          <div style={cardStyles.left}></div>
          <div style={cardStyles.right}>
            <div>
              <p style={cardStyles.label}>imię i nazwisko pacjenta</p>
              <p style={cardStyles.labelEng}>Patient Name</p>
              <p style={cardStyles.textName}>{formData.fullName}</p>
            </div>
            <div>
              <p style={cardStyles.label}>lekarz prowadzący</p>
              <p style={cardStyles.labelEng}>Consultant Name</p>
              <p style={cardStyles.textContent}>{formData.consultantName}</p>
              <p style={cardStyles.textPhone}>{formData.consultantPhone}</p>
            </div>
            <div>
              <p style={cardStyles.label}>kontakt do rodziny</p>
              <p style={cardStyles.labelEng}>Family Contact No</p>
              <p style={cardStyles.textPhone}>{formData.familyPhone}</p>
            </div>
          </div>
        </div>
      </div>

      <button onClick={generatePDF}>Generate PDF</button>
    </div>
  );
};
