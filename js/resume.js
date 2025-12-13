document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('year').textContent = new Date().getFullYear();
  const { jsPDF } = window.jspdf;

  document.getElementById('generate').addEventListener('click', () => {
    const name = document.getElementById('name').value || 'ABADURRAHMAN';
    const title = document.getElementById('title').value || '';
    const email = document.getElementById('email').value || '';
    const phone = document.getElementById('phone').value || '';
    const summary = document.getElementById('summary').value || '';
    const education = document.getElementById('education').value || '';
    const skills = document.getElementById('skills').value || '';

    const doc = new jsPDF({unit:'pt', format:'a4'});
    const margin = 40;
    let y = 60;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text(name, margin, y);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`${title}`, margin, y + 22);

    doc.setFontSize(10);
    doc.setTextColor(90);
    doc.text(`${email} • ${phone}`, margin, y + 42);

    y += 80;
    doc.setTextColor(0);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Summary', margin, y);
    doc.setFont('helvetica','normal');
    doc.setFontSize(10);
    doc.text(doc.splitTextToSize(summary, 500), margin, y + 18);
    y += 80;

    doc.setFont('helvetica','bold');
    doc.text('Education', margin, y);
    doc.setFont('helvetica','normal');
    doc.setFontSize(10);
    doc.text(doc.splitTextToSize(education, 500), margin, y + 18);
    y += 80;

    doc.setFont('helvetica','bold');
    doc.text('Skills', margin, y);
    doc.setFont('helvetica','normal');
    doc.setFontSize(10);
    doc.text(skills, margin, y + 18);

    doc.save(`${name.replaceAll(' ','_')}_Resume.pdf`);
  });

  document.getElementById('downloadResume').addEventListener('click', () => {
    window.location.href = 'assets/resume.pdf';
  });
});
