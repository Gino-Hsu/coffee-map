import LanguageSelect from './languageSelect';
import LoginComponent from './loginComponent';
import LogoComponent from './logoComponent';
import MemberMenu from './memberMenu';

export default function HeaderLayout() {
  return (
    <header className="bg-[#f6efe7] text-black h-16 shadow-md">
      <div className="h-full mx-7 flex items-center  justify-between">
        <LogoComponent />
        <div className="flex items-center gap-4">
          <LoginComponent />
          <LanguageSelect />
          <MemberMenu />
        </div>
      </div>
    </header>
  );
}
