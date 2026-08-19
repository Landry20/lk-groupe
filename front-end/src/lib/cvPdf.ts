import { jsPDF } from 'jspdf'
import { asset } from './asset'
import { company, cv, flagshipProducts, services } from '../data/content'

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('logo'))
    img.src = src
  })
}

function toDataUrl(img: HTMLImageElement) {
  const canvas = document.createElement('canvas')
  canvas.width = img.naturalWidth
  canvas.height = img.naturalHeight
  const ctx = canvas.getContext('2d')
  if (!ctx) return ''
  ctx.drawImage(img, 0, 0)
  return canvas.toDataURL('image/jpeg', 0.92)
}

export async function downloadCvPdf() {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const navy: [number, number, number] = [0, 35, 78]
  const blue: [number, number, number] = [0, 123, 255]
  const orange: [number, number, number] = [255, 121, 0]
  const muted: [number, number, number] = [74, 98, 128]
  const pageW = 210
  const margin = 16

  doc.setFillColor(...navy)
  doc.rect(0, 0, pageW, 42, 'F')
  doc.setFillColor(...orange)
  doc.rect(0, 42, pageW, 2.2, 'F')

  try {
    const logo = await loadImage(asset('/logos/logo-light.jpeg'))
    doc.addImage(toDataUrl(logo), 'JPEG', margin, 8, 26, 26)
  } catch {
    doc.setFillColor(255, 255, 255)
    doc.circle(margin + 13, 21, 12, 'F')
  }

  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(22)
  doc.text(cv.name, 48, 18)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  doc.text(cv.role, 48, 26)
  doc.setFontSize(9.5)
  doc.text(`${cv.company}  ·  ${company.name}`, 48, 33)
  doc.setFontSize(8)
  doc.text(company.tagline, 48, 38.5)

  let y = 54
  doc.setTextColor(...navy)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.text('Profil', margin, y)
  y += 6
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9.5)
  doc.setTextColor(...muted)
  const pitch = doc.splitTextToSize(cv.pitch, pageW - margin * 2)
  doc.text(pitch, margin, y)
  y += pitch.length * 4.4 + 6

  doc.setTextColor(...navy)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.text('Formation', margin, y)
  y += 6
  doc.setFontSize(10)
  doc.text(cv.education.school, margin, y)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...muted)
  doc.setFontSize(9.5)
  y += 5
  doc.text(`${cv.education.diploma}  ·  ${cv.education.place}`, margin, y)
  y += 10

  doc.setTextColor(...navy)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.text('Forces', margin, y)
  y += 6
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9.5)
  doc.setTextColor(...muted)
  cv.strengths.forEach((line) => {
    doc.setFillColor(...orange)
    doc.circle(margin + 1.2, y - 1.2, 1.1, 'F')
    const wrapped = doc.splitTextToSize(line, pageW - margin * 2 - 6)
    doc.text(wrapped, margin + 6, y)
    y += wrapped.length * 4.3 + 2
  })
  y += 4

  doc.setTextColor(...navy)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.text('Compétences', margin, y)
  y += 7
  let x = margin
  cv.stack.forEach((tech) => {
    const w = doc.getTextWidth(tech) + 8
    if (x + w > pageW - margin) {
      x = margin
      y += 8
    }
    doc.setFillColor(235, 243, 252)
    doc.setDrawColor(...blue)
    doc.roundedRect(x, y - 4.6, w, 7, 1.5, 1.5, 'FD')
    doc.setTextColor(...navy)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    doc.text(tech, x + 4, y)
    x += w + 3
  })
  y += 12

  doc.setTextColor(...navy)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.text('Métiers LK-group', margin, y)
  y += 6
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9.5)
  doc.setTextColor(...muted)
  const jobs = services.map((s) => s.title).join('  ·  ')
  const jobsWrap = doc.splitTextToSize(jobs, pageW - margin * 2)
  doc.text(jobsWrap, margin, y)
  y += jobsWrap.length * 4.4 + 8

  doc.setTextColor(...navy)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.text('Logiciels livrés', margin, y)
  y += 6
  flagshipProducts.forEach((product) => {
    if (y > 262) {
      doc.addPage()
      y = 22
    }
    doc.setFillColor(...blue)
    doc.rect(margin, y - 3.2, 1.4, 8, 'F')
    doc.setTextColor(...navy)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.text(`${product.name}  —  ${product.tag}`, margin + 5, y)
    y += 5
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(...muted)
    const summary = doc.splitTextToSize(product.summary, pageW - margin * 2 - 5)
    doc.text(summary, margin + 5, y)
    y += summary.length * 4.1 + 4
  })

  y += 4
  if (y > 250) {
    doc.addPage()
    y = 22
  }
  cv.chapters.forEach((chapter) => {
    doc.setTextColor(...navy)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.text(chapter.title, margin, y)
    y += 5
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9.5)
    doc.setTextColor(...muted)
    const text = doc.splitTextToSize(chapter.text, pageW - margin * 2)
    doc.text(text, margin, y)
    y += text.length * 4.3 + 5
  })

  y += 4
  doc.setDrawColor(...orange)
  doc.setLineWidth(0.6)
  doc.line(margin, y, pageW - margin, y)
  y += 7
  doc.setTextColor(...navy)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.text('Coordonnées', margin, y)
  y += 6
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9.5)
  doc.setTextColor(...muted)
  doc.text(`Lieu : ${cv.contact.location}`, margin, y)
  y += 5
  doc.text(`Email : ${cv.contact.email}`, margin, y)
  y += 5
  doc.text(`Téléphone : ${cv.contact.phone}`, margin, y)
  y += 10
  doc.setFontSize(8)
  doc.setTextColor(...blue)
  doc.text('Les coordonnées détaillées seront complétées ensuite.', margin, y)

  doc.setFillColor(...navy)
  doc.rect(0, 287, pageW, 10, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(8)
  doc.text(`${company.name}  ·  ${company.tagline}`, margin, 293)

  doc.save('CV-Lou-Kou-LK-group.pdf')
}
