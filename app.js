// הסברים על הכלים
const toolDescriptions = {
  "אקסטרודר": "חובה לחבוש משקפי מגן וכפפות חום. יש לוודא תקינות ונטילציה ואיסור מוחלט על הכנסת ידיים לאזור החם/הנע.",
  "מערכת שקילה": "יש לוודא נעילת משטחים, בדיקת כבלי חשמל ותקינות החיישנים לפני ההפעלה.",
  "מלגזה": "חובת חגירת חגורת בטיחות, בדיקת בלמים והרמה בגובה מותר בלבד. נסיעה לפי שבילים מוגדרים.",
  "מערכת מים/צ'ילר": "יש לבדוק לחצים, נזילות מים ולוודא כי שסתומי הלחץ פתוחים ותקינים."
};

// הצגת הסבר על כלי
document.getElementById('tool-select').addEventListener('change', (e) => {
  const tool = e.target.value;
  const infoBox = document.getElementById('tool-info');
  const descText = document.getElementById('tool-desc');
  
  if (toolDescriptions[tool]) {
    descText.innerText = toolDescriptions[tool];
    infoBox.style.display = 'block';
  } else {
    infoBox.style.display = 'none';
  }
});

// משוב בזמן אמת לשאלות
document.getElementById('q1').addEventListener('change', (e) => {
  const feedback = document.getElementById('q1-feedback');
  if (e.target.value === 'correct') {
    feedback.innerText = '✓ תשובה נכונה!';
    feedback.style.color = 'green';
  } else if (e.target.value) {
    feedback.innerText = '✗ תשובה שגויה, נסה שוב.';
    feedback.style.color = 'red';
  } else {
    feedback.innerText = '';
  }
});

document.getElementById('q2').addEventListener('change', (e) => {
  const feedback = document.getElementById('q2-feedback');
  if (e.target.value === 'correct') {
    feedback.innerText = '✓ תשובה נכונה!';
    feedback.style.color = 'green';
  } else if (e.target.value) {
    feedback.innerText = '✗ תשובה שגויה, נסה שוב.';
    feedback.style.color = 'red';
  } else {
    feedback.innerText = '';
  }
});

// ניהול קנווס החתימה
const canvas = document.getElementById('sig-canvas');
const ctx = canvas.getContext('2d');
let isDrawing = false;

function getPos(e) {
  const rect = canvas.getBoundingClientRect();
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;
  return { x: clientX - rect.left, y: clientY - rect.top };
}

canvas.addEventListener('mousedown', (e) => { isDrawing = true; ctx.beginPath(); const p = getPos(e); ctx.moveTo(p.x, p.y); });
canvas.addEventListener('mousemove', (e) => { if (isDrawing) { const p = getPos(e); ctx.lineTo(p.x, p.y); ctx.stroke(); } });
canvas.addEventListener('mouseup', () => isDrawing = false);

canvas.addEventListener('touchstart', (e) => { isDrawing = true; ctx.beginPath(); const p = getPos(e); ctx.moveTo(p.x, p.y); e.preventDefault(); });
canvas.addEventListener('touchmove', (e) => { if (isDrawing) { const p = getPos(e); ctx.lineTo(p.x, p.y); ctx.stroke(); e.preventDefault(); } });
canvas.addEventListener('touchend', () => isDrawing = false);

document.getElementById('btn-clear-sig').addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// שמירה והפקה כ-PDF/הדפסה נקייה
document.getElementById('btn-submit').addEventListener('click', () => {
  const site = document.getElementById('site-select').value;
  const tool = document.getElementById('tool-select').value;
  const trainee = document.getElementById('trainee-name').value;
  const instructor = document.getElementById('instructor-name').value;
  const q1 = document.getElementById('q1').value;
  const q2 = document.getElementById('q2').value;

  if (!site || !tool || !trainee || !instructor) {
    alert('נא למלא את כל השדות (מיקום, כלי, שם עובד ומדריך)');
    return;
  }

  if (q1 !== 'correct' || q2 !== 'correct') {
    alert('יש לענות נכון על שתי שאלות הבטיחות לפני השמירה');
    return;
  }

  // פתיחת דיאלוג הדפסה/שמירה כ-PDF מובנה בדפדפן
  window.print();
});
