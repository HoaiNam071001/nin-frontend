// import DarkModeSwitcher from "./DarkModeSwitcher";
// import DropdownMessage from "./DropdownMessage";
// import DropdownNotification from "./DropdownNotification";
// import DropdownUser from "./DropdownUser";
import { HEADER_HEIGHT, ROUTES } from "@/constants";
import useAuth from "@/hooks/useAuth";
import { useI18nRouter } from "@/hooks/useI18nRouter";
import CustomImage from "../_commons/CustomImage";
import { I18nLink } from "../_commons/I18nLink";
import NButton from "../_commons/NButton";
import { Category } from "./Category";
import DropdownUser from "./DropdownUser";
import NotificationDropdown from "./NotificationDropdown";
import SystemSearch from "./SystemSearch";

const Header = ({ showCategory = true }) => {
  const { isAuthenticated, currentUser } = useAuth();
  const router = useI18nRouter();

  return (
    <header
      className="sticky top-0 z-999 w-full bg-white drop-shadow-1 shadow-default px-4 py-2 flex items-center"
      style={{
        height: HEADER_HEIGHT,
      }}
    >
      <div className="flex items-center gap-2">
        <I18nLink href={ROUTES.HOME} className="cursor-pointer">
          <CustomImage src={"/images/logo-full.png"} alt={"logo"}></CustomImage>
        </I18nLink>
        {showCategory && <Category></Category>}
      </div>

      <div className="mx-auto flex-1 px-3 max-w-[600px]">
        <SystemSearch></SystemSearch>
      </div>

      <div className="flex items-center gap-3 ml-auto">
        <NotificationDropdown />
        {/* <LanguageSwitcher /> */}

        {isAuthenticated && currentUser ? (
          <div className="gap-8 flex items-center">
            {/* <SvgIcon icon="bell" className="icon icon-md text-black" /> */}
            <DropdownUser />
          </div>
        ) : (
          <>
            <NButton
              variant="outlined"
              onClick={() => router.push(ROUTES.SIGN_IN)}
            >
              <span>Sign In</span>
            </NButton>
            <NButton onClick={() => router.push(ROUTES.SIGN_UP)}>
              <span>Sign Up</span>
            </NButton>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
