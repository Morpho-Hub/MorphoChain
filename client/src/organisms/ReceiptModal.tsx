'use client';

import React, { useState } from 'react';
import { Download, X } from 'lucide-react';
import { Button } from '@/src/atoms';
import { Modal } from '@/src/molecules';
import Receipt, { ReceiptData } from './Receipt';
import { es } from '@/locales';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  receiptData: ReceiptData;
}

const ReceiptModal: React.FC<ReceiptModalProps> = ({ isOpen, onClose, receiptData }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const t = es.receipt;

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    
    try {
      // Dynamically import libraries only when needed
      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).default;

      const receiptElement = document.getElementById('receipt-content');
      if (!receiptElement) {
        console.error('Receipt element not found');
        setIsDownloading(false);
        return;
      }

      // Generate canvas from HTML
      const canvas = await html2canvas(receiptElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: receiptElement.scrollWidth,
        windowHeight: receiptElement.scrollHeight,
        ignoreElements: (element) => {
          return false;
        },
        onclone: (clonedDoc) => {
          // Remove all Tailwind classes and force inline styles
          const allElements = clonedDoc.querySelectorAll('*');
          allElements.forEach((el: any) => {
            try {
              // Get computed styles from the original element
              const computedStyle = window.getComputedStyle(el);
              
              // Apply essential inline styles
              if (el.style) {
                el.style.color = computedStyle.color || '#000000';
                el.style.backgroundColor = computedStyle.backgroundColor || 'transparent';
                el.style.fontSize = computedStyle.fontSize || '16px';
                el.style.fontWeight = computedStyle.fontWeight || 'normal';
              }
              
              // Remove class names (handle SVG elements differently)
              if (el instanceof SVGElement) {
                el.setAttribute('class', '');
              } else if (el.className && typeof el.className === 'string') {
                el.className = '';
              } else if (el.setAttribute) {
                el.setAttribute('class', '');
              }
            } catch (e) {
              // Ignore errors for elements that can't be styled
              console.debug('Could not process element:', e);
            }
          });
        },
      });

      // Calculate dimensions
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

      // Download PDF
      pdf.save(`Recibo-${receiptData.orderNumber}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error al generar el PDF. Por favor intenta de nuevo.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t.title}>
      <div className="space-y-6">
        {/* Receipt Content */}
        <Receipt data={receiptData} />

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <Button
            title={isDownloading ? 'Generando PDF...' : t.downloadPDF}
            icon={<Download className="w-5 h-5" />}
            iconPosition="left"
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            variant="blue"
            className="flex-1 bg-[#26ade4] hover:bg-[#26ade4]/90 text-white rounded-xl py-4"
          />
          <Button
            title={t.close}
            icon={<X className="w-5 h-5" />}
            iconPosition="left"
            onClick={onClose}
            variant="white_bordered"
            className="flex-1 rounded-xl py-4"
          />
        </div>
      </div>
    </Modal>
  );
};

export default ReceiptModal;
