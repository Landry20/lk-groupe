export function QrBlock({ url }: { url: string }) {
  const src = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=10&data=${encodeURIComponent(url)}`

  return (
    <div className="qr-block">
      <img src={src} width={168} height={168} alt={`QR code vers ${url}`} />
      <p className="muted">Scannez pour ouvrir le projet sur le téléphone.</p>
    </div>
  )
}
