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

// תצוגת תמונה מצולמת
document.getElementById('camera-input').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(evt) {
      const img = document.getElementById('photo-preview');
      img.src = evt.target.result;
      document.getElementById('photo-preview-container').style.display = 'block';
    };
    reader.readAsDataURL(file);
  }
});

// מנוע חתימה
function initSignatureCanvas(canvasId, clearBtnId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let isDrawing = false;

  ctx.lineWidth = 2;
  ctx.strokeStyle = "#000000";

  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    let clientX = e.clientX;
    let clientY = e.clientY;

    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }

  function startDrawing(e) {
    isDrawing = true;
    ctx.beginPath();
    const pos = getPos(e);
    ctx.moveTo(pos.x, pos.y);
  }

  function draw(e) {
    if (!isDrawing) return;
    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  }

  function stopDrawing() {
    isDrawing = false;
  }

  canvas.addEventListener('mousedown', startDrawing);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', stopDrawing);
  canvas.addEventListener('mouseleave', stopDrawing);

  canvas.addEventListener('touchstart', (e) => { startDrawing(e); e.preventDefault(); }, { passive: false });
  canvas.addEventListener('touchmove', (e) => { draw(e); e.preventDefault(); }, { passive: false });
  canvas.addEventListener('touchend', (e) => { stopDrawing(); e.preventDefault(); }, { passive: false });

  document.getElementById(clearBtnId).addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  });
}

// הפעלת החתימות
initSignatureCanvas('sig-trainee', 'btn-clear-trainee');
initSignatureCanvas('sig-instructor', 'btn-clear-instructor');

// הפקת PDF מלא והמרה זמנית של השדות לטקסט
document.getElementById('btn-submit').addEventListener('click', () => {
  const siteSelect = document.getElementById('site-select');
  const toolSelect = document.getElementById('tool-select');
  const traineeInput = document.getElementById('trainee-name');
  const instructorInput = document.getElementById('instructor-name');
  const q1Select = document.getElementById('q1');
  const q2Select = document.getElementById('q2');

  if (!siteSelect.value || !toolSelect.value || !traineeInput.value || !instructorInput.value) {
    alert('נא למלא את כל השדות (מיקום, כלי, שם עובד ומדריך)');
    return;
  }

  if (q1Select.value !== 'correct' || q2Select.value !== 'correct') {
    alert('יש לענות נכון על שתי שאלות הבטיחות לפני השמירה');
    return;
  }

  // עדכון השדות השטוחים לתצוגת ההדפסה
  document.getElementById('site-val').innerText = siteSelect.value;
  document.getElementById('tool-val').innerText = toolSelect.value;
  document.getElementById('trainee-val').innerText = traineeInput.value;
  document.getElementById('instructor-val').innerText = instructorInput.value;
  document.getElementById('q1-val').innerText = q1Select.options[q1Select.selectedIndex].text;
  document.getElementById('q2-val').innerText = q2Select.options[q2Select.selectedIndex].text;

  // הפעלת מצב הדפסה
  document.body.classList.add('is-printing');

  // פתיחת חלון הדפסה/שמירה כ-PDF
  setTimeout(() => {
    window.print();
    // ביטול מצב הדפסה לאחר סגירת החלון
    setTimeout(() => {
      document.body.classList.remove('is-printing');
    }, 1000);
  }, 100);
});
