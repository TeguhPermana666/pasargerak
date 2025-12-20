'use client';

export default function PrintButton() {
  
  // Fungsi untuk Download PDF
  const handleDownloadPDF = async () => {
    // Kita cari elemen label berdasarkan ID yang nanti kita pasang di page.tsx
    const element = document.getElementById('label-area');
    
    if (element) {
      // Import library secara dinamis (agar tidak error di server)
      const html2pdf = (await import('html2pdf.js')).default;
      
      const opt = {
        margin:       0.5, // Margin pinggir kertas (inch)
        filename:     'Label-PasarGerak.pdf',
        image:        { type: 'jpeg' as const, quality: 0.98 },
        html2canvas:  { scale: 2 }, // Scale 2 biar teks tajam/tidak buram
        jsPDF:        { unit: 'in', format: 'a6', orientation: 'portrait' as const } // Format A6 (ukuran resi standar)
      };

      // Eksekusi konversi
      html2pdf().set(opt).from(element).save();
    }
  };

  return (
    <div className="print:hidden mb-8 flex flex-col items-center gap-3">
      <div className="flex gap-3">
        {/* Tombol Print Langsung */}
        <button 
          onClick={() => window.print()} 
          className="bg-pg-primary text-white px-5 py-2.5 rounded-lg font-bold hover:bg-green-800 transition-colors shadow-md flex items-center gap-2"
        >
          🖨️ Print Langsung
        </button>

        {/* Tombol Download PDF (Baru) */}
        <button 
          onClick={handleDownloadPDF} 
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-md flex items-center gap-2"
        >
          📄 Download PDF
        </button>
      </div>
      
      <p className="text-xs text-gray-500">
        Tips: Pilih 'Download PDF' untuk menyimpan arsip digital.
      </p>
    </div>
  );
}