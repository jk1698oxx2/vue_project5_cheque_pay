import { onMounted, onUnmounted } from 'vue';
import { Html5QrcodeScanner } from 'html5-qrcode';

export function useQrScanner(elementId: string, onScanSuccess: (decodedText: string) => void) {
  let scanner: Html5QrcodeScanner | null = null;

  onMounted(() => {
    scanner = new Html5QrcodeScanner(elementId, { fps: 10, qrbox: 250 }, false);
    scanner.render((decodedText) => {
      onScanSuccess(decodedText);
    }, (error) => {
        console.warn('QR code scan error:', error);
    });
  });

  onUnmounted(() => {
    if (scanner) {
      scanner.clear().catch(console.error);
    }
  });
}