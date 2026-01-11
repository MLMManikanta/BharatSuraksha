function Header() {
  return (
    <header className="w-full bg-white border-b border-[#E3EEFF]">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-3">
        <img
          src="/images/Logo-circle.png"
          alt="Bharat Suraksha"
          className="w-10 h-10"
        />
        <span className="text-lg font-bold text-[#123C8A]">
          Bharat Suraksha
        </span>
      </div>
    </header>
  )
}

export default Header
