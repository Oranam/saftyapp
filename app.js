// רישום Service Worker לעבודה באופליין
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js')
    .then(() => console.log('Service Worker Registered'));
}

// קביעת תאריך ושעה אוטומטיים
document.getElementById('dateTime').value = new Date().toLocaleString();

// אתחול משטחי חתימה
const empSigCanvas = document.getElementById('empSigCanvas');
const instSigCanvas = document.getElementById('instSigCanvas');
const empSignaturePad = new SignaturePad(empSigCanvas);
const instSignaturePad = new SignaturePad(instSigCanvas);

function clearSig(pad) {
  pad.clear();
}

// מילון שפות לבסיס הממשק
const dictionary = {
  he: { title: "הדרכת בטיחות בציוד", datetime: "תאריך ושעה:", location: "מקום ההדרכה:" },
  en: { title: "Equipment Safety Training", datetime: "Date & Time:", location: "Location:" },
  hi: { title: "उपकरण सुरक्षा प्रशिक्षण", datetime: "दिनांक और समय:", location: "स्थान:" },
  th: { title: "การฝึกอบรมความปลอดภัยของอุปกรณ์", datetime: "วันที่และเวลา:", location: "สถานที่:" }
};

function changeLanguage(lang) {
  document.getElementById('lbl-title').innerText = dictionary[lang].title;
  document.getElementById('lbl-datetime').innerText = dictionary[lang].datetime;
  document.getElementById('lbl-location').innerText = dictionary[lang].location;
  // כנ"ל לשאר התיקויות והטקסטים בטופס
}

// שמירת נתונים ב-IndexedDB לעבודה ללא אינטרנט
function saveToOfflineDB(data) {
  const request = indexedDB.open("SafetyDB", 1);
  request.onupgradeneeded = (e) => {
    const db = e.target.result;
    db.createObjectStore("submissions", { autoIncrement: true });
  };
  request.onsuccess = (e) => {
    const db = e.target.result;
    const tx = db.transaction("submissions", "readwrite");
    tx.objectStore("submissions").add(data);
    alert("הטופס נשמר בהצלחה במכשיר (אופליין)!");
  };
}

// יצירת PDF וסיום
function submitForm() {
  const data = {
    empName: document.getElementById('empName').value,
    empId: document.getElementById('empId').value,
    location: document.getElementById('location').value,
    date: document.getElementById('dateTime').value,
    equipment: document.getElementById('equipmentType').value
  };

  // שמירה מקומית
  saveToOfflineDB(data);

  // הפקת קובץ PDF
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  
  doc.text(`Safety Form - ${data.empName}`, 10, 10);
  doc.text(`Date: ${data.date}`, 10, 20);
  doc.text(`Equipment: ${data.equipment}`, 10, 30);
  
  // הוספת החתימה ל-PDF
  if (!empSignaturePad.isEmpty()) {
    const sigData = empSignaturePad.toDataURL();
    doc.addImage(sigData, 'PNG', 10, 40, 50, 25);
  }

  doc.save(`Safety_Form_${data.empId}.pdf`);
}