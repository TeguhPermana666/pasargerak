export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto print:hidden">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <h3 className="text-lg font-bold text-pg-primary">PasarGerak</h3>
            <p className="text-sm text-gray-500">Belanja pasar tradisional, senyaman belanja online.</p>
          </div>
          <div className="flex gap-6 text-sm text-gray-600">
            <a href="#" className="hover:text-pg-primary">Tentang Kami</a>
            <a href="#" className="hover:text-pg-primary">Bantuan</a>
            <a href="#" className="hover:text-pg-primary">Mitra</a>
          </div>
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} PasarGerak. Hak Cipta Dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
}